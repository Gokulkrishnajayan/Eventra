// 📁 routes/pages/adminRoutes.js
const express = require('express');
const router = express.Router();

const multer = require('multer');
const User = require('../../models/userSchema');
const Vendor = require('../../models/vendorSchema');
const Service = require('../../models/serviceSchema');
const Booking = require('../../models/bookingSchema');
const Venue = require('../../models/venueSchema');
const Payment = require('../../models/paymentSchema');
const Feedback = require('../../models/feedbackSchema');
const Message = require('../../models/messageSchema');


// Multer setup for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Admin Routes
router.get('/dashboard', (req, res) => res.render('admin/dashboard'));


router.get('/users', async (req, res) => {
  const { search, role, status } = req.query;
  const query = {};

  if (search) {
    const regex = new RegExp(search, 'i');
    query.$or = [
      { name: regex },
      { email: regex },
      { phone: regex }
    ];
  }

  if (role) {
    query.role = role;
  }

  if (status) {
    query.status = status;
  }

  try {
    const users = await User.find(query);
    res.render('admin/users', { users, search, role, status });
  } catch (err) {
    console.error('❌ Failed to fetch users:', err);
    res.status(500).send('Server error');
  }
});


// POST: Add New User
router.post('/users/add', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, role, status, password } = req.body;

    const user = new User({
      name: `${firstName} ${lastName}`, // ✅ Combine here
      email,
      phone,
      role,
      status,
      password
    });

    await user.save();
    res.redirect('/admin/users');
  } catch (err) {
    console.error('❌ Failed to add user:', err);
    res.status(500).send('Error adding user');
  }
});


router.post('/users/edit/:id', async (req, res) => {
  const { firstName, lastName, email, phone, role, status, password } = req.body;
  const name = `${firstName} ${lastName}`;

  try {
    await User.findByIdAndUpdate(req.params.id, {
      name, email, phone, role, status, password
    });
    res.redirect('/admin/users');
  } catch (err) {
    console.error('❌ Failed to update user:', err);
    res.status(500).send("Failed to update user");
  }
});


router.post('/users/delete/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin/users');
  } catch (err) {
    console.error('❌ Failed to delete user:', err);
    res.status(500).send('Server error deleting user');
  }
});



// Render venues page with real data
router.get('/venues', async (req, res) => {
  const venues = await Venue.find().populate('vendorId');
  const vendors = await Vendor.find();
  res.render('admin/venues', { venues, vendors });
});

// Add new venue
router.post('/venues/add', async (req, res) => {
  try {
    const venue = new Venue(req.body);
    await venue.save();
    res.redirect('/admin/venues');
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add venue");
  }
});

// Edit venue
router.post('/venues/edit/:id', async (req, res) => {
  try {
    await Venue.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/admin/venues');
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update venue");
  }
});

// Delete venue
router.get('/venues/delete/:id', async (req, res) => {
  try {
    await Venue.findByIdAndDelete(req.params.id);
    res.redirect('/admin/venues');
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete venue");
  }
});










router.get('/vendors', async (req, res) => {
  const vendors = await Vendor.find().sort({ createdAt: -1 });
  res.render('admin/vendors', { vendors });
});

// POST: Add new vendor
router.post('/vendors/add', async (req, res) => {
  try {
    const {
      businessName,
      category,
      contactPerson,
      email,
      phone,
      status,
      description
    } = req.body;

    const newVendor = new Vendor({
      businessName,
      category,
      contactPerson,
      email,
      contactNumber: phone,
      status,
      description
    });

    await newVendor.save();
    res.redirect('/admin/vendors');
  } catch (err) {
    console.error("❌ Error adding vendor:", err);
    res.status(500).send('Server Error');
  }
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
