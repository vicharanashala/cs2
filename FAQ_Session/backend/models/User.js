const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, default: null },
  name: { type: String },
  email: { type: String },
  password: { type: String, default: null }, // Hashed password (null for Google-only accounts)
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);