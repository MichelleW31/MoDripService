import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { WebSocket } from 'ws';

import logger from './logger.js';
import Mod from '../models/modModel.js';

dotenv.config();

const CONNECTION_URL = process.env.MONGO_CONNECTION_URL;
const database = process.env.DATABASE_NAME;

const connectDB = (wsServer) => {
  // Mongo DB connection
  mongoose.connect(CONNECTION_URL, {
    authSource: 'admin',
    ssl: true,
    dbName: database,
  });

  const connection = mongoose.connection;

  connection.once('open', () => {
    logger.info('MongoDB database connection established successfully');
  });

  // WebSocket connection event handler
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
      logger.info('Change occurred in mods collection:', modsUpdate);

      // Send change to connected clients
      wsServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          logger.info('Client is connected, info is sent');
          client.send(JSON.stringify(modsUpdate));
        } else {
          logger.info('Client was not open');
        }
      });
    });
  });
};

export default connectDB;
