import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const CONNECTION_URL = process.env.MONGO_CONNECTION_URL;
const database = process.env.DATABASE_NAME;

const connectDB = (wsServer) => {
  mongoose
    .connect(CONNECTION_URL, {
      authSource: 'admin',
      ssl: true,
      dbName: database,
    })
    .then(() => {
      // WebSocket connection event handler
      wsServer.on('connection', (ws) => {
        console.log('Client connected to WebSocket');
        logger.info('Client connected to WebSocket');

        // Define change stream on a Mongoose model
        const userChangeStream = mongoose.connection.collection('mods').watch();

        // Change stream event handlers
        userChangeStream.on('change', (change) => {
          logger.info('Change occurred in mods collection:', change);

          // Send change to connected clients
          ws.send(JSON.stringify(change));
        });

        // WebSocket message event handler
        ws.on('message', (message) => {
          logger.info('Received message from client:', message);

          // Handle incoming messages from clients
        });

        // WebSocket close event handler
        ws.on('close', () => {
          logger.info('Client disconnected from WebSocket');
        });
      });

      logger.info('Database connection successful');
    })
    .catch((error) => {
      logger.error('Database connection error', error);
    });
};

export default connectDB;
