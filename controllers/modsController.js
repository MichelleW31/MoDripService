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
      userId,
    });

    res.status(201).json({ success: 'New Mod created!', mod }); // Successful
  } catch (error) {
    logger.error(`Error creating mod: ${modName}`, error);

    res.status(500).json({ message: `Error creating mod : ${error.message}` }); // Server error code
  }
};

// export const getMods = async (req, res) => {
//   let mods;

//   try {
//     mods = await Mods.find();

//     // No mods found
//     if (!mods) {
//       return res.status(204).json({ message: 'No mods found' });
//     }

//     res.status(200).json(mods);
//   } catch (error) {
//     logger.error(`Error getting mods ${error}`);

//     return res.status(500).json({ message: 'Error. Try again later' });
//   }
// };

export const getModsByUserId = async (req, res) => {
  let mods;

  try {
    const userId = await getIdFromAccessToken(req);

    mods = await Mods.find({ userId });

    if (!mods) {
      return res
        .status(404)
        .json({ message: `No mods found for user, ${userId}` });
    }

    res.status(200).json(mods);
  } catch (error) {
    logger.error(`Error getting mods by user id ${error}`);

    return res.status(500).json({ message: 'Error. Try again later' });
  }
};

// Double check if this work from front end
export const updateMod = async (req, res) => {
  if (!req?.query?.id) {
    return res.status(400).json({ message: 'Mod id is required' });
  }

  const { id } = req.query;
  const { modName, modType } = req.body;

  let mod;

  try {
    mod = await Mods.findById(id).exec();

    // No mod found
    if (!mod) {
      return res.status(404).json({ message: `No Mod Found` });
    }

    // Update if mod is found
    if (req.body?.modName) {
      mod.modName = modName;
    }

    if (req.body?.modType) {
      mod.modType = modType;
    }

    const result = await mod.save();

    logger.info(`Mod updated: ${mod}`);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Error updating user ${error}`);

    return res.status(500).json({ message: 'Error. Try again later' });
  }
};

export const deleteMod = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: 'Mod Id is required' });
  }

  const { id } = req.params;

  let mod;

  try {
    mod = await Mods.findById(id).exec();

    // No mod found
    if (!mod) {
      return res.status(404).json({ message: 'No Mod Found' });
    }

    // Delete if mod found
    await Mods.deleteOne({ _id: id });

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {}
};
