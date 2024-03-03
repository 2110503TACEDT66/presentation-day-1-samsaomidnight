const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    paymentIntentId: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'thb', // Default currency set to Thai Baht
    },
    status: {
        type: String,
        required: true,
        enum: ['succeeded', 'pending', 'failed'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Payment', PaymentSchema);
