import mongoose from 'mongoose';

const provisionedMod = new mongoose.Schema({
  modId: { type: String, required: true },
  claimedBy: { type: String },
  provisioned: { type: Boolean, default: false },
  setupKey: { type: String, required: true },
});

const ProvisionedMod = mongoose.model('ProvisionedMod', provisionedMod);

export default ProvisionedMod;
