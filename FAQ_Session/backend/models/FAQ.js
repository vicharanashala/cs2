const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String },
  createdBy: { type: String },
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FAQ', faqSchema);