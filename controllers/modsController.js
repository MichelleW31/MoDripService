// BASE MODULES

// CUSTOM MODULES
import Mods from '../models/modModel.js';
import TargetData from '../models/targetDataModel.js';
import ProvisionedMods from '../models/registeredModModel.js';
import logger from '../config/logger.js';
import { admin } from '../FirebaseConfig.js';

export const getModsByUserId = async (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(401); // Unauthorized
  }

  const token = authHeader.split(' ')[1];

  let mods;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    const userId = decodedToken.uid;

    mods = await Mods.find({ userId });

    if (!mods) {
      return res
        .status(404)
        .json({ message: `No mods found for user, ${userId}` });
    }

    res.status(200).json(mods);
  } catch (error) {
    logger.error(`Error getting mods by user id ${error}`);

    return res.status(500).json({ message: 'Error. Please try again later' });
  }
};

export const updateMod = async (req, res) => {
  if (!req?.params?.id) {
    logger.info('Mod id not included');
    return res.status(400).json({ message: 'Mod id is required' });
  }

  const { id } = req.params;
  const { modName, modType } = req.body;

  let mod;

  try {
    mod = await Mods.findOne({ modId: id }).exec();

    // No mod found
    if (!mod) {
      logger.info('No Mod Found');
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

    return res.status(200).send(result);
  } catch (error) {
    logger.error(`Error updating mod ${error}`);

    return res.status(500).json({ message: 'Error. Try again later' });
  }
};

export const deleteMod = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: 'Mod Id is required' });
  }

  const { id } = req.params;

  let mod;
  let provisionedMod;

  try {
    mod = await Mods.findOne({ modId: id }).exec();

    provisionedMod = await ProvisionedMods.findOne({ modId: id }).exec();

    // No mod found
    if (!mod || !provisionedMod) {
      return res.status(404).json({ message: 'No Mod Found' });
    }

    await TargetData.deleteOne({ modId: id });

    // Delete if mod found
    await Mods.deleteOne({ modId: id });

    provisionedMod.claimedBy = null;

    await provisionedMod.save();

    res.status(200).json({ message: 'Mod deleted' });
  } catch (error) {
    logger.error(`Error deleting mod ${error}`);

    return res
      .status(500)
      .json({ message: 'Error deleting mod. Try again later' });
  }
};
