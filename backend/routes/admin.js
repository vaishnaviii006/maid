const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, toggleUserStatus, getAllComplaints, resolveComplaint, getRevenueAnalytics } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('super_admin'));
router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.get('/complaints', getAllComplaints);
router.put('/complaints/:id/resolve', resolveComplaint);
router.get('/analytics/revenue', getRevenueAnalytics);

module.exports = router;
