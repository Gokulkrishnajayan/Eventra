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

// GET service by ID (for detail view)
router.get('/service/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Services
router.get('/services', async (req, res) => {
  const services = await Service.find();
  res.render('user/services', { services });
});

// My Bookings
router.get('/bookings', async (req, res) => {
  const bookings = await Booking.find()
  .populate('userId')
  .populate('vendorId')
  .populate('serviceId');

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


router.post('/book', async (req, res) => {
  try {
    const {
      vendorId,
      serviceId,
      date,
      startTime,
      endTime,
      specialRequest,
      totalPrice,
      amenities = []
    } = req.body;

    const userId = req.session.user.id;

    const booking = new Booking({
      userId,
      vendorId,
      serviceId,
      date,
      startTime,
      endTime,
      specialRequest,
      totalPrice,
      status: 'pending',
      createdAt: new Date(),
      amenities
    });

    await booking.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Error saving booking:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.get('/booking/:id', async (req, res) => {
  try {
    const currentUserId = req.session?.user?.id;
    if (!currentUserId) return res.status(401).json({ error: 'Unauthorized' });

    const booking = await Booking.findOne({ _id: req.params.id, userId: currentUserId })
      .populate({ path: 'serviceId', model: 'Service' })
      .populate({ path: 'vendorId', model: 'User', select: 'name phone email' })
      .populate({ path: 'userId', model: 'User', select: 'name email phone' });

    if (!booking) return res.status(404).json({ error: 'Booking not found for this user' });

    res.json({ booking });
  } catch (err) {
    console.error('Error fetching booking details:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// POST /user/pay/:bookingId
// ✅ ADD THIS POST ROUTE to the bottom (or near booking routes)
router.post('/pay/:bookingId', async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const userId = req.session.user.id;

    const booking = await Booking.findOne({ _id: bookingId, userId }).populate('serviceId');
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });

    // Save payment
    const payment = new Payment({
      bookingId,
      userId,
      amount: booking.totalPrice,
      method: req.body.method || 'card',
      status: 'paid',
      transactionId: 'TX' + Math.floor(Math.random() * 1e12),
      paidAt: new Date()
    });

    await payment.save();

    // Update booking status to confirmed
    booking.status = 'confirmed';
    await booking.save();

    res.json({
      success: true,
      booking,
      payment
    });
  } catch (err) {
    console.error('Payment route error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Reject booking
router.post('/booking/reject/:id', async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    res.json({ success: true });
  } catch (err) {
    console.error('Reject error:', err);
    res.status(500).json({ success: false });
  }
});



module.exports = router;
