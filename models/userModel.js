import mongoose from 'mongoose';

const user = new mongoose.Schema({
  userRole: {
    type: String,
    enum: ['basic_user', 'deluxe_user'],
    default: 'basic_user',
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String,
  accessToken: String,
});

const User = mongoose.model('User', user);

export default User;
