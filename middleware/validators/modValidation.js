import { body, param } from 'express-validator';

export const createModValidationRules = () => {
  return [
    body('modName').trim().notEmpty().escape(),
    body('modType').trim().notEmpty().escape(),
  ];
};

export const userIdValidationRules = () => {
  return [param('id').trim().notEmpty().escape()];
};
