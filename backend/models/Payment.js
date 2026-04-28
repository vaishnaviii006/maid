const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  month: { type: String, required: true }, // "2024-01"
  billingPeriod: {
    start: Date,
    end: Date
  },
  breakdown: {
    baseFee: { type: Number, required: true },
    workingDays: { type: Number },
    presentDays: { type: Number },
    absentDays: { type: Number },
    absentDeduction: { type: Number, default: 0 },
    overtimeAddition: { type: Number, default: 0 },
    replacementCredit: { type: Number, default: 0 },
    tax: { type: Number, default: 0 }
  },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'waived'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'netbanking', 'card', 'cash', 'wallet'],
  },
  transactionId: { type: String },
  paidAt: { type: Date },
  dueDate: { type: Date },
  invoiceNumber: { type: String, unique: true },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
