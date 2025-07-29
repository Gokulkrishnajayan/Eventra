// 📦 Required Packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

// 🚀 App Initialization
const app = express();
dotenv.config();

// 🔗 Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// 🧩 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 🎨 View Engine Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/adminLayout'); // default layout (used only if not overridden)

// 🌐 Root Test Route
app.get('/', (req, res) => {
  res.send('🎉 Eventra API is working!');
});


// ========================================
// ✨ Layout-Specific Routes
// ========================================

// 🛠 Admin Pages
app.use('/admin', (req, res, next) => {
  app.set('layout', 'layouts/adminLayout');
  next();
}, require('./routes/pages/adminRoutes'));

// 👤 User Pages
app.use('/user', (req, res, next) => {
  app.set('layout', 'layouts/userLayout');
  next();
}, require('./routes/pages/userRoutes'));

// 🏪 Vendor Pages
app.use('/vendor', (req, res, next) => {
  app.set('layout', 'layouts/vendorLayout');
  next();
}, require('./routes/pages/vendorRoutes'));


// ========================================
// 🚀 Server Start
// ========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
