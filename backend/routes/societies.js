const express = require('express');
const router = express.Router();
const {
  getSocieties, createSociety, getMySociety, updateSociety,
  approveWorker, blockWorker, getEntryLogs, getSocietyComplaints, getAllSocietiesAdmin
} = require('../controllers/societyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getSocieties);
router.post('/', protect, createSociety);
router.get('/admin/all', protect, authorize('super_admin'), getAllSocietiesAdmin);
router.get('/mine', protect, authorize('society_admin', 'super_admin'), getMySociety);
router.put('/mine', protect, authorize('society_admin'), updateSociety);
router.get('/mine/entry-logs', protect, authorize('society_admin'), getEntryLogs);
router.get('/mine/complaints', protect, authorize('society_admin'), getSocietyComplaints);
router.put('/workers/:workerId/approve', protect, authorize('society_admin'), approveWorker);
router.put('/workers/:workerId/block', protect, authorize('society_admin'), blockWorker);

module.exports = router;
