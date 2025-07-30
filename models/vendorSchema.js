const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   unique: true,
  //   required: false // optional for standalone vendor entry
  // },

  businessName: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  contactPerson: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  contactNumber: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  description: {
    type: String
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
