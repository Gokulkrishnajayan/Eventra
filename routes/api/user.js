const express = require('express');
const router = express.Router();
const User = require('../../models/userSchema');

// 🔹 Create a new user
router.post('/add', async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    const user = new User({ name, email, phone, role });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get all users
router.get('/get', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get single user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Update user by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Delete user by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
