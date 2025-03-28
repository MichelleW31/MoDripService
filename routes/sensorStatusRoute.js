// BASE MODULES
import express from 'express';

// CUSTOM MODULES
import { modIdValidationRules } from '../middleware/validators/sensorStatusValidation.js';
import verifyJWT from '../middleware/verifyJWT.js';
import { validate } from '../middleware/validators/validator.js';
import {
  getSensorStatus,
  updateSensorStatus,
} from '../controllers/sensorStatusController.js';

const router = express.Router();

router
  .route('/:id')
  .get(verifyJWT, modIdValidationRules(), validate, getSensorStatus)
  .post(verifyJWT, modIdValidationRules(), validate, updateSensorStatus);

export default router;
