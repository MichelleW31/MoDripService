import User from '../models/userModel.js';
import logger from '../config/logger.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // No email or password
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Look for user
    const foundUser = await User.findOne({ email }).exec();

    if (!foundUser) {
      logger.error('Error finding user ');
      return res.status(401).json({ message: 'No user found' }); // Unauthorized User
    }

    // Evaluate password (authorize login)
    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (passwordMatch) {
      const roles = foundUser.userRole;

      // Create JWTs (access tokens)
      const accessToken = jwt.sign(
        {
          user: {
            name: `${foundUser.firstName} ${foundUser.lastName}`,
            email: foundUser.email,
            roles: roles,
            id: foundUser._id,
          },
        },
        // @ts-ignore
        process.env.ACCESS_TOKEN_SECRET,
        // 15 minutes for production
        { expiresIn: '120s' }
      );

      const refreshToken = jwt.sign(
        {
          email: foundUser.email,
        },
        // @ts-ignore
        process.env.REFRESH_TOKEN_SECRET,
        // 15 minutes for production
        { expiresIn: '1d' }
      );

      // Saving refreshToken with current user
      // We can invalidate the refresh token when the user logs out before 1 day has passed
      foundUser.refreshToken = refreshToken;
      foundUser.accessToken = accessToken;
      const result = await foundUser.save();

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'None',
        // Add back in when pushing to production. This blocks Thunderclient testing
        // secure: true,
      });

      // Send back access token on login for now. Need to determine what to send back when user logins
      res.status(200).json({ result });
    } else {
      res.status(401).json({ message: 'Incorrect password' }); // Unauthorized User(password doesnt match)
    }
  } catch (error) {
    logger.error(`Error ${error}`);
    return res.status(500).json({ message: 'Error. Please try again later' });
  }
};
