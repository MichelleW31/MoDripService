import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { admin } from '../FirebaseConfig.js';

dotenv.config();

export const getIdFromAccessToken = async (req) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];

    // @ts-ignore
    const decodedToken = await admin.auth().verifyIdToken(token);

    return decodedToken.uid;
  }
};
