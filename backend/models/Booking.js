const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  category: {
    type: String,
    enum: ['maid', 'cook', 'nanny', 'elder_care'],
    required: true
  },
  timeSlot: {
    start: { type: String, required: true }, // e.g. "07:00"
    end: { type: String, required: true }    // e.g. "09:00"
  },
  days: [{
    type: String,
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }],
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  monthlyAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'active', 'paused', 'cancelled', 'completed'],
    default: 'pending'
  },
  address: {
    line1: String,
    city: String,
    state: String,
    pincode: String,
    flatNumber: String
  },
  notes: { type: String },
  autoRenew: { type: Boolean, default: true },
  replacementHistory: [{
    originalWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
    replacementWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
    reason: String,
    date: Date,
    type: { type: String, enum: ['temporary', 'permanent'] }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
