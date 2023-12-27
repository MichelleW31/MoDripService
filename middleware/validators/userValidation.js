import { body } from 'express-validator';

export const createUserValidationRules = () => {
  return [
    body('firstName').trim().notEmpty().escape(),
    body('lastName').trim().notEmpty().escape(),
    body('email').isEmail(),
    body('password').trim().notEmpty().escape(),
  ];
};

export const loginValidationRules = () => {
  return [body('email').isEmail(), body('password').trim().notEmpty().escape()];
};
