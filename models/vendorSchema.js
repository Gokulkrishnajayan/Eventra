const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  businessName: {
    type: String,
    required: true
  },

  contactNumber: {
    type: String,
    required: true
  },

  address: {
    type: String
  },

  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    }
  ],

  venues: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue'
    }
  ],

  approved: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vendor', vendorSchema);
