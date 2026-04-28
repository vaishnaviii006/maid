const express = require('express');
const router = express.Router();
const { markAttendance, getBookingAttendance, checkIn, checkOut, getWorkerAttendanceSummary } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/', markAttendance);
router.post('/checkin', authorize('worker'), checkIn);
router.post('/checkout', authorize('worker'), checkOut);
router.get('/worker/summary', authorize('worker'), getWorkerAttendanceSummary);
router.get('/booking/:bookingId', getBookingAttendance);

module.exports = router;
