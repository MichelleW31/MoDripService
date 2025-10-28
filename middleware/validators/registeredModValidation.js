import { body, param } from 'express-validator';

export const registeredModValidationRules = () => {
  return [
    body('modId').trim().notEmpty().escape(),
    body('setupKey').trim().notEmpty().escape(),
  ];
};

export const setupKeyValidationRules = () => {
  return [param('setupKey').trim().notEmpty().escape()];
};
