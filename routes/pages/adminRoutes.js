// 📁 routes/pages/adminRoutes.js
const express = require('express');
const router = express.Router();

const User = require('../../models/userSchema');
const Vendor = require('../../models/vendorSchema');
const Service = require('../../models/serviceSchema');
const Booking = require('../../models/bookingSchema');
const Venue = require('../../models/venueSchema');
const Payment = require('../../models/paymentSchema');
const Feedback = require('../../models/feedbackSchema');
const Message = require('../../models/messageSchema');

// Admin Routes
router.get('/dashboard', (req, res) => res.render('admin/dashboard'));


router.get('/users', async (req, res) => {
  const users = await User.find();
  res.render('admin/users', { users });
});
router.get('/venues', async (req, res) => {
  const venues = await Venue.find();
  res.render('admin/venues', { venues });
});
router.get('/vendors', async (req, res) => {
  const vendors = await Vendor.find();
  res.render('admin/vendors', { vendors });
});
router.get('/bookings', async (req, res) => {
  const bookings = await Booking.find();
  res.render('admin/bookings', { bookings });
});
router.get('/payments', async (req, res) => {
  const payments = await Payment.find();
  res.render('admin/payments', { payments });
});
router.get('/feedbacks', async (req, res) => {
  const feedbacks = await Feedback.find();
  res.render('admin/feedbacks', { feedbacks });
});
router.get('/pricing', (req, res) => res.render('admin/pricing'));
router.get('/reports', (req, res) => res.render('admin/reports'));
router.get('/settings', (req, res) => res.render('admin/settings'));

module.exports = router;
