const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');


const Service = require('../../models/serviceSchema');
const Booking = require('../../models/bookingSchema');
const Feedback = require('../../models/feedbackSchema');
const Message = require('../../models/messageSchema');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });


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

router.post('/services/add', upload.array('images', 5), async (req, res) => {
  try {
    const {
      serviceType,
      venueName,
      businessName,
      specificServiceType,
      pricing,
      contactNumber,
      location,
      mapCoordinates,
      capacity,
      description,
      availabilityStart,
      availabilityEnd,
      venueActive,
      serviceActive
    } = req.body;

    let amenities = req.body.amenities || [];
    if (!Array.isArray(amenities)) amenities = [amenities];

    const name = venueName || businessName || 'Untitled Service';
    const category = serviceType === 'venue' ? 'venue' : specificServiceType;
    const price = Number(pricing.replace(/[^\d.-]/g, '')) || 0;

    const newService = new Service({
      name,
      category,
      price,
      description,
      vendorId: req.session.vendorId || req.user?._id || 'TEMP_VENDOR_ID',
      available: (venueActive || serviceActive) === 'on',
      contactNumber,
      location,
      mapCoordinates,
      capacity: capacity ? parseInt(capacity) : undefined,
      amenities,
      availability: {
        start: availabilityStart,
        end: availabilityEnd
      },
      images: req.files.map(file => file.filename)
    });

    await newService.save();
    res.redirect('/vendor/services');
  } catch (err) {
    console.error('Error adding service:', err);
    res.status(500).send('Error poda saving service');
  }
});




module.exports = router;
