import express from 'express';
import {
  setTargetData,
  updateTargetData,
  getTargetDataById,
  deleteTargetData,
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
  .post(verifyJWT, setTargetDataValidationRules(), validate, setTargetData);

router
  .route('/:modId')
  .get(verifyJWT, modIdValidationRules(), validate, getTargetDataById)
  .put(verifyJWT, modIdValidationRules(), validate, updateTargetData)
  .delete(verifyJWT, modIdValidationRules(), validate, deleteTargetData);

export default router;
