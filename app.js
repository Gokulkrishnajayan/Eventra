const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'eventra-secret',
  resave: false,
  saveUninitialized: true,
}));

// EJS config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const vendorRoutes = require('./routes/vendor');
app.use('/vendor', vendorRoutes);

app.get('/', (req, res) => {
  res.redirect('/vendor');
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});