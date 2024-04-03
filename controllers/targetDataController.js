import TargetData from '../models/targetDataModel.js';
import logger from '../config/logger.js';

export const setTargetData = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: 'Mod id is required' });
  }

  const { id } = req.params;
  const {
    targetTemperatureMin,
    targetTemperatureMax,
    targetHumidityMin,
    targetHumidityMax,
  } = req.body;

  // No id
  if (!id) {
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
    const duplicate = await TargetData.findOne({ modId: id }).exec();

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
      modId: id,
    });

    res.status(201).json({ success: 'Target data set!', targetData }); // Successful
  } catch (error) {
    logger.error(`Error setting target data ${error}`);

    res
      .status(500)
      .json({ message: `Error setting target data: ${error.message}` }); // Server error code
  }
};

export const updateTargetData = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: 'Mod id is required' });
  }

  const { id } = req.params;
  const { targetTemperature, targetMoisture, targetHumidity } = req.body;

  let targetData;

  try {
    targetData = await TargetData.findOne({ modId: id }).exec();

    // No existing target data found
    if (!targetData) {
      return res.status(404).json({ message: `No Target data found` });
    }

    // Update if target data is found
    if (req.body?.targetTemperature) {
      targetData.targetTemperature = targetTemperature;
    }

    if (req.body?.targetMoisture) {
      targetData.targetMoisture = targetMoisture;
    }

    if (req.body?.targetHumidity) {
      targetData.targetHumidity = targetHumidity;
    }

    const result = await targetData.save();

    logger.info(`Target data updated: ${targetData}`);

    return res.status(200).json({ success: 'Target data updated!', result });
  } catch (error) {
    logger.error(`Error updating target data ${error}`);

    return res.status(500).json({ message: 'Error. Try again later' });
  }
};
