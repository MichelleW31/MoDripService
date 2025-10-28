import mongoose from 'mongoose';

const provisionedMods = new mongoose.Schema({
  modId: { type: String, required: true },
  claimedBy: { type: String },
  provisioned: { type: Boolean, default: false },
  setupKey: { type: String, required: true },
});

const ProvisionedMods = mongoose.model('ProvisionedMods', provisionedMods);

export default ProvisionedMods;
