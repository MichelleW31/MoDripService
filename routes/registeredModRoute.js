import express from 'express';
import { validate } from '../middleware/validators/validator.js';
import {
  registeredModValidationRules,
  setupKeyValidationRules,
} from '../middleware/validators/registeredModValidation.js';
import { registerProvisionedMod } from '../controllers/registeredModController.js';
import { getProvisionedMod } from '../controllers/registeredModController.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

router
  .route('/')
  .post(
    verifyJWT,
    registeredModValidationRules(),
    validate,
    registerProvisionedMod
  );

router
  .route('/:setupKey')
  .get(verifyJWT, setupKeyValidationRules(), validate, getProvisionedMod);

export default router;
