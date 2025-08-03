const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
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


router.get('/services/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    res.json(service);
  } catch (err) {
    console.error('Error fetching service:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
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


router.get('/bookings', async (req, res) => {
  try {
    const vendorId = req.session.user?.id;
    if (!vendorId) return res.status(401).send('Unauthorized');

    const bookings = await Booking.find({ vendorId })
      .populate('userId')        // ✅ Get customer name
      .populate('serviceId');    // ✅ Get service name

    res.render('vendor/bookings', { bookings });
  } catch (err) {
    console.error('Error loading bookings:', err);
    res.status(500).send('Failed to load bookings.');
  }
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

    // Parse & clean inputs
    const name = (req.body.name || '').trim() || 'Untitled Service';

    const priceRaw = Array.isArray(req.body.pricing) ? req.body.pricing[0] : req.body.pricing;
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

    const getDateField = (val) => {
      if (Array.isArray(val)) val = val[0];
      return val && !isNaN(Date.parse(val)) ? new Date(val) : undefined;
    };

    const availabilityStart = getDateField(req.body.availabilityStart);
    const availabilityEnd = getDateField(req.body.availabilityEnd);
    const availability = (availabilityStart || availabilityEnd)
      ? {
          ...(availabilityStart && { start: availabilityStart }),
          ...(availabilityEnd && { end: availabilityEnd }),
        }
      : undefined;

    // Create base service data
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
      status: 'pending',
    };

    // Venue-specific extension
    if (type === 'venue') {
      const capacityRaw = Array.isArray(req.body.capacity) ? req.body.capacity[0] : req.body.capacity;
      const capacity = parseInt(capacityRaw);
      const rawAmenities = req.body.amenities;

      const amenities = Array.isArray(rawAmenities)
        ? rawAmenities
        : rawAmenities
        ? [rawAmenities]
        : [];

      Object.assign(baseData, {
        location: req.body.location || '',
        mapCoordinates: req.body.mapCoordinates || '',
        capacity: isNaN(capacity) ? undefined : capacity,
        amenities,
      });
    }

    // Save the service
    const newService = new Service(baseData);
    await newService.save();


    res.redirect('/vendor/services');
  } catch (err) {
    console.error('Error adding service:', err.message);
    res.status(500).send('Something went wrong while saving the service.');
  }
});



router.post('/services/update', upload.array('images', 5), async (req, res) => {
  try {

    const serviceId = req.body.serviceId;
    const existingService = await Service.findById(serviceId);
    if (!existingService) return res.status(404).send('Service not found');
    
    const type = existingService.category;
    
    // Parse basic fields
    const name = (req.body.name || '').trim() || 'Untitled Service';
    const priceRaw = Array.isArray(req.body.pricing) ? req.body.pricing[0] : req.body.pricing;
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
    
    const getDateField = (val) => {
      if (Array.isArray(val)) val = val[0];
      return val && !isNaN(Date.parse(val)) ? new Date(val) : undefined;
    };
    
    const availabilityStart = getDateField(req.body.availabilityStart);
    const availabilityEnd = getDateField(req.body.availabilityEnd);
    const availability = (availabilityStart || availabilityEnd)
    ? {
      ...(availabilityStart && { start: availabilityStart }),
      ...(availabilityEnd && { end: availabilityEnd }),
    }
    : undefined;
    
    // Handle uploaded and deleted images
    const uploadedImages = req.files?.map(file => file.filename) || [];
    const deletedImages = Array.isArray(req.body.deletedImages)
    ? req.body.deletedImages
    : req.body.deletedImages
    ? [req.body.deletedImages]
    : [];
    
    const updatedImages = (existingService.images || []).filter(img => !deletedImages.includes(img));
    updatedImages.push(...uploadedImages);
    
    // Build update object
    const updates = {
      name,
      price,
      contactNumber,
      description,
      category: req.body.serviceType === 'other' ? req.body.specificServiceType : type,
      availability,
      available: ['on', 'true', true].includes(req.body.active),
      images: updatedImages,
    };

    // Venue-specific extension
    if (type === 'Venue') {
      const capacityRaw = Array.isArray(req.body.capacity) ? req.body.capacity[0] : req.body.capacity;
      const capacity = parseInt(capacityRaw);

      const rawAmenities = req.body.amenities;
      console.log(rawAmenities);
      const amenities = Array.isArray(rawAmenities)
      ? rawAmenities
      : rawAmenities
      ? [rawAmenities]
      : [];
      
      // console.log(req.body);
      Object.assign(updates, {
        location: req.body.location || '',
        mapCoordinates: req.body.mapCoordinates || '',
        capacity: isNaN(capacity) ? undefined : capacity,
        amenities,
      });
    } else {
      // Remove venue-specific fields if not a venue
      Object.assign(updates, {
        location: undefined,
        mapCoordinates: undefined,
        capacity: undefined,
        amenities: [],
      });
    }

    // Update the document
    await Service.findByIdAndUpdate(serviceId, { $set: updates });
    console.log(updates);

    // Delete images from disk

    deletedImages.forEach(img => {
      const filePath = path.join(__dirname, '../../public/uploads/', img);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    res.redirect('/vendor/services');
  } catch (err) {
    console.error('Error updating service:', err.message);
    res.status(500).send('Something went wrong while updating the service.');
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



router.post('/services/delete', async (req, res) => {
  try {
    const { serviceId } = req.body;
    const vendorId = req.session.user?.id;

    if (!vendorId) return res.status(401).send('Unauthorized');

    const service = await Service.findOne({ _id: serviceId, vendorId });  
    if (!service) return res.status(404).send('Service not found');

    // Delete service images from /uploads
    if (Array.isArray(service.images)) {
      service.images.forEach(img => {
        const filePath = path.join(__dirname, '../../public/uploads/', img);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    // Delete the service itself
    await Service.findByIdAndDelete(serviceId);

    res.redirect('/vendor/services');
  } catch (err) {
    console.error('Error deleting service:', err.message);
    res.status(500).send('Failed to delete service.');
  }
});



// Confirm booking
router.post('/booking/confirm/:id', async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { status: 'payment due' });
    res.json({ success: true });
  } catch (err) {
    console.error('Confirm error:', err);
    res.status(500).json({ success: false });
  }
});

// Mark as completed
router.post('/booking/complete/:id', async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { status: 'completed' });
    res.json({ success: true });
  } catch (err) {
    console.error('Complete error:', err);
    res.status(500).json({ success: false });
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
