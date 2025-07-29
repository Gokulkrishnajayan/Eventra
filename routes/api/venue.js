const express = require('express');
const router = express.Router();
const Venue = require('../../models/venueSchema');

// Create Venue
router.post('/add', async (req, res) => {
  try {
    const venue = new Venue(req.body);
    await venue.save();
    res.status(201).json(venue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Venues
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Venue
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ error: 'Venue not found' });
    res.json(venue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Venue
router.put('/:id', async (req, res) => {
  try {
    const updated = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Venue
router.delete('/:id', async (req, res) => {
  try {
    await Venue.findByIdAndDelete(req.params.id);
    res.json({ message: 'Venue deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
