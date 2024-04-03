import mongoose from 'mongoose';

const targetData = new mongoose.Schema({
  targetTemperatureMin: {
    type: Number,
  },
  targetTemperatureMax: {
    type: Number,
  },
  targetHumidityMin: {
    type: Number,
  },
  targetHumidityMax: {
    type: Number,
  },
  modId: {
    type: String,
  },
});

const TargetData = mongoose.model('TargetData', targetData);

export default TargetData;
