const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  }, // e.g., 'catering', 'photography', 'music'

  price: {
    type: Number,
    required: true
  },

  description: {
    type: String
  },

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },

  available: {
    type: Boolean,
    default: true
  },

  images: [
    {
      type: String // File paths or image URLs
    }
  ],

  availabilityDates: [
    {
      type: Date
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', serviceSchema);
