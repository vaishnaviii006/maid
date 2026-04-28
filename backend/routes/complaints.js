const express = require('express');
const router = express.Router();
const { createComplaint, getMyComplaints, updateComplaint } = require('../controllers/complaintController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', createComplaint);
router.get('/my', getMyComplaints);
router.put('/:id', updateComplaint);

module.exports = router;
