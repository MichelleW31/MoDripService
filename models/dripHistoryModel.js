import mongoose from 'mongoose';

const dripHistory = new mongoose.Schema(
  {
    dripDuration: {
      type: Number,
      required: true,
    },
    beforeDripMoisture: {
      type: Number,
      required: true,
    },
    afterDripMoisture: {
      type: Number,
      required: true,
    },
    modId: {
      type: String,
    },
    modName: {
      type: String,
    },
  },
  { timestamps: true }
);

const DripHistory = mongoose.model('DripHistory', dripHistory);

export default DripHistory;
