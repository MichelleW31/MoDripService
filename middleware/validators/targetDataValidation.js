import { body, param } from 'express-validator';

export const setTargetDataValidationRules = () => {
  return [
    body('targetTemperature').trim().notEmpty().escape(),
    body('targetMoisture').trim().notEmpty().escape(),
    body('targetHumidity').trim().notEmpty().escape(),
  ];
};

export const modIdValidationRules = () => {
  return [param('id').trim().notEmpty().escape()];
};
