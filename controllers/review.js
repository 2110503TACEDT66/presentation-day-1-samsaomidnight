// controllers/review.js
const Review = require('../models/Review');
const Massage = require('../models/Massage');

// @desc      Add a review
// @route     POST /api/v1/massages/:massageId/reviews
// @access    Private
exports.addReview = async (req, res, next) => {
    try {
        req.body.massage = req.params.massageId;
        req.body.user = req.user.id;

        const massage = await Massage.findById(req.params.massageId);
        if (!massage) {
            return res.status(404).json({ success: false, message: "Massage not found" });
        }

        const review = await Review.create(req.body);

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// GET /api/v1/reviews
exports.getAllReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find().populate({
            path: 'massage',
            select: 'name description' 
        }).populate({
            path: 'user',
            select: 'name'
        });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


// GET /api/v1/massages/:massageId/reviews
exports.getReviewsForMassage = async (req, res, next) => {
    try {
        const reviews = await Review.find({ massage: req.params.massageId }).populate({
            path: 'user',
            select: 'name'
        });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// PUT /api/v1/reviews/:id
exports.updateReview = async (req, res, next) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        // Ensure the review belongs to the user or the user is an admin
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Not authorized to update this review" });
        }

        review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// DELETE /api/v1/reviews/:id
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        // Ensure the review belongs to the user or the user is an admin
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Not authorized to delete this review" });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
            message: "Review deleted successfully",
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
