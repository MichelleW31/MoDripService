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
  .post(verifyJWT, createModValidationRules(), validate, createMod)
  .put(verifyJWT, modIdValidationRules(), updateMod)
  .delete(verifyJWT, modIdValidationRules(), deleteMod);

// router
//   .route('/:id')
//   .put(verifyJWT, userIdValidationRules(), updateMod)
//   .delete(verifyJWT, userIdValidationRules(), deleteMod);

export default router;
// {"modName":"Avi", "modType":"Avocado Plant"}
// {"modName":"Sego"}
