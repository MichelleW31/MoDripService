// BASE MODULES
import mongoose from 'mongoose';
import mqtt from 'mqtt';
import * as dotenv from 'dotenv';
import { WebSocket } from 'ws';

// CUSTOM MODULES
import logger from './logger.js';
import Mod from '../models/modModel.js';
import {
  convertToFahrenheit,
  getMoisturePercentage,
  roundHumidity,
} from '../middleware/convertSensorReadings.js';
import { startModChangeStream } from '../util/modStreams.js';

dotenv.config();

const CONNECTION_URL = process.env.MONGO_CONNECTION_URL;
const database = process.env.DATABASE_NAME;

const connectDB = (wsServer) => {
  // MONGO DB CONNECTION
  mongoose.connect(CONNECTION_URL, {
    authSource: 'admin',
    ssl: true,
    dbName: database,
  });

  const connection = mongoose.connection;

  // WEBSERVER CONNECTION
  wsServer.on('connection', (ws) => {
    logger.info('Client connected to WebSocket');

    ws.isAlive = true;

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    // WebSocket close event handler
    ws.on('close', () => {
      logger.info('Client disconnected from WebSocket');
    });

    ws.on('error', (error) => {
      logger.error(`WebSocket error: ${error}`);
    });
  });

  setInterval(() => {
    wsServer.clients.forEach((client) => {
      if (client.isAlive === false) {
        logger.info('Terminating dead WebSocket client');
        return client.terminate();
      }

      client.isAlive = false;
      client.ping();
    });
  }, 30000);

  connection.once('open', () => {
    logger.info('MongoDB database connection established successfully');

    startModChangeStream(wsServer);
  });

  // MQTT BROKER CONNECTION
  const mqttClient = mqtt.connect(
    'mqtts://902e1d0dba3944fa88c5f6caac765b57.s1.eu.hivemq.cloud',
    {
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    },
  );

  mqttClient.on('connect', () => {
    logger.info('Connected to MQTT Broker');

    mqttClient.subscribe('mod/readings/+');
    mqttClient.subscribe('mod/status/+');
  });

  mqttClient.on('message', async (topic, message) => {
    let mod;

    try {
      const payload = JSON.parse(message.toString());
      const timestamp = Date.now();

      const modId = topic.split('/')[2];

      mod = await Mod.findOne({ modId: modId }).exec();

      if (mod) {
        if (payload?.moisture) {
          mod.moisture = getMoisturePercentage(payload.moisture);
        }

        if (payload?.temperature) {
          mod.temperature = convertToFahrenheit(payload.temperature);
        }

        if (payload?.humidity) {
          mod.humidity = roundHumidity(payload.humidity);
        }

        if (payload?.sensorOn !== undefined) {
          mod.sensorOn = payload.sensorOn;
        }

        if (topic.includes('readings')) {
          mod.modStatusTimestamp = timestamp;
        }

        await mod.save();
      }
    } catch (error) {
      logger.error(`"Error handling MQTT message:" ${error}`);
    }
  });

  mqttClient.on('reconnect', () => {
    logger.info('MQTT reconnecting...');
  });

  mqttClient.on('close', () => {
    logger.warn('MQTT connection closed');
  });

  mqttClient.on('offline', () => {
    logger.warn('MQTT client offline');
  });

  mqttClient.on('error', (error) => {
    logger.error(`MQTT error: ${error}`);
  });
};

export default connectDB;
