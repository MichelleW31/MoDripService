import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const errorsArray = [];
  errors.array().map((err) => errorsArray.push({ [err.param]: err.msg }));

  // Return bad request
  return res.status(400).json({
    errors: errorsArray,
  });
};
