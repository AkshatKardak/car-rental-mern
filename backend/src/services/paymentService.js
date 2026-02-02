const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create Razorpay Order
 * @param {Number} amount - Amount in rupees
 * @param {Object} additionalOptions - Additional order options
 * @returns {Object} Razorpay order object
 */
exports.createOrder = async (amount, additionalOptions = {}) => {
    try {
        const options = {
            amount: amount * 100, // amount in paise
            currency: additionalOptions.currency || 'INR',
            receipt: additionalOptions.receipt || `receipt_${Date.now()}`,
            notes: additionalOptions.notes || {}
        };

        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        throw error;
    }
};

/**
 * Verify Razorpay Payment Signature
 * @param {String} orderId - Razorpay order ID
 * @param {String} paymentId - Razorpay payment ID
 * @param {String} signature - Razorpay signature
 * @returns {Boolean} Whether signature is valid
 */
exports.verifySignature = (orderId, paymentId, signature) => {
    try {
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(orderId + '|' + paymentId)
            .digest('hex');

        return generatedSignature === signature;
    } catch (error) {
        console.error('Error verifying signature:', error);
        return false;
    }
};

/**
 * Get Razorpay instance (for additional operations)
 */
exports.getRazorpayInstance = () => {
    return razorpay;
};
