// BASE MODULES
import express from 'express';

// CUSTOM MODULES
import { authModValidationRules } from '../middleware/validators/authenticateModValidation';
import { validate } from '../middleware/validators/validator';
import { authenticateMod } from '../controllers/authenticateModController';

const router = express.Router();

router.route('/').post(authModValidationRules(), validate, authenticateMod);

export default router;
