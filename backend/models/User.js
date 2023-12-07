const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false 
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
});

// Hash the password before saving the user model
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;