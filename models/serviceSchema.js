const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  contactNumber: String,
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  available: { type: Boolean, default: true },
  location: String,
  mapCoordinates: String,
  capacity: Number,
  amenities: [String],
  images: [String],
  availability: {
    start: Date,
    end: Date
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', serviceSchema);
