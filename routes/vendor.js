const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('vendor/dashboard');
});

module.exports = router; // ✅ THIS MUST BE PRESENT
