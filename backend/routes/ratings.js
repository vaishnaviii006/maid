const express = require('express');
const router = express.Router();
const { submitRating, getWorkerRatings, getMyRatings } = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', submitRating);
router.get('/my', getMyRatings);
router.get('/worker/:workerId', getWorkerRatings);

module.exports = router;
