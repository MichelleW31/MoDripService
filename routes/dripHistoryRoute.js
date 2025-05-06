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
  getUserDripHistory,
  deleteDripHistory,
} from '../controllers/dripHistoryController.js';

const router = express.Router();

router
  .route('/')
  .get(verifyJWT, getUserDripHistory)
  .post(verifyJWT, dripHistoryValidationRules(), validate, addDripHistory)
  .delete(verifyJWT, deleteDripHistory);

router
  .route('/:modId')
  // Im not sure why I have the get by id route.
  .get(verifyJWT, modIdValidationRules(), validate, getDripHistoryById);

export default router;
