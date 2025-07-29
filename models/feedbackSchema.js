const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },

  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },

  comment: {
    type: String,
    maxlength: 1000
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
