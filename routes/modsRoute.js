import express from 'express';
import {
  createMod,
  getModsByUserId,
  updateMod,
  deleteMod,
} from '../controllers/modsController.js';
import { validate } from '../middleware/validators/validator.js';
import {
  createModValidationRules,
  modIdValidationRules,
} from '../middleware/validators/modValidation.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

router
  .route('/')
  //   .get(verifyJWT, getMods)
  .get(verifyJWT, getModsByUserId)
  .post(verifyJWT, createModValidationRules(), validate, createMod);

router
  .route('/:id')
  .put(verifyJWT, modIdValidationRules(), updateMod)
  .delete(verifyJWT, modIdValidationRules(), deleteMod);

export default router;
