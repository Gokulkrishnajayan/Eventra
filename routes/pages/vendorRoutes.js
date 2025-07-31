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


// My Services - with filters
router.get('/services', async (req, res) => {
  try {
    const vendorId = req.session.user?.id;
    if (!vendorId) return res.status(401).send('Unauthorized');

    const { category, status, search } = req.query;
    const filter = { vendorId };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (status && status !== 'all') {
      filter.available = status === 'active';
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const services = await Service.find(filter);
    res.render('vendor/services', { services, query: req.query });
  } catch (err) {
    console.error('Error loading services:', err.message);
    res.status(500).send('Server error');
  }
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
    if (!req.session.user?.id) return res.status(401).send('Vendor not authenticated');
    const vendorId = req.session.user.id;
    const type = req.body.serviceType;

    // Parse & clean data
    const name = req.body.name?.trim() || 'Untitled Service';
    const priceRaw = Array.isArray(req.body.pricing) ? req.body.pricing[0] : req.body.pricing || '';
    const price = parseFloat(String(priceRaw).replace(/[^\d.]/g, '')) || 0;

    if (!name || isNaN(price) || price <= 0) {
      return res.status(400).send('Name and price are required.');
    }

    const contactNumber = Array.isArray(req.body.contactNumber)
      ? req.body.contactNumber[0]
      : req.body.contactNumber || '';

    const description = Array.isArray(req.body.description)
      ? req.body.description[0]
      : req.body.description || '';

    const images = req.files?.map(file => file.filename) || [];

    const getDateField = (value) => {
      if (Array.isArray(value)) value = value[0];
      return value && !isNaN(Date.parse(value)) ? new Date(value) : undefined;
    };

    const availabilityStart = getDateField(req.body.availabilityStart);
    const availabilityEnd = getDateField(req.body.availabilityEnd);
    let availability = undefined;
    if (availabilityStart || availabilityEnd) {
      availability = {};
      if (availabilityStart) availability.start = availabilityStart;
      if (availabilityEnd) availability.end = availabilityEnd;
    }

    // Base fields for all service types
    const baseData = {
      vendorId,
      name,
      price,
      contactNumber,
      description,
      category: type === 'other' ? req.body.specificServiceType : type,
      images,
      availability,
      available: ['on', true, 'true'].includes(req.body.active),
      status: 'pending'
    };

    // Add venue-specific fields
    if (type === 'venue') {
      const capacity = req.body.capacity ? parseInt(req.body.capacity) : undefined;

      const amenities = Array.isArray(req.body.amenities)
        ? req.body.amenities
        : req.body.amenities ? [req.body.amenities] : [];

      Object.assign(baseData, {
        location: req.body.location || '',
        mapCoordinates: req.body.mapCoordinates || '',
        capacity: isNaN(capacity) ? undefined : capacity,
        amenities
      });
    }

    const newService = new Service(baseData);
    await newService.save();

    res.redirect('/vendor/services');
  } catch (err) {
    console.error('Error adding service:', err.message);
    res.status(500).send('Something went wrong while saving the service.');
  }
});





router.get('/services/images/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    res.json({ images: service.images || [] });
  } catch (err) {
    console.error('Error loading service images:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
