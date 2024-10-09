const express = require('express');
const { addOrUpdateReview, deleteReview, getAllReviews } = require('../Controllers/ReviewController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:isbn', authMiddleware, addOrUpdateReview);
router.delete('/:isbn', authMiddleware, deleteReview);
router.get('/', getAllReviews);

module.exports = router;
