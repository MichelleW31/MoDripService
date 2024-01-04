import mongoose from 'mongoose';

const targetData = new mongoose.Schema({
  targetTemperature: {
    type: Number,
  },
  targetMoisture: {
    type: Number,
  },
  targetHumidity: {
    type: Number,
  },
  modId: {
    type: String,
  },
});

const TargetData = mongoose.model('TargetData', targetData);

export default TargetData;
