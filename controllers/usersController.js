import User from '../models/userModel.js';
import logger from '../config/logger.js';
import bcrypt from 'bcryptjs';

export const createUser = async (req, res) => {
  const { firstName, lastName, email, uid } = req.body;

  try {
    // I shouldn't need this due to firebase catching duplicates on the client. But I'll keep for now 3/11
    // Check for duplicate usernames in the database
    const duplicate = await User.findOne({ email }).exec();

    if (duplicate) {
      return res
        .status(409)
        .json({ message: 'User already exists with this email' }); // Conflict error code
    }

    // Create and store the new user
    const user = await User.create({
      // roles is being set by default by the model
      firstName,
      lastName,
      email,
      uid,
    });

    res.status(201).json({ success: 'New user created!' }); // Successful

    logger.info(`User created: ${user}`);
  } catch (error) {
    logger.error(`Error creating user: ${email}`, error);

    res.status(500).json({ message: `Error creating user : ${error.message}` }); // Server error code
  }
};

export const getUsers = async (req, res) => {
  logger.info('get users request', req);
  let users;

  try {
    users = await User.find();

    // No users found
    if (!users) {
      return res.status(404).json({ message: 'No Users found' });
    } // No content

    res.status(200).json(users);
  } catch (error) {
    logger.error(`Error getting users ${error}`);

    return res.status(500).json({ message: 'Error. Try again later' });
  }
};

export const getUser = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: 'User is required' });
  }

  const { id } = req.params;

  let user;

  try {
    user = await User.findOne({ uid: id }).exec();

    // No user found
    if (!user) {
      return res.status(404).json({ message: `No User Found ` });
    }

    res.status(200).send({ user });
  } catch (error) {
    logger.error(`Error finding user ${error}`);

    return res.status(500).json({ message: 'Error. Try again later' });
  }

  res.json(user);
};

export const updateUser = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: 'User id is required' });
  }

  const { id } = req.params;
  const { firstName, lastName, email } = req.body;

  let user;

  try {
    user = await User.findOne({ uid: id }).exec();

    // No user found
    if (!user) {
      return res.status(404).json({ message: `No User Found ` });
    }

    // Update if user is found
    if (req.body?.firstName) {
      user.firstName = firstName;
    }

    if (req.body?.lastName) {
      user.lastName = lastName;
    }

    if (req.body?.email) {
      user.email = email;
    }

    const result = await user.save();

    logger.info(`User updated: ${user}`);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Error finding user ${error}`);

    return res.status(500).json({ message: 'Error. Try again later' });
  }
};

export const deleteUser = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: 'User id is required' });
  }

  const { id } = req.params;

  let user;

  try {
    user = await User.findOne({ uid: id }).exec();

    // No user found
    if (!user) {
      return res.status(404).json({ message: 'No User Found' });
    }

    // Delete if user found
    await User.deleteOne({ uid: id });

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    logger.error(`Error deleting user ${error}`);

    return res.status(500).json({ message: 'Error. Try again later' });
  }
};
