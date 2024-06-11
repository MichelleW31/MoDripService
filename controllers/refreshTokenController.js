import User from '../models/userModel.js';
import logger from '../config/logger.js';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

export const handleRefreshToken = async (req, res) => {
  const refreshToken = req.query.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(401); // Unauthorized User
  }

  try {
    // Look for user.
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
      return res.sendStatus(403); // Forbidden
    }

    // if (foundUser.email !== decoded.email) {
    //   return res.sendStatus(403); // Forbidden
    // }

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
      { expiresIn: '1d' }
    );

    // Evaluate new access token
    const decoded = jwt.verify(
      accessToken,
      // @ts-ignore
      process.env.ACCESS_TOKEN_SECRET
    );

    // Add new access token to database
    foundUser.accessToken = accessToken;
    foundUser.save();

    // Send accessToken and exp to FE
    res.status(200).json({ accessToken, accessTokenExp: decoded.exp });

    logger.info(`Token refreshed for ${foundUser.email}`);
  } catch (error) {
    logger.error(`Error ${error}`);

    return res.status(500).json({ message: 'Error. Please try again later' });
  }
};
