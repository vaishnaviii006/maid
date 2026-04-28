const Society = require('../models/Society');
const User = require('../models/User');
const Worker = require('../models/Worker');
const EntryLog = require('../models/EntryLog');
const Complaint = require('../models/Complaint');

exports.getSocieties = async (req, res) => {
  try {
    const { city } = req.query;
    const query = { isActive: true };
    if (city) query['address.city'] = new RegExp(city, 'i');
    const societies = await Society.find(query).select('-approvedWorkers -blockedWorkers -residents');
    res.status(200).json({ success: true, count: societies.length, societies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSociety = async (req, res) => {
  try {
    const society = await Society.create({ ...req.body, admin: req.user.id });
    await User.findByIdAndUpdate(req.user.id, { role: 'society_admin' });
    res.status(201).json({ success: true, society });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMySociety = async (req, res) => {
  try {
    const society = await Society.findOne({ admin: req.user.id })
      .populate('residents', 'name email phone flatNumber')
      .populate('approvedWorkers', 'name category rating phone avatar');
    if (!society) return res.status(404).json({ success: false, message: 'Society not found' });
    res.status(200).json({ success: true, society });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSociety = async (req, res) => {
  try {
    const society = await Society.findOneAndUpdate({ admin: req.user.id }, req.body, { new: true });
    if (!society) return res.status(404).json({ success: false, message: 'Society not found' });
    res.status(200).json({ success: true, society });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.approveWorker = async (req, res) => {
  try {
    const society = await Society.findOne({ admin: req.user.id });
    if (!society) return res.status(404).json({ success: false, message: 'Society not found' });
    await Society.findByIdAndUpdate(society._id, { $addToSet: { approvedWorkers: req.params.workerId }, $pull: { blockedWorkers: req.params.workerId } });
    res.status(200).json({ success: true, message: 'Worker approved for society entry' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.blockWorker = async (req, res) => {
  try {
    const society = await Society.findOne({ admin: req.user.id });
    if (!society) return res.status(404).json({ success: false, message: 'Society not found' });
    await Society.findByIdAndUpdate(society._id, { $addToSet: { blockedWorkers: req.params.workerId }, $pull: { approvedWorkers: req.params.workerId } });
    res.status(200).json({ success: true, message: 'Worker blocked from society entry' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getEntryLogs = async (req, res) => {
  try {
    const society = await Society.findOne({ admin: req.user.id });
    if (!society) return res.status(404).json({ success: false, message: 'Society not found' });
    const { page = 1, limit = 30 } = req.query;
    const logs = await EntryLog.find({ society: society._id })
      .populate('worker', 'name category avatar')
      .populate('user', 'name flatNumber')
      .sort({ entryTime: -1 })
      .skip((page - 1) * limit).limit(Number(limit));
    res.status(200).json({ success: true, count: logs.length, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSocietyComplaints = async (req, res) => {
  try {
    const society = await Society.findOne({ admin: req.user.id });
    const complaints = await Complaint.find({ society: society._id })
      .populate('raisedBy', 'name email flatNumber')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: complaints.length, complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllSocietiesAdmin = async (req, res) => {
  try {
    const societies = await Society.find().populate('admin', 'name email');
    res.status(200).json({ success: true, count: societies.length, societies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
