import Mods from '../models/modModel.js';
import { getIdFromAccessToken } from '../util/accessToken.js';
import logger from '../config/logger.js';

export const createMod = async (req, res) => {
  const { modName, modType } = req.body;

  // No modName or modType
  if (!modName || !modType) {
    return res
      .status(400)
      .json({ message: 'modName and modType are required' });
  }

  try {
    // Check for duplicate mod names
    const duplicate = await Mods.findOne({ modName }).exec();

    if (duplicate) {
      return res
        .status(409)
        .json({ message: 'Mod already exists with this name' }); // Conflict error code
    }
  } catch (error) {
    logger.error(`Error creating mod(checking for duplicates) ${error}`);

    return res.status(500).json({ message: 'Error. Try again later' });
  }

  try {
    const userId = await getIdFromAccessToken(req);
    // Create and store the new mod
    const mod = await Mods.create({
      modName,
      modType,
      temperature: 0,
      moisture: 0,
      humidity: 0,
      user_id: userId,
    });

    res.status(201).json({ success: 'New Mod created!', mod }); // Successful
  } catch (error) {
    logger.error(`Error creating mod: ${modName}`, error);

    res.status(500).json({ message: `Error creating mod : ${error.message}` }); // Server error code
  }
};
