// 📁 routes/pages/vendorRoutes.js
const express = require('express');
const router = express.Router();

const Service = require('../../models/serviceSchema');
const Booking = require('../../models/bookingSchema');
const Feedback = require('../../models/feedbackSchema');
const Message = require('../../models/messageSchema');

// Vendor Dashboard
router.get('/dashboard', (req, res) => {
  res.render('vendor/dashboard');
});

// View Own Services
router.get('/services', async (req, res) => {
  const services = await Service.find({ vendorId: req.user?._id });
  res.render('vendor/services', { services });
});

// View Bookings Received
router.get('/bookings', async (req, res) => {
  const bookings = await Booking.find({ vendorId: req.user?._id })
    .populate('userId', 'name email')
    .populate('serviceId', 'title');
  res.render('vendor/bookings', { bookings });
});

// Feedback Received
router.get('/feedbacks', async (req, res) => {
  const feedbacks = await Feedback.find({ vendorId: req.user?._id })
    .populate('userId', 'name')
    .populate('serviceId', 'title');
  res.render('vendor/feedbacks', { feedbacks });
});

// Chat with Users
router.get('/messages', async (req, res) => {
  const messages = await Message.find({ receiverId: req.user?._id })
    .populate('senderId', 'name');
  res.render('vendor/messages', { messages });
});

module.exports = router;
