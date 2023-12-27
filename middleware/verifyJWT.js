// @ts-nocheck
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(401); // Unauthorized
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // invalid token - forbidden
    }

    req.user = decoded.user;
    next();
  });
};

export default verifyJWT;

// {"firstName": "MattieMae", "lastName": "Joe", "email": "matjoe@gmail.com", "password": "test123"}
