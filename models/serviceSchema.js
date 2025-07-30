const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }, // Venue or service title

  category: {
    type: String,
    required: true
  }, // e.g., 'venue', 'catering', 'photography', 'other'

  price: {
    type: Number,
    required: true
  },

  description: {
    type: String
  },

  contactNumber: {
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

  location: {
    type: String // e.g., "123 Main St, City"
  },

  mapCoordinates: {
    type: String // e.g., "40.7128° N, 74.0060° W"
  },

  capacity: {
    type: Number // only for venues
  },

  amenities: [
    {
      type: String
    }
  ],

  images: [
    {
      type: String // File names or URLs
    }
  ],

  availability: {
    start: {
      type: Date
    },
    end: {
      type: Date
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', serviceSchema);
