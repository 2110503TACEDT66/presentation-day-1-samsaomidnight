const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res, next) => {
    const { amount } = req.body; // Amount is expected to be in the smallest unit (satang for THB)

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'thb', // Set currency to Thai Baht
            // Additional Stripe parameters as needed
        });

        // Further processing, such as saving the payment record
        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// Example webhook handler
exports.stripeWebhook = async (req, res, next) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook Signature Verification Failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        // Handle successful payment here
        console.log('PaymentIntent was successful!');
    }
    // Respond to Stripe to acknowledge receipt of the event
    res.json({ received: true });
};

