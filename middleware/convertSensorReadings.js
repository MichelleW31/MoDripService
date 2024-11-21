const getMoisturePercentage = (moistureValue) => {
  // Get Range
  const minValue = 1400;
  const maxValue = 2900;
  const moistureRange = maxValue - minValue;

  // Calculate percentage
  const moisturePercentage = ((maxValue - moistureValue) / moistureRange) * 100;

  return moisturePercentage;
};

export default getMoisturePercentage;
