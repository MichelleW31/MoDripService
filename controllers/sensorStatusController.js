// BASE MODULES

// CUSTOM MODULES
import Mods from '../models/modModel.js';
import logger from '../config/logger.js';

export const getSensorStatus = async (req, res) => {
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

    res.status(200).send(mod.sensorStatusTimestamp);
  } catch (error) {
    logger.error(`Error finding mod ${error}`);

    return res.status(500).json({ message: 'Error. Getting sensor status' });
  }
};

export const updateSensorStatus = async (req, res) => {
  if (!req?.params?.id) {
    logger.info('Mod id not included');
    return res.status(400).json({ message: 'Mod id is required' });
  }

  const { id } = req.params;

  let mod;

  try {
    mod = await Mods.findByIdAndUpdate(id, {
      sensorStatusTimestamp: Date.now(),
    });

    logger.info(`Mod updated ${mod}`);

    return res.status(204);
  } catch (error) {
    logger.error(`Error updating sensor`, error);
    res.status(500).send({ message: 'Error updating sensor' });
  }
};
