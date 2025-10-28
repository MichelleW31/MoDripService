import express from 'express';
import { validate } from '../middleware/validators/validator.js';
import {
  registeredModValidationRules,
  setupKeyValidationRules,
} from '../middleware/validators/registeredModValidation.js';
import { registerMod } from '../controllers/registeredModController.js';
import { getProvisionedMod } from '../controllers/registeredModController.js';

const router = express.Router();

router.route('/').post(registeredModValidationRules(), validate, registerMod);

router
  .route('/:setupKey')
  .get(setupKeyValidationRules(), validate, getProvisionedMod);

export default router;
