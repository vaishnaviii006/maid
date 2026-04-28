const User = require('../models/User');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const Society = require('../models/Society');

exports.getDashboardStats = async (req, res) => {
  try {
    const [users, workers, bookings, payments, complaints, societies] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Worker.countDocuments(),
      Booking.countDocuments({ status: 'active' }),
      Payment.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Complaint.countDocuments({ status: 'open' }),
      Society.countDocuments({ isActive: true })
    ]);
    const revenue = payments[0]?.total || 0;
    res.status(200).json({ success: true, stats: { users, workers, activeBookings: bookings, revenue, openComplaints: complaints, societies } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.status(200).json({ success: true, total, page: Number(page), users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ success: true, message: `User ${user.isActive ? 'activated' : 'suspended'}`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate('raisedBy', 'name email')
      .populate('against.worker', 'name')
      .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.status(200).json({ success: true, total, complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resolveComplaint = async (req, res) => {
  try {
    const { resolution } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved', resolution, resolvedAt: new Date(), resolvedBy: req.user.id },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.status(200).json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRevenueAnalytics = async (req, res) => {
  try {
    const monthly = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: '$month', revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 12 }
    ]);
    const byCategory = await Booking.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.status(200).json({ success: true, monthly, byCategory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
