// 📁 routes/pages/userRoutes.js
const express = require('express');
const router = express.Router();

const Booking = require('../../models/bookingSchema');
const Service = require('../../models/serviceSchema');
const Payment = require('../../models/paymentSchema');
const Feedback = require('../../models/feedbackSchema');
// const Notification = require('../../models/notificationSchema'); // optional
// const Loyalty = require('../../models/loyaltySchema'); // optional
const User = require('../../models/userSchema');

// Dashboard
router.get('/dashboard', (req, res) => {
  res.render('user/dashboard');
});

// Services
router.get('/services', async (req, res) => {
  const services = await Service.find();
  res.render('user/services', { services });
});

// My Bookings
router.get('/bookings', async (req, res) => {
  const bookings = await Booking.find().populate('vendorId serviceId venueId');
  res.render('user/bookings', { bookings });
});

// Payments
router.get('/payments', async (req, res) => {
  const payments = await Payment.find().populate('bookingId');
  res.render('user/payments', { payments });
});

// Reviews (Feedback)
router.get('/feedback', async (req, res) => {
  const feedbacks = await Feedback.find().populate('serviceId');
  res.render('user/feedback', { feedbacks });
});

// Loyalty
router.get('/loyalty', (req, res) => {
  res.render('user/loyalty'); // static or future dynamic
});

// Notifications
router.get('/notifications', (req, res) => {
  res.render('user/notifications');
});

// Profile
router.get('/profile', async (req, res) => {
  const user = await User.findOne(); // adjust for actual session-based user
  res.render('user/profile', { user });
});

module.exports = router;
