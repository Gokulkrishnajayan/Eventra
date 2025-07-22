const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Dummy login (replace with DB logic)
  if (email === 'admin@eventra.com' && password === '1234') {
    req.session.user = { email };
    return res.redirect('/');
  }
  res.send('Login failed');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
