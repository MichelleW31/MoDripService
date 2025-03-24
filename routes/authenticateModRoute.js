// BASE MODULES
import express from 'express';

// CUSTOM MODULES
import { authModValidationRules } from '../middleware/validators/authenticateModValidation.js';
import { validate } from '../middleware/validators/validator.js';
import { authenticateMod } from '../controllers/authenticateModController.js';

const router = express.Router();

router.route('/').post(authModValidationRules(), validate, authenticateMod);

export default router;
