import User from '../models/userModel.js';
import logger from '../config/logger.js';

export const logoutUser = async (req, res) => {
  const authHeader = req.headers.cookie;

  if (!authHeader) {
    // If jwt cookie doesn't exist then thats what we want.
    return res.status(200).json({ message: 'You are logged out!' });
  }

  try {
    const refreshToken = authHeader.split('=')[1];

    // Is the refresh token in the DB
    const foundUser = await User.findOne({ refreshToken }).exec();

    // Refresh token isn't in the database but there is a cookie. We want to delete cookie.
    if (!foundUser) {
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });
      return res.status(200).json({ message: 'You are logged out!' });
    }

    // Delete refreshtoken found in db then clear cookie
    foundUser.refreshToken = '';
    const result = await foundUser.save();

    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });

    return res.status(200).json({ message: 'You are logged out!' });
  } catch (error) {
    logger.error(`Error ${error}`);
    return res.status(500).json({ message: 'Error. Please try again later' });
  }
};
