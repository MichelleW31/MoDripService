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

  connection.once('open', () => {
    logger.info('MongoDB database connection established successfully');
  });

  // MQTT BROKER CONNECTION
  const mqttClient = mqtt.connect(
    'mqtts://902e1d0dba3944fa88c5f6caac765b57.s1.eu.hivemq.cloud',
    { username: process.env.MQTT_USERNAME, password: process.env.MQTT_PASSWORD }
  );

  mqttClient.on('connect', () => {
    logger.info('Connected to MQTT Broker');
    mqttClient.subscribe('mod/readings/+');
    mqttClient.subscribe('mod/status/+');
  });

  mqttClient.on('message', async (topic, message) => {
    let mod;

    logger.info(`topic ${topic}`);

    try {
      const payload = JSON.parse(message.toString());
      const timestamp = Date.now();

      const modId = topic.split('/')[2];

      mod = await Mod.findById(modId).exec();

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

        if (payload?.sensorOn) {
          mod.sensorOn = payload.sensorOn;
        }

        mod.modStatusTimestamp = timestamp;

        await mod.save();
      }
    } catch (error) {
      logger.error(`"Error handling MQTT message:" ${error}`);
    }
  });

  // WEBSERVER CONNECTION
  wsServer.on('connection', (ws) => {
    logger.info('Client connected to WebSocket');

    // WebSocket close event handler
    ws.on('close', () => {
      logger.info('Client disconnected from WebSocket');
    });
  });

  // Change stream event handlers
  connection.once('open', () => {
    // // Define change stream on a Mongoose model
    const modChangeStream = Mod.watch();

    modChangeStream.on('change', (modsUpdate) => {
      // logger.info('Change occurred in mods collection:', modsUpdate);

      // Send change to connected clients
      wsServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(modsUpdate));
        }
      });
    });
  });
};

export default connectDB;
