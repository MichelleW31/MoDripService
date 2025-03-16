import { body, param, query } from 'express-validator';

export const createUserValidationRules = () => {
  return [
    body('firstName').trim().notEmpty().escape(),
    body('lastName').trim().notEmpty().escape(),
    body('email').isEmail(),
    body('uid').trim().notEmpty().escape(),
  ];
};

export const loginValidationRules = () => {
  return [body('email').isEmail(), body('password').trim().notEmpty().escape()];
};

export const userIdValidationRules = () => {
  return [query('id').trim().notEmpty().escape()];
};

export const getUserIdValidationRules = () => {
  return [param('id').trim().notEmpty().escape()];
};
