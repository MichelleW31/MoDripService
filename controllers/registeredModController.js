import ProvisionedMods from '../models/registeredModModel.js';
import Mods from '../models/modModel.js';
import logger from '../config/logger.js';
import { admin } from '../FirebaseConfig.js';
import { getIdFromAccessToken } from '../util/accessToken.js';

export const registerProvisionedMod = async (req, res) => {
  const { modId, setupKey, modName, modType } = req.body;

  // NO MODID OR SETUP KEY
  if (!modId || !setupKey || !modName || !modType) {
    return res.status(400).json({
      message: 'Mod ID, Setup Key, Mod Name, and Mod Type are required',
    });
  }

  try {
    // GET USER ID
    const userId = await getIdFromAccessToken(res, req);

    // REGISTER PROVISIONED MOD
    const provisionedMod = await ProvisionedMods.findOne({ modId });

    if (!provisionedMod) {
      return res
        .status(404)
        .json({ message: 'Mod not found or not provisioned' });
    }

    // If already claimed, prevent double-claim
    if (provisionedMod.claimedBy) {
      return res.status(403).json({ error: 'Mod already claimed' });
    }

    if (provisionedMod.setupKey !== setupKey) {
      return res.status(403).json({ message: 'Invalid Setup Key' });
    }

    provisionedMod.claimedBy = userId;

    // CREATE MOD RECORD
    const duplicate = await Mods.findOne({ modId }).exec();

    if (duplicate) {
      return res.status(409).json({ message: 'Mod already exists' });
    }

    // Create and store the new mod
    const mod = await Mods.create({
      modName,
      modType,
      temperature: 0,
      moisture: 0,
      humidity: 0,
      userId,
      modStatusTimestamp: Date.now(),
      sensorOn: false,
    });

    await provisionedMod.save();
    await mod.save();

    res.status(200).json({ success: 'Mod Registered!', provisionedMod, mod });
  } catch (error) {
    logger.error(`Error registering/creating new mod ${error}`);

    return res.status(500).json({ message: 'Error. Try again later' });
  }
};

export const getProvisionedMod = async (req, res) => {
  const { setupKey } = req.params;

  if (!setupKey) {
    return res.status(400).json({ message: 'Setup Key is required' });
  }

  try {
    const provisionedMod = await ProvisionedMods.findOne({
      setupKey: setupKey,
    }).exec();

    logger.info(`provisionedMod: ${provisionedMod}`);

    if (!provisionedMod) {
      return res.status(404).json({ message: 'Mod has not been provisioned' });
    }

    res.status(200).json({ provisionedMod });
  } catch (error) {
    logger.error(`Error fetching provisioned mod ${error}`);

    return res.status(500).json({ message: 'Error. Try again later' });
  }
};
