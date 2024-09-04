import { body, query } from 'express-validator';

export const createModValidationRules = () => {
  return [
    body('modName').trim().notEmpty().escape(),
    body('modType').trim().notEmpty().escape(),
  ];
};

export const modIdValidationRules = () => {
  return [query('id').trim().notEmpty().escape()];
};
