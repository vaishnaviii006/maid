const Rating = require('../models/Rating');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');

exports.submitRating = async (req, res) => {
  try {
    const { workerId, bookingId, rating, review, categories, month } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    const existing = await Rating.findOne({ user: req.user.id, worker: workerId, month });
    if (existing) return res.status(400).json({ success: false, message: 'Already rated this worker for this month' });

    const ratingDoc = await Rating.create({
      user: req.user.id, worker: workerId, booking: bookingId,
      rating, review, categories, month
    });

    // Update worker's average rating
    const allRatings = await Rating.find({ worker: workerId });
    const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    await Worker.findByIdAndUpdate(workerId, { rating: Math.round(avg * 10) / 10, totalRatings: allRatings.length });

    res.status(201).json({ success: true, rating: ratingDoc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getWorkerRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ worker: req.params.workerId, isPublic: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: ratings.length, ratings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user.id })
      .populate('worker', 'name category avatar')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, ratings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
