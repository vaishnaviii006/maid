const express = require('express');
const router = express.Router();
const { generateInvoice, getMyInvoices, payInvoice, getWorkerEarnings, getAllPayments } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/generate', generateInvoice);
router.get('/my', getMyInvoices);
router.put('/:id/pay', payInvoice);
router.get('/worker/:workerId/earnings', getWorkerEarnings);
router.get('/admin/all', authorize('super_admin'), getAllPayments);

module.exports = router;
