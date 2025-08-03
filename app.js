// 📦 Required Packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const { ensureLoggedIn, allowRoles } = require('./middlewares/auth');

// 🚀 App Initialization
const app = express();
dotenv.config();

// ========================================
// 🧩 Middleware Setup (IMPORTANT ORDER)
// ========================================
app.use(express.urlencoded({ extended: true }));  // Form data parser
app.use(express.json());                          // JSON parser
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('public/uploads'));

app.use(session({
  secret: 'eventra-secret',
  resave: false,
  saveUninitialized: true
}));

// ========================================
// 🔗 MongoDB Connection
// ========================================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ========================================
// 🎨 View Engine Configuration
// ========================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/adminLayout'); // Default layout

// ========================================
// 🌐 Auth Routes (Login, Logout)
// ========================================
app.use('/', require('./routes/authRoutes'));

// Public landing page
// 🌐 Landing page at /
app.get('/', (req, res) => {
  res.render('auth/index', { layout: false }); // 👈 points to views/auth/index.ejs
});


// ========================================
// ✨ Layout-Specific Routes (Role Protected)
// ========================================

// 🛠 Admin Pages
app.use('/admin',
  ensureLoggedIn,
  allowRoles('admin'),
  (req, res, next) => {
    app.set('layout', 'layouts/adminLayout');
    next();
  },
  require('./routes/pages/adminRoutes')
);

// 🏪 Vendor Pages
app.use('/vendor',
  ensureLoggedIn,
  allowRoles('vendor'),
  (req, res, next) => {
    app.set('layout', 'layouts/vendorLayout');
    next();
  },
  require('./routes/pages/vendorRoutes')
);

// 👤 Customer Pages
app.use('/user',
  ensureLoggedIn,
  allowRoles('user', 'customer'), // you may use just 'user' if your DB has that
  (req, res, next) => {
    app.set('layout', 'layouts/userLayout');
    next();
  },
  require('./routes/pages/userRoutes')
);

// ========================================
// 🚀 Server Start
// ========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
