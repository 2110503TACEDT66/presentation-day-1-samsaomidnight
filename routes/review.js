const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { 
    addReview, 
    getReviewsForMassage, 
    updateReview, 
    deleteReview 
} = require('../controllers/review');

const router = express.Router({ mergeParams: true });

router.route('/').post(protect, authorize('admin','user'), addReview);
router.route('/:id').get(protect, getReviewsForMassage).put(protect, authorize('admin','user'), updateReview).delete(protect, authorize('admin','user'), deleteReview);


module.exports = router;
