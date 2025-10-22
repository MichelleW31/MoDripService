import mongoose from 'mongoose';

const registeredMod = new mongoose.Schema({
  modId: { type: String, required: true },
  claimedBy: { type: String },
  provisioned: { type: Boolean, default: false },
  setupKey: { type: String, required: true },
});

const RegisteredMod = mongoose.model('RegisteredMod', registeredMod);

export default RegisteredMod;
