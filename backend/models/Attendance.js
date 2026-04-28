const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['present', 'absent', 'half_day', 'holiday', 'replacement'],
    required: true
  },
  checkIn: { type: String },   // "07:10"
  checkOut: { type: String },  // "09:05"
  overtimeMinutes: { type: Number, default: 0 },
  notes: { type: String },
  markedBy: {
    type: String,
    enum: ['user', 'worker', 'system'],
    default: 'system'
  }
}, { timestamps: true });

attendanceSchema.index({ booking: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
