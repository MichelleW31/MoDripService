// BASE MODULES
import express from 'express';

// CUSTOM MODULES
import { modIdValidationRules } from '../middleware/validators/modStatusValidation.js';
import verifyJWT from '../middleware/verifyJWT.js';
import { validate } from '../middleware/validators/validator.js';
import {
  getModStatus,
  updateModStatus,
} from '../controllers/modStatusController.js';

const router = express.Router();

router
  .route('/:id')
  .get(verifyJWT, modIdValidationRules(), validate, getModStatus)
  .post(verifyJWT, modIdValidationRules(), validate, updateModStatus);

export default router;
