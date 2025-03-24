import { body } from 'express-validator';

export const authModValidationRules = () => {
  return [body('modId').trim().notEmpty().escape()];
};
