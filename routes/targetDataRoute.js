import express from 'express';
import {
  setTargetData,
  updateTargetData,
  getTargetDataById,
} from '../controllers/targetDataController.js';
import { validate } from '../middleware/validators/validator.js';
import {
  modIdValidationRules,
  setTargetDataValidationRules,
} from '../middleware/validators/targetDataValidation.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

router
  .route('/')
  .get(verifyJWT, modIdValidationRules(), validate, getTargetDataById);

router
  .route('/:id')
  .post(
    verifyJWT,
    setTargetDataValidationRules(),
    modIdValidationRules(),
    validate,
    setTargetData
  )
  .put(verifyJWT, modIdValidationRules(), validate, updateTargetData);

export default router;
