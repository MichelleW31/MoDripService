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

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      logger.error(`Error ${err}`);
      return res.sendStatus(403); // invalid token - forbidden
    }

    req.user = decoded.user;
    next();
  });
};

export default verifyJWT;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJNaWNoZWxsZSBXaWxsaWFtcyIsImVtYWlsIjoibWlAZ21haWwuY29tIiwicm9sZXMiOiJiYXNpY191c2VyIiwiaWQiOiI2NTRhYzhlOTc0YzI1NmM0Y2UzOWVkNGYifSwiaWF0IjoxNzEyNjAyNTY1LCJleHAiOjE3MTI2MDI2ODV9.a7Tg1EfePWR6J2IjVLAjr42h_K1NbB6pyhHmxAMFVm0
