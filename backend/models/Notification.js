const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: [
      'booking_confirmed', 'booking_cancelled', 'worker_arrived', 'worker_missed',
      'payment_due', 'payment_received', 'replacement_assigned', 'replacement_requested',
      'review_reminder', 'worker_approved', 'system_alert', 'complaint_update'
    ],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed }, // extra payload
  isRead: { type: Boolean, default: false },
  readAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
