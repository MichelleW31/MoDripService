import { body, param } from 'express-validator';

export const dripHistoryValidationRules = () => {
  return [
    body('dripDuration').trim().notEmpty().escape(),
    body('beforeDripMoisture').trim().notEmpty().escape(),
    body('afterDripMoisture').trim().notEmpty().escape(),
    body('modId').trim().notEmpty().escape(),
  ];
};

export const modIdValidationRules = () => {
  return [param('modId').trim().notEmpty().escape()];
};
