const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');
const Booking = require('../models/Booking');
const { generateInvoiceNumber, calculateBilling } = require('../utils/billing');
const { createNotification } = require('../utils/notifications');

exports.generateInvoice = async (req, res) => {
  try {
    const { bookingId, month } = req.body; // month: "2024-01"
    const booking = await Booking.findById(bookingId).populate('worker', 'name');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const existing = await Payment.findOne({ booking: bookingId, month });
    if (existing) return res.status(400).json({ success: false, message: 'Invoice already generated for this month' });

    const [year, m] = month.split('-');
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 0, 23, 59, 59);
    const totalWorkingDays = new Date(year, m, 0).getDate();

    const records = await Attendance.find({ booking: bookingId, date: { $gte: start, $lte: end } });
    const presentDays = records.filter(r => ['present','half_day'].includes(r.status)).length;
    const overtimeMinutes = records.reduce((sum, r) => sum + (r.overtimeMinutes || 0), 0);

    const { absentDays, absentDeduction, overtimeAddition, totalAmount } = calculateBilling({
      baseFee: booking.monthlyAmount, presentDays, totalWorkingDays, overtimeMinutes
    });

    const dueDate = new Date(year, m, 7);
    const invoice = await Payment.create({
      user: booking.user, worker: booking.worker, booking: bookingId,
      month, billingPeriod: { start, end },
      breakdown: {
        baseFee: booking.monthlyAmount, workingDays: totalWorkingDays,
        presentDays, absentDays, absentDeduction, overtimeAddition
      },
      totalAmount, dueDate,
      invoiceNumber: generateInvoiceNumber()
    });

    await createNotification({
      recipient: booking.user,
      type: 'payment_due',
      title: 'Invoice Generated',
      message: `Your invoice for ${booking.worker.name} (${month}) is ₹${totalAmount}. Due by ${dueDate.toLocaleDateString('en-IN')}.`,
      data: { paymentId: invoice._id }
    });

    res.status(201).json({ success: true, invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyInvoices = async (req, res) => {
  try {
    const invoices = await Payment.find({ user: req.user.id })
      .populate('worker', 'name category')
      .populate('booking', 'timeSlot')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: invoices.length, invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.payInvoice = async (req, res) => {
  try {
    const { paymentMethod, transactionId } = req.body;
    const invoice = await Payment.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    if (invoice.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    invoice.status = 'paid';
    invoice.paymentMethod = paymentMethod;
    invoice.transactionId = transactionId;
    invoice.paidAt = new Date();
    await invoice.save();
    await createNotification({
      recipient: req.user.id, type: 'payment_received',
      title: 'Payment Confirmed', message: `Payment of ₹${invoice.totalAmount} received. Invoice #${invoice.invoiceNumber}`,
      data: { paymentId: invoice._id }
    });
    res.status(200).json({ success: true, invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getWorkerEarnings = async (req, res) => {
  try {
    const { month } = req.query;
    const query = { worker: req.params.workerId, status: 'paid' };
    if (month) query.month = month;
    const payments = await Payment.find(query).populate('user', 'name flatNumber');
    const total = payments.reduce((sum, p) => sum + p.totalAmount, 0);
    res.status(200).json({ success: true, total, count: payments.length, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const { status, month, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (month) query.month = month;
    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate('user', 'name email')
      .populate('worker', 'name category')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(Number(limit));
    res.status(200).json({ success: true, total, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
