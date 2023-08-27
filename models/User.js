const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  dob: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ["admin", "manager", 'user']
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
