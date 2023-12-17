import express from 'express';
import { logoutUser } from '../controllers/logoutController.js';

const router = express.Router();

router.route('/').get(logoutUser);

export default router;
