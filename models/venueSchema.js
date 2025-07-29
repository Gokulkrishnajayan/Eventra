const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  capacity: {
    type: Number,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  description: {
    type: String
  },

  images: [
    {
      type: String // URLs or file paths
    }
  ],

  availableDates: [
    {
      type: Date
    }
  ],

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Venue', venueSchema);
