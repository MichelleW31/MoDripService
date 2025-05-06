import DripHistory from '../models/dripHistoryModel.js';
import logger from '../config/logger.js';
import { admin } from '../FirebaseConfig.js';

export const addDripHistory = async (req, res) => {
  const {
    dripDuration,
    beforeDripMoisture,
    afterDripMoisture,
    modId,
    modName,
  } = req.body;

  // No drip history data
  if (
    !dripDuration ||
    !beforeDripMoisture ||
    !afterDripMoisture ||
    !modId ||
    !modName
  ) {
    return res.status(400).json({ message: 'Drip History Data required' });
  }

  // GET USER ID
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(401); // Unauthorized
  }

  const token = authHeader.split(' ')[1];

  let dripHistory;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    const userId = decodedToken.uid;

    dripHistory = await DripHistory.create({
      dripDuration,
      beforeDripMoisture,
      afterDripMoisture,
      modId,
      modName,
      userId,
    });

    res.status(201).json({ success: 'Drip History Added!', dripHistory });
  } catch (error) {
    logger.error(`Error adding drip history ${error}`);

    return res.status(500).json({ message: 'Error. Try again later' });
  }
};

export const getUserDripHistory = async (req, res) => {
  // GET USER ID
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(401); // Unauthorized
  }

  const token = authHeader.split(' ')[1];

  let dripHistory;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    const userId = decodedToken.uid;

    dripHistory = await DripHistory.find({ userId });

    res.status(200).json(dripHistory);
  } catch (error) {
    logger.error(`Error getting user drip history`);

    return res
      .status(500)
      .json({ message: 'Error getting user drip history. Try again later' });
  }
};

// Not sure if I need this
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

export const deleteDripHistory = async (req, res) => {
  // GET USER ID
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(401); // Unauthorized
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    const userId = decodedToken.uid;

    await DripHistory.deleteMany({ userId });
  } catch (error) {
    logger.error(`Error deleting user drip history, ${error}`);

    res.status(500).json({ message: 'Error. Please try again later' });
  }
};
