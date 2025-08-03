const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');


// Show signup form
router.get('/signup', (req, res) => {
  res.render('auth/signup', { layout: false }); // disable layout if needed
});


// Handle signup POST
router.post('/signup', async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('⚠️ Email already registered.');

    const newUser = new User({
      name,
      email,
      password, // 🔒 In production, hash this!
      phone,
      role,
      status: 'active' // or 'pending' if you want email verification
    });

    await newUser.save();

    // Auto-login after signup
    req.session.user = {
      id: newUser._id,
      role: newUser.role,
      name: newUser.name
    };

    // Redirect based on role
    if (role === 'vendor') return res.redirect('/vendor/dashboard');
    if (role === 'customer') return res.redirect('/user/dashboard');

    res.redirect('/');
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).send('Server error');
  }
});






// Show login form
router.get('/login', (req, res) => {
  res.render('auth/login', { layout: false }); // 👈 disables default layout
});

// Handle login POST
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password }); // for now, plain text match
    if (!user) return res.status(401).send('❌ Invalid credentials');

    // Save to session
    req.session.user = {
      id: user._id,
      role: user.role,
      name: user.firstName + ' ' + user.lastName
    };

    // Redirect by role
    if (user.role === 'admin') return res.redirect('/admin/dashboard');
    if (user.role === 'vendor') return res.redirect('/vendor/dashboard');
    if (user.role === 'customer') return res.redirect('/user/dashboard');

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
