// routes/review.js
const express = require('express');
const { addReview } = require('../controllers/review');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.post('/', protect, addReview);

module.exports = router;
