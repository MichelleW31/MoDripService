import express from 'express';
import { validate } from '../middleware/validators/validator.js';
import {
  modIdValidationRules,
  dripHistoryValidationRules,
} from '../middleware/validators/dripHistoryValidation.js';
import verifyJWT from '../middleware/verifyJWT.js';
import {
  addDripHistory,
  getDripHistoryById,
  getAllDripHistory,
} from '../controllers/dripHistoryController.js';

const router = express.Router();

router
  .route('/')
  .get(verifyJWT, getAllDripHistory)
  .post(verifyJWT, dripHistoryValidationRules(), validate, addDripHistory);

router
  .route('/:modId')
  .get(verifyJWT, modIdValidationRules(), validate, getDripHistoryById);

export default router;
