const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // could be vendor or user
    required: true
  },

  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },

  content: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },

  isRead: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);
