import { body } from 'express-validator';

export const registeredModValidationRules = () => {
  return [
    body('modId').trim().notEmpty().escape(),
    body('setupKey').trim().notEmpty().escape(),
  ];
};
