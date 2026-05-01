// CUSTOM MODULES
import logger from '../config/logger.js';
import Mod from '../models/modModel.js';

export const startModChangeStream = (wsServer) => {
  logger.info('Starting Mod change stream');

  const modChangeStream = Mod.watch();

  modChangeStream.on('change', (modsUpdate) => {
    logger.info('modsUpdate', modsUpdate);

    wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(modsUpdate));
      }
    });
  });

  modChangeStream.on('error', (error) => {
    logger.error(`Mod change stream error: ${error}`);

    setTimeout(() => {
      logger.info('Restarting Mod change stream after error');
      startModChangeStream(wsServer);
    }, 5000);
  });

  modChangeStream.on('close', () => {
    logger.warn('Mod change stream closed');

    setTimeout(() => {
      logger.info('Restarting Mod change stream after close');
      startModChangeStream();
    }, 5000);
  });
};
