import express from 'express';
import { loginUser } from '../controllers/loginController.js';
import { validate } from '../middleware/validators/validator.js';
import { loginValidationRules } from '../middleware/validators/userValidation.js';

const router = express.Router();

router.route('/').post(loginValidationRules(), validate, loginUser);

export default router;
