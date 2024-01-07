import User from '../models/userModel.js';
import logger from '../config/logger.js';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

export const handleRefreshToken = async (req, res) => {
  const cookie = req.headers.cookie;

  if (!cookie) {
    return res.sendStatus(401); // Unauthorized User
  }

  const refreshToken = cookie.split('=')[1];

  try {
    // Look for user.
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
      return res.sendStatus(403); // Forbidden
    }

    // Evaluate jwt
    jwt.verify(
      refreshToken,
      // @ts-ignore
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.email !== decoded.email) {
          return res.sendStatus(403); // Forbidden
        }

        const accessToken = jwt.sign(
          {
            user: {
              name: `${foundUser.firstName} ${foundUser.lastName}`,
              email: foundUser.email,
              roles: foundUser.userRole,
              id: foundUser._id,
            },
          },
          // @ts-ignore
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '120s' }
        );

        foundUser.accessToken = accessToken;
        foundUser.save();
        res.json({ accessToken });
      }
    );
  } catch (error) {
    logger.error(`Error ${error}`);

    return res.status(500).json({ message: 'Error. Please try again later' });
  }
};
