const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

 email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['admin', 'vendor', 'customer'],
    default: 'user'
  },

  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);