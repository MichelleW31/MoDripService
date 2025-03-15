// @ts-nocheck
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import logger from '../config/logger.js';
import { admin } from '../FirebaseConfig.js';

dotenv.config();

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(401); // Unauthorized
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    logger.info(
      `Auth Token verified for ${decodedToken.email}:${decodedToken.uid}`
    );
  } catch (error) {
    logger.error(`Error ${err}`);
    logger.info(`Access token: ${authHeader}`);

    return res.sendStatus(403); // invalid token - forbidden
  }

  req.user = decodedToken;
  next();

  // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
  //   if (err) {
  //     logger.error(`Error ${err}`);
  //     logger.info(`Access token: ${authHeader}`)
  //     return res.sendStatus(403); // invalid token - forbidden
  //   }

  //   req.user = decoded.user;
  //   next();
  // });
};

export default verifyJWT;
