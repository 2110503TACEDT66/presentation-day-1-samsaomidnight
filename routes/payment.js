const express = require('express');
const { createPaymentIntent, stripeWebhook } = require('../controllers/payment');
const { protect } = require('../middleware/auth'); // Assuming you have authentication middleware
const router = express.Router();

// Apply 'protect' middleware to ensure only authenticated users can create payment intents
router.post('/create-payment-intent', protect, createPaymentIntent);

// Stripe webhook endpoint might not require your application's user authentication
router.post('/webhook', express.raw({type: 'application/json'}), stripeWebhook);

module.exports = router;
