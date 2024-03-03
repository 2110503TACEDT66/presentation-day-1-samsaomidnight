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
