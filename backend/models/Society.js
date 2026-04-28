const mongoose = require('mongoose');

const societySchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationNumber: { type: String, unique: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  address: {
    line1: String,
    city: { type: String, required: true },
    state: String,
    pincode: String
  },
  totalFlats: { type: Number },
  subscribedFlats: { type: Number, default: 0 },
  approvedWorkers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }],
  blockedWorkers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }],
  residents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  entryRules: {
    requiresApproval: { type: Boolean, default: true },
    timingRestriction: { type: Boolean, default: false },
    allowedStartTime: String,
    allowedEndTime: String
  },
  contactEmail: String,
  contactPhone: String,
  logo: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Society', societySchema);
