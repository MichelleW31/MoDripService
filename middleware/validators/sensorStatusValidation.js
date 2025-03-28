// BASE MODULES
import { param } from 'express-validator';

// CUSTOM MODULES

export const modIdValidationRules = () => {
  return [param('modId').trim().notEmpty().escape()];
};
