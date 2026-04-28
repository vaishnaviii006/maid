const Attendance = require('../models/Attendance');
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');

exports.markAttendance = async (req, res) => {
  try {
    const { bookingId, date, status, checkIn, checkOut, notes } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    const markedBy = req.user.role === 'worker' ? 'worker' : 'user';
    const existing = await Attendance.findOne({ booking: bookingId, date: new Date(date) });
    if (existing) {
      existing.status = status;
      if (checkIn) existing.checkIn = checkIn;
      if (checkOut) existing.checkOut = checkOut;
      if (notes) existing.notes = notes;
      existing.markedBy = markedBy;
      await existing.save();
      return res.status(200).json({ success: true, attendance: existing });
    }
    const attendance = await Attendance.create({
      booking: bookingId, worker: booking.worker, user: booking.user,
      date: new Date(date), status, checkIn, checkOut, notes, markedBy
    });
    res.status(201).json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBookingAttendance = async (req, res) => {
  try {
    const { month } = req.query;
    const query = { booking: req.params.bookingId };
    if (month) {
      const [year, m] = month.split('-');
      query.date = { $gte: new Date(year, m - 1, 1), $lte: new Date(year, m, 0, 23, 59, 59) };
    }
    const records = await Attendance.find(query).sort({ date: 1 });
    res.status(200).json({ success: true, count: records.length, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.checkIn = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const today = new Date(); today.setHours(0,0,0,0);
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    const now = new Date();
    const checkInTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    let record = await Attendance.findOne({ booking: bookingId, date: today });
    if (record) { record.checkIn = checkInTime; record.status = 'present'; await record.save(); }
    else {
      record = await Attendance.create({
        booking: bookingId, worker: booking.worker, user: booking.user,
        date: today, status: 'present', checkIn: checkInTime, markedBy: 'worker'
      });
    }
    res.status(200).json({ success: true, message: 'Checked in', attendance: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const today = new Date(); today.setHours(0,0,0,0);
    const now = new Date();
    const checkOutTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const record = await Attendance.findOne({ booking: bookingId, date: today });
    if (!record) return res.status(404).json({ success: false, message: 'No check-in found for today' });
    record.checkOut = checkOutTime; await record.save();
    res.status(200).json({ success: true, message: 'Checked out', attendance: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getWorkerAttendanceSummary = async (req, res) => {
  try {
    const { month } = req.query;
    const worker = await Worker.findOne({ userId: req.user.id });
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    const query = { worker: worker._id };
    if (month) {
      const [year, m] = month.split('-');
      query.date = { $gte: new Date(year, m - 1, 1), $lte: new Date(year, m, 0, 23, 59, 59) };
    }
    const records = await Attendance.find(query).sort({ date: -1 });
    const present = records.filter(r => ['present','half_day'].includes(r.status)).length;
    const absent = records.filter(r => r.status === 'absent').length;
    res.status(200).json({ success: true, summary: { present, absent, total: records.length }, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
