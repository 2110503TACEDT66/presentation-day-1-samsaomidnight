// models/Review.js
const mongoose = require('mongoose');
const Massage = require('./Massage'); 

const ReviewSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please add a text for the review'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please add a rating between 1 and 5'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    massage: {
        type: mongoose.Schema.ObjectId,
        ref: 'Massage',
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
});

// Prevent user from submitting more than one review per massage
ReviewSchema.index({ massage: 1, user: 1 }, { unique: true });



// Middleware to calculate average rating after saving a review
ReviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.massage);
});

// Middleware to calculate average rating after removing a review
ReviewSchema.post('remove', async function () {
    await this.constructor.calculateAverageRating(this.massage);
});

// Static method to calculate and update the average rating of a massage
ReviewSchema.statics.calculateAverageRating = async function (massageId) {
    const aggregation = await this.aggregate([
        { $match: { massage: massageId } },
        { $group: {
            _id: '$massage',
            averageRating: { $avg: '$rating' },
        }},
    ]);

    let averageRating = 0;
    if (aggregation.length > 0) {
        averageRating = aggregation[0].averageRating;
    }

    await Massage.findByIdAndUpdate(massageId, { averageRating: averageRating });
};

module.exports = mongoose.model('Review', ReviewSchema);
