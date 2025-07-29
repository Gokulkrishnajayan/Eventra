const express = require('express');
const router = express.Router();

const Service = require('../../models/serviceSchema');
const Booking = require('../../models/bookingSchema');
const Feedback = require('../../models/feedbackSchema');
const Message = require('../../models/messageSchema');

// Dashboard
router.get('/dashboard', (req, res) => {
  res.render('vendor/dashboard');
});

// My Services
router.get('/services', async (req, res) => {
  const services = await Service.find(); // Filter by vendorId if needed
  res.render('vendor/services', { services });
});

// Bookings
router.get('/bookings', async (req, res) => {
  const bookings = await Booking.find(); // Filter by vendorId if needed
  res.render('vendor/bookings', { bookings });
});

// Availability
router.get('/availability', (req, res) => {
  res.render('vendor/availability');
});

// Reviews
router.get('/reviews', async (req, res) => {
  const reviews = await Feedback.find(); // Filter by vendorId or serviceId
  res.render('vendor/reviews', { reviews });
});

// Messages
router.get('/messages', async (req, res) => {
  const messages = await Message.find(); // Filter by vendorId
  res.render('vendor/messages', { messages });
});

// Promotions
router.get('/promotions', (req, res) => {
  res.render('vendor/promotions');
});

// Loyalty Program
router.get('/loyalty', (req, res) => {
  res.render('vendor/loyalty');
});

// Settings
router.get('/settings', (req, res) => {
  res.render('vendor/settings');
});

module.exports = router;
