const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.processPayment = async ({ amount, currency = 'usd', source, description }) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects cents
            currency,
            payment_method: source, // or 'source' token depending on API version used by frontend
            description,
            confirm: true // Confirm immediately
        });

        return {
            success: true,
            message: 'Payment processed successfully',
            transactionId: paymentIntent.id,
            status: paymentIntent.status
        };
    } catch (error) {
        console.error('Stripe Error:', error);
        return {
            success: false,
            message: error.message,
            status: 'failed'
        };
    }
};

exports.createRefund = async (paymentIntentId) => {
    try {
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId
        });
        return refund;
    } catch (error) {
        throw new Error(error.message);
    }
};
