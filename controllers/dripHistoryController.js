import DripHistory from '../models/dripHistoryModel.js';
import logger from '../config/logger.js';

export const addDripHistory = async (req, res) => {
  const { dripDuration, beforeDripMoisture, afterDripMoisture, modId } =
    req.body;

  // No drip history data
  if (!dripDuration || !beforeDripMoisture || !afterDripMoisture || !modId) {
    return res.status(400).json({ message: 'Drip History Data required' });
  }

  try {
    const dripHistory = await DripHistory.create({
      dripDuration,
      beforeDripMoisture,
      afterDripMoisture,
      modId,
    });

    res.status(201).json({ success: 'Drip History Added!', dripHistory });
  } catch (error) {
    logger.error(`Error adding drip history ${error}`);

    return res.status(500).json({ message: 'Error. Try again later' });
  }
};

export const getAllDripHistory = async (req, res) => {
  let dripHistory;

  try {
    dripHistory = await DripHistory.find();

    res.status(200).json(dripHistory);
  } catch (error) {
    logger.error(`Error getting drip history`);

    return res
      .status(500)
      .json({ message: 'Error getting drip history. Try again later' });
  }
};

export const getDripHistoryById = async (req, res) => {
  if (!req?.params?.modId) {
    return res.status(400).json({ message: 'Mod id is required' });
  }

  const { modId } = req.params;

  let dripHistory;

  try {
    dripHistory = await DripHistory.find({ modId });

    res.status(200).json(dripHistory);
  } catch (error) {
    logger.error(`Error getting drip history`);

    return res
      .status(500)
      .json({ message: 'Error getting drip history. Try again later' });
  }
};
