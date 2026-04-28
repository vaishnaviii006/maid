const express = require('express');
const router = express.Router();
const {
  getWorkers, getWorker, getMyWorkerProfile, updateWorkerProfile,
  getWorkerJobs, uploadKyc, updateWorkerStatus, getAllWorkersAdmin
} = require('../controllers/workerController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getWorkers);
router.get('/admin/all', protect, authorize('super_admin'), getAllWorkersAdmin);
router.get('/me', protect, authorize('worker'), getMyWorkerProfile);
router.put('/me', protect, authorize('worker'), updateWorkerProfile);
router.get('/me/jobs', protect, authorize('worker'), getWorkerJobs);
router.post('/me/kyc', protect, authorize('worker'), uploadKyc);
router.get('/:id', getWorker);
router.put('/:id/status', protect, authorize('super_admin'), updateWorkerStatus);

module.exports = router;
