const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const { createNotification } = require('../utils/notifications');

// @desc  Create booking
// @route POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { workerId, category, timeSlot, days, startDate, monthlyAmount, address, notes } = req.body;

    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    if (worker.status !== 'approved') return res.status(400).json({ success: false, message: 'Worker is not available' });
    if (worker.currentClients.length >= worker.maxClients) {
      return res.status(400).json({ success: false, message: 'Worker has reached maximum client capacity' });
    }

    const existing = await Booking.findOne({ user: req.user.id, worker: workerId, status: 'active' });
    if (existing) return res.status(400).json({ success: false, message: 'You already have an active booking with this worker' });

    const booking = await Booking.create({
      user: req.user.id, worker: workerId, category,
      timeSlot, days, startDate, monthlyAmount, address, notes
    });

    // Add user to worker's client list
    await Worker.findByIdAndUpdate(workerId, { $addToSet: { currentClients: req.user.id } });

    await createNotification({
      recipient: req.user.id,
      type: 'booking_confirmed',
      title: 'Booking Confirmed!',
      message: `Your ${category} booking with ${worker.name} is confirmed starting ${new Date(startDate).toLocaleDateString('en-IN')}.`,
      data: { bookingId: booking._id }
    });

    const populated = await booking.populate([
      { path: 'worker', select: 'name phone category rating avatar' },
      { path: 'user', select: 'name email phone' }
    ]);

    res.status(201).json({ success: true, booking: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get my bookings (user)
// @route GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('worker', 'name phone category rating avatar')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single booking
// @route GET /api/bookings/:id
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('worker', 'name phone category rating avatar bio')
      .populate('user', 'name email phone flatNumber');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.status(200).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Cancel booking
// @route PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    booking.status = 'cancelled';
    booking.endDate = new Date();
    await booking.save();

    await Worker.findByIdAndUpdate(booking.worker, { $pull: { currentClients: req.user.id } });

    res.status(200).json({ success: true, message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Request replacement
// @route POST /api/bookings/:id/replacement
exports.requestReplacement = async (req, res) => {
  try {
    const { reason, type, newWorkerId } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.replacementHistory.push({
      originalWorker: booking.worker,
      replacementWorker: newWorkerId || null,
      reason,
      date: new Date(),
      type: type || 'temporary'
    });

    if (type === 'permanent' && newWorkerId) {
      booking.worker = newWorkerId;
    }

    await booking.save();
    res.status(200).json({ success: true, message: 'Replacement request submitted', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all bookings (admin)
// @route GET /api/bookings/admin/all
exports.getAllBookings = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('worker', 'name phone category')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, page: Number(page), bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
