const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or 'Vendor' if you still use that collection
    required: true
  },

  serviceId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    }
  ],

  date: {
    type: Date,
    required: true
  },

  startTime: {
    type: String, // or Date if full datetime is needed
    required: false
  },

  endTime: {
    type: String, // or Date if full datetime is needed
    required: false
  },

  specialRequest: {
    type: String
  },

  amenities: [String],

  status: {
    type: String,
    enum: ['pending','payment due','confirmed', 'cancelled', 'completed'],
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
