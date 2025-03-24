import { body, param, query } from 'express-validator';

export const setTargetDataValidationRules = () => {
  return [
    body('targetTemperatureMin').trim().notEmpty().escape(),
    body('targetTemperatureMax').trim().notEmpty().escape(),
    body('targetHumidityMin').trim().notEmpty().escape(),
    body('targetHumidityMax').trim().notEmpty().escape(),
  ];
};

export const modIdValidationRules = () => {
  return [param('modId').trim().notEmpty().escape()];
};

export const modIdQueryValidationRules = () => {
  return [query('modId').trim().notEmpty().escape()];
};
