const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

// Import routes and middleware
const authRoutes = require('./backend/routes/auth');
const faqRoutes = require('./backend/routes/faq');
const { authMiddleware, roleMiddleware } = require('./backend/middleware/auth');

// Initialize Passport strategies
require('./backend/config/passport');

const app = express();

// ==================== MIDDLEWARE ====================

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration (required for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ==================== DATABASE CONNECTION ====================

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/faq_session', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ==================== ROUTES ====================

// Auth routes (public)
app.use('/auth', authRoutes);

// FAQ routes
app.use('/faq', faqRoutes);

// Protected route example
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user
  });
});

// Teacher-only route example
app.get('/api/teacher-dashboard', authMiddleware, roleMiddleware(['teacher', 'admin']), (req, res) => {
  res.json({
    message: 'Welcome to teacher dashboard',
    user: req.user
  });
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Auth endpoints available at http://localhost:${PORT}/auth`);
});

module.exports = app;
