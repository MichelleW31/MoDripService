import Users from '../models/users.js';
import logger from '../config/logger.js';
import bcrypt from 'bcryptjs';

export const createUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // No email or password
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check for duplicate usernames in the database
  const duplicate = await Users.findOne({ email }).exec();

  if (duplicate) {
    return res
      .status(409)
      .json({ message: 'User already exists with this email' }); // Conflict error code
  }

  try {
    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and store the new user
    const user = await Users.create({
      // roles is being set by default by the model
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ success: `New user created!` }); // Successful

    logger.info(`User created: ${user}`);
  } catch (error) {
    logger.error(`Error creating user: ${email}`, error);

    res.status(500).json({ message: `Error creating user : ${error.message}` }); // Server error code
  }
};

export const getUsers = async (req, res) => {
  const users = await Users.find();

  if (!users) {
    return res.status(204).json({ message: 'No users found' });
  } // No content

  res.json(users);
};

export const getUser = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: 'Id param is required' });
  }

  const { id } = req.params;

  let user;

  try {
    user = await Users.findOne({ _id: id }).exec();

    if (!user) {
      return res.status(204).json({ message: `No User Found ` });
    }
  } catch (error) {
    logger.error(`Error finding user ${error}`);
    return res.status(500).json({ message: 'Error. Try again later' });
  }

  res.json(user);
};
