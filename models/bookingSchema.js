const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },

  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
  },

  serviceIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    }
  ],

  date: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },

  totalPrice: {
    type: Number,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
