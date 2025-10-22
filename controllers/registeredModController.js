import RegisteredMod from '../models/registeredModModel';
import logger from '../config/logger.js';
import { admin } from '../FirebaseConfig.js';

export const registerMod = async (req, res) => {
  const { modId, setupKey } = req.body;

  // NO MODID OR SETUP KEY
  if (!modId || !setupKey) {
    return res.status(400).json({ message: 'Mod ID and Setup Key required' });
  }

  // GET USER ID
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(401); // Unauthorized
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    const userId = decodedToken.uid;

    // REGISTER PROVISIONED MOD
    const provisionedMod = await RegisteredMod.findOne({ modId });

    if (!provisionedMod) {
      return res
        .status(404)
        .json({ message: 'Mod not found or not provisioned' });
    }

    // If already claimed, prevent double-claim
    if (provisionedMod.claimedBy) {
      return res.status(403).json({ error: 'Device already claimed' });
    }

    // put in middleware
    if (provisionedMod.setupKey !== setupKey) {
      return res.status(403).json({ message: 'Invalid Setup Key' });
    }

    provisionedMod.claimedBy = userId;

    await provisionedMod.save();

    res.status(200).json({ success: 'Mod Registered!', provisionedMod });
  } catch (error) {
    logger.error(`Error registering mod ${error}`);

    return res.status(500).json({ message: 'Error. Try again later' });
  }
};
