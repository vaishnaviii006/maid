const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  against: {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  society: { type: mongoose.Schema.Types.ObjectId, ref: 'Society' },
  category: {
    type: String,
    enum: ['behaviour', 'punctuality', 'quality', 'payment', 'safety', 'other'],
    required: true
  },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  attachments: [String],
  status: {
    type: String,
    enum: ['open', 'in_review', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  resolution: { type: String },
  resolvedAt: Date,
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
