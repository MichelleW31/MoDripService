import express from 'express';
import { validate } from '../middleware/validators/validator.js';
import { registeredModValidationRules } from '../middleware/validators/registeredModValidation.js';
import { registerMod } from '../controllers/registeredModController.js';
// add verify device

const router = express.Router();

router.route('/').post(registeredModValidationRules(), validate, registerMod);

export default router;
