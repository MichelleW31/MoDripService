// BASE MODULES

// CUSTOM MODULES
import Mods from '../models/modModel.js';
import logger from '../config/logger.js';

export const getModStatus = async (req, res) => {
  if (!req?.params?.id) {
    logger.info('Mod id not included');
    return res.status(400).json({ message: 'Mod id is required' });
  }

  const { id } = req.params;

  let mod;

  try {
    mod = await Mods.findById(id).exec();

    // No mod found
    if (!mod) {
      logger.info('No Mod Found');
      return res.status(404).json({ message: `No Mod Found` });
    }

    res.status(200).send(mod.modStatusTimestamp);
  } catch (error) {
    logger.error(`Error getting mod status ${error}`);

    return res.status(500).json({ message: 'Error getting mod status' });
  }
};

// DOUBLE CHECK IF STILL NEEDED
export const updateModStatus = async (req, res) => {
  if (!req?.params?.id) {
    logger.info('Mod id not included');
    return res.status(400).json({ message: 'Mod id is required' });
  }

  const { id } = req.params;

  let mod;

  try {
    mod = await Mods.findByIdAndUpdate(id, {
      modStatusTimestamp: Date.now(),
    });

    logger.info(`Mod status updated ${mod}`);

    return res.status(200).send({ message: 'Mod status updated' });
  } catch (error) {
    logger.error(`Error updating mod status`, error);
    res.status(500).send({ message: 'Error updating mod status' });
  }
};
