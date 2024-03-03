const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { 
    addReview, 
    getReviewsForMassage, 
    updateReview, 
    deleteReview 
} = require('../controllers/review');

const router = express.Router({ mergeParams: true });

// Route to get all reviews for a specific massage
router.get('/', getReviewsForMassage);

// Routes for adding, updating, and deleting reviews, protected by authentication
router.post('/', protect, addReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
