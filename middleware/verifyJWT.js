// @ts-nocheck
import * as dotenv from 'dotenv';
import logger from '../config/logger.js';
import { admin } from '../FirebaseConfig.js';

dotenv.config();

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Unauthorized' }); // Unauthorized
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken;

    // logger.info(`Auth Token verified ${token}`);
  } catch (error) {
    logger.error(`Jwt error ${error}`);

    return res.sendStatus(403); // invalid token - forbidden
  }

  next();
};

export default verifyJWT;
