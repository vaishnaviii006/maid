const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, maxlength: 500 },
  categories: {
    punctuality: { type: Number, min: 1, max: 5 },
    quality: { type: Number, min: 1, max: 5 },
    behavior: { type: Number, min: 1, max: 5 }
  },
  isPublic: { type: Boolean, default: true },
  month: { type: String } // "2024-01"
}, { timestamps: true });

ratingSchema.index({ user: 1, worker: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
