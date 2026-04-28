const express = require('express');
const router = express.Router();
const {
  createBooking, getMyBookings, getBooking,
  cancelBooking, requestReplacement, getAllBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/admin/all', authorize('super_admin'), getAllBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);
router.post('/:id/replacement', requestReplacement);

module.exports = router;
