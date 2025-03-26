// BASE MODULES
import axios from 'axios';

// CUSTOM MODULES
import { admin } from '../FirebaseConfig.js';
import logger from '../config/logger.js';

export const authenticateMod = async (req, res) => {
  const { modId } = req.body;

  if (!modId) {
    return res.status(400).json({ error: 'Mod id is required' });
  }

  try {
    // Generate a Custom Token
    const customToken = await admin.auth().createCustomToken(modId);

    // Exchange Custom Token for ID Token
    const apiKey = process.env.FIREBASE_API_KEY;

    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`,
      {
        token: customToken,
        returnSecureToken: true,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
      }
    );

    logger.info(`response`, response);

    // Return the ID Token to the sensor
    return response.data.idToken;
  } catch (error) {
    logger.error(
      `Error with authenticating sensor ${modId}: ${JSON.stringify(
        error.message
      )}`
    );

    res.status(500).json({ error: 'Failed to authenticate mod' });
  }
};
