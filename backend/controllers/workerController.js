const Worker = require('../models/Worker');
const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc  Get all workers (public + filtered)
// @route GET /api/workers
exports.getWorkers = async (req, res) => {
  try {
    const { category, city, rating, page = 1, limit = 12 } = req.query;
    const query = { status: 'approved' };
    if (category) query.category = category;
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (rating) query.rating = { $gte: Number(rating) };

    const total = await Worker.countDocuments(query);
    const workers = await Worker.find(query)
      .select('-kyc -bankDetails -userId')
      .sort({ rating: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, page: Number(page), workers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single worker profile
// @route GET /api/workers/:id
exports.getWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).select('-kyc -bankDetails');
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    res.status(200).json({ success: true, worker });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get my worker profile
// @route GET /api/workers/me
exports.getMyWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user.id });
    if (!worker) return res.status(404).json({ success: false, message: 'Worker profile not found' });
    res.status(200).json({ success: true, worker });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update worker profile
// @route PUT /api/workers/me
exports.updateWorkerProfile = async (req, res) => {
  try {
    const { bio, skills, languages, availability, availableDays, serviceAreas, monthlyRate, address } = req.body;
    const worker = await Worker.findOneAndUpdate(
      { userId: req.user.id },
      { bio, skills, languages, availability, availableDays, serviceAreas, monthlyRate, address },
      { new: true, runValidators: true }
    );
    if (!worker) return res.status(404).json({ success: false, message: 'Worker profile not found' });
    res.status(200).json({ success: true, worker });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get worker's jobs/bookings
// @route GET /api/workers/me/jobs
exports.getWorkerJobs = async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user.id });
    if (!worker) return res.status(404).json({ success: false, message: 'Worker profile not found' });

    const bookings = await Booking.find({ worker: worker._id })
      .populate('user', 'name phone flatNumber address')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Upload KYC document
// @route POST /api/workers/me/kyc
exports.uploadKyc = async (req, res) => {
  try {
    const { docType, url } = req.body;
    const validDocs = ['aadhaar', 'pan', 'photo', 'addressProof', 'policeVerification'];
    if (!validDocs.includes(docType)) {
      return res.status(400).json({ success: false, message: 'Invalid document type' });
    }
    const update = { [`kyc.${docType}.url`]: url };
    const worker = await Worker.findOneAndUpdate({ userId: req.user.id }, update, { new: true });
    res.status(200).json({ success: true, worker });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Admin approve/suspend worker
// @route PUT /api/workers/:id/status
exports.updateWorkerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const worker = await Worker.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    res.status(200).json({ success: true, worker });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all workers for admin
// @route GET /api/workers/admin/all
exports.getAllWorkersAdmin = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const total = await Worker.countDocuments(query);
    const workers = await Worker.find(query)
      .populate('userId', 'email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, page: Number(page), workers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
