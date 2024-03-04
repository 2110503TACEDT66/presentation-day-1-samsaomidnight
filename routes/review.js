const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { 
    addReview, 
    getReviewsForMassage, 
    getAllReviews,
    updateReview, 
    deleteReview 
} = require('../controllers/review');

const router = express.Router({ mergeParams: true });

// Route for adding a review to a specific massage
// Assuming massageId is passed in the route
// router.post('/:massageId/reviews',protect, authorize('admin','user'), addReview);
router.post('/:massageId',protect, addReview);
router.get('/:massageId',protect, getReviewsForMassage);

// New route for getting all reviews across all massages
router.get('/all', getAllReviews);



// Routes for specific review operations
router.route('/:id')
    .put(protect, authorize('admin','user'), updateReview)
    .delete(protect, authorize('admin','user'), deleteReview);

module.exports = router;
