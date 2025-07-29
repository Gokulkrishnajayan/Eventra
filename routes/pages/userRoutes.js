// 📁 routes/pages/userRoutes.js
const express = require('express');
const router = express.Router();

const Service = require('../../models/serviceSchema');
const Booking = require('../../models/bookingSchema');
const Feedback = require('../../models/feedbackSchema');
const Message = require('../../models/messageSchema');

// User Home
router.get('/home', (req, res) => {
  res.render('user/home');
});

// View All Services
router.get('/services', async (req, res) => {
  const services = await Service.find().populate('vendorId', 'name phone');
  res.render('user/services', { services });
});

// View Bookings
router.get('/bookings', async (req, res) => {
  const bookings = await Booking.find({ userId: req.user?._id })
    .populate('serviceId', 'title')
    .populate('vendorId', 'name')
    .populate('venueId', 'name');
  res.render('user/bookings', { bookings });
});

// Feedback Page
router.get('/feedbacks', async (req, res) => {
  const feedbacks = await Feedback.find({ userId: req.user?._id })
    .populate('serviceId', 'title');
  res.render('user/feedbacks', { feedbacks });
});

// Chat Messages
router.get('/messages', async (req, res) => {
  const messages = await Message.find({ senderId: req.user?._id })
    .populate('receiverId', 'name');
  res.render('user/messages', { messages });
});

module.exports = router;
