import mongoose from 'mongoose';

const mod = new mongoose.Schema(
  {
    modName: {
      type: String,
      required: true,
    },
    modType: {
      type: String,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    moisture: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    modStatusTimestamp: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Mod = mongoose.model('Mod', mod);

export default Mod;
