const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  avatar: { type: String, default: '' },
  category: {
    type: String,
    enum: ['maid', 'cook', 'nanny', 'elder_care'],
    required: true
  },
  experience: { type: Number, default: 0 }, // in years
  bio: { type: String },
  languages: [String],
  skills: [String],
  availability: {
    morning: { type: Boolean, default: true },   // 6am-12pm
    afternoon: { type: Boolean, default: false }, // 12pm-6pm
    evening: { type: Boolean, default: false }    // 6pm-10pm
  },
  availableDays: [{
    type: String,
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }],
  currentClients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxClients: { type: Number, default: 5 },
  serviceAreas: [String], // cities/localities
  hourlyRate: { type: Number },
  monthlyRate: { type: Number },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'approved', 'suspended', 'inactive'],
    default: 'pending'
  },
  kyc: {
    aadhaar: { url: String, verified: { type: Boolean, default: false } },
    pan: { url: String, verified: { type: Boolean, default: false } },
    photo: { url: String },
    addressProof: { url: String, verified: { type: Boolean, default: false } },
    policeVerification: { url: String, verified: { type: Boolean, default: false } }
  },
  address: {
    line1: String,
    city: String,
    state: String,
    pincode: String
  },
  bankDetails: {
    accountNumber: String,
    ifsc: String,
    bankName: String,
    upiId: String
  },
  joinedAt: { type: Date, default: Date.now },
  totalEarnings: { type: Number, default: 0 },
  societies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Society' }]
}, { timestamps: true });

module.exports = mongoose.model('Worker', workerSchema);
