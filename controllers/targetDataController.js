import TargetData from '../models/targetDataModel.js';
import logger from '../config/logger.js';

export const setTargetData = async (req, res) => {
  const {
    targetTemperatureMin,
    targetTemperatureMax,
    targetHumidityMin,
    targetHumidityMax,
    modId,
  } = req.body;

  // No mod id
  if (!modId) {
    return res.status(400).json({ message: 'Mod Id required' });
  }

  // No target data
  if (
    !targetTemperatureMin ||
    !targetTemperatureMax ||
    !targetHumidityMin ||
    !targetHumidityMax
  ) {
    return res.status(400).json({ message: 'Target Data required' });
  }

  // Check if target data already exists for mods
  try {
    const duplicate = await TargetData.findOne({ modId: modId }).exec();

    if (duplicate) {
      return res
        .status(409)
        .json({ message: 'Target data already exists for this mod' }); // Conflict error code
    }
  } catch (error) {
    logger.error(`Error setting target data ${error}`);

    return res.status(500).json({ message: 'Error. Try again later' });
  }

  try {
    const targetData = await TargetData.create({
      targetTemperatureMin,
      targetTemperatureMax,
      targetHumidityMin,
      targetHumidityMax,
      modId: modId,
    });

    res.status(201).json({ success: 'Target data set!', targetData }); // Successful
  } catch (error) {
    logger.error(`Error setting target data ${error}`);

    res
      .status(500)
      .json({ message: `Error setting target data: ${error.message}` }); // Server error code
  }
};

export const getTargetDataById = async (req, res) => {
  if (!req?.params?.modId) {
    return res.status(400).json({ message: 'Mod id is required' });
  }

  const { modId } = req.params;

  let targetData;

  try {
    targetData = await TargetData.findOne({ modId: modId }).exec();

    if (!targetData) {
      logger.error(`No target data found`);
      return res.status(404).json({ message: `No Target data found` });
    }

    res.status(200).json(targetData);
  } catch (error) {
    logger.error(`Error getting target data`);

    return res
      .status(500)
      .json({ message: 'Error getting target data. Try again later' });
  }
};

// Double check if this work from front end
export const updateTargetData = async (req, res) => {
  if (!req?.params?.modId) {
    return res.status(400).json({ message: 'Mod id is required' });
  }

  const { modId } = req.params;

  const {
    targetTemperatureMin,
    targetTemperatureMax,
    targetHumidityMin,
    targetHumidityMax,
  } = req.body;

  let targetData;

  try {
    targetData = await TargetData.findOne({ modId: modId }).exec();

    // No existing target data found
    if (!targetData) {
      return res.status(404).json({ message: `No Target data found` });
    }

    // Update if target data is found
    if (req.body?.targetTemperatureMin) {
      targetData.targetTemperatureMin = targetTemperatureMin;
    }

    if (req.body?.targetTemperatureMax) {
      targetData.targetTemperatureMax = targetTemperatureMax;
    }

    if (req.body?.targetHumidityMin) {
      targetData.targetHumidityMin = targetHumidityMin;
    }

    if (req.body?.targetHumidityMax) {
      targetData.targetHumidityMax = targetHumidityMax;
    }

    const result = await targetData.save();

    logger.info(`Target data updated: ${targetData}`);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Error updating target data ${error}`);

    return res.status(500).json({ message: 'Error. Try again later' });
  }
};
