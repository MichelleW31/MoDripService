export const getMoisturePercentage = (moistureValue) => {
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
    moisturePercentage = Math.round(
      ((maxValue - moistureValue) / moistureRange) * 100
    );
  }

  return moisturePercentage;
};

export const convertToFahrenheit = (temperatureValue) =>
  Math.round((temperatureValue * 9) / 5 + 32);

export const roundHumidity = (humidityValue) => Math.round(humidityValue);
