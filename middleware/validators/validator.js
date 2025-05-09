import { validationResult } from 'express-validator';
import logger from '../../config/logger.js';

export const validate = async (req, res, next) => {
  const errors = await validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }
  const errorsArray = [];
  errors.array().map((err) => errorsArray.push({ [err.param]: err.msg }));

  errors.array().map((err) => logger.error(`Validation error: ${err.msg}`));

  // Return bad request
  return res.status(400).json({
    errors: errorsArray,
  });
};
