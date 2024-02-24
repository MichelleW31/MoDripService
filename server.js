import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

// eslint-disable-next-line no-unused-vars
import connectDB from './config/dbConn.js';
import logger from './config/logger.js';
import rootRouter from './routes/rootRouter.js';

const app = express();
dotenv.config();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '30mb', extended: true }));

app.use('/', rootRouter);

const PORT = process.env.PORT;

// SERVER CREATION
// Create an HTTP server using Express
const server = createServer(app);

// Create a WebSocket server instance and attach it to the HTTP server
const wsServer = new WebSocketServer({ server });

// CONNECT DB
connectDB(wsServer);

server.listen(PORT, function (err) {
  if (err) logger.error('Error in server setup');
  logger.info(`Server listening on Port ${PORT}`);
});
