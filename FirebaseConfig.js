/* eslint-disable operator-linebreak */
import * as dotenv from 'dotenv';

import admin from 'firebase-admin';

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, '\n')
      : undefined,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

export { admin };
