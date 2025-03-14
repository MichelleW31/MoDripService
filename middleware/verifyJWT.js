// @ts-nocheck
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import logger from '../config/logger.js';

dotenv.config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(401); // Unauthorized
  }



  const token = authHeader.split(' ')[1];

  logger.info(`AUTH TOKEN ${token}`)

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
