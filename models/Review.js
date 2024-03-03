// models/Review.js
const mongoose = require('mongoose');

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

module.exports = mongoose.model('Review', ReviewSchema);
