import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

export const getIdFromAccessToken = (req) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];

    // @ts-ignore
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decoded.user.id;
  }
};
