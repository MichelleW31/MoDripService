import express from 'express';
import { createMod } from '../controllers/modsController.js';
import { validate } from '../middleware/validators/validator.js';
import { createModValidationRules } from '../middleware/validators/modValidation.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

router
  .route('/')
  .post(verifyJWT, createModValidationRules(), validate, createMod);

export default router;
// {"modName":"Chi Chi", "modType":"Chinese Evergreen"}
