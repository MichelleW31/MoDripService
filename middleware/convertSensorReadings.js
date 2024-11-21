import logger from '../config/logger.js';

const getMoisturePercentage = (moistureValue) => {
  logger.info('moisture value', moistureValue);

  // Get Range
  const minValue = 1400;
  const maxValue = 2900;
  const moistureRange = maxValue - minValue;
  let moisturePercentage = 0;

  // Calculate percentage
  if (moistureValue > 2900) {
    moisturePercentage = 0;
  } else if (moistureValue < 1400) {
    moisturePercentage = 100;
  } else {
    moisturePercentage = ((maxValue - moistureValue) / moistureRange) * 100;
  }

  return moisturePercentage;
};

export default getMoisturePercentage;
