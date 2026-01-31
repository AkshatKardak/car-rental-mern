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
 * Create Razorpay Payment Link (for QR Code)
 * @param {Number} amount - Amount in rupees
 * @param {Object} options - Payment link options
 * @returns {Object} Payment link object
 */
exports.createPaymentLink = async (amount, options = {}) => {
    try {
        // Validate phone number - ensure it doesn't have repeating digits
        let validContact = options.customerContact;
        if (!validContact || validContact === '+919999999999') {
            validContact = '+919876543210'; // Valid dummy number with no repeating digits
        }

        const paymentLinkOptions = {
            amount: amount * 100, // amount in paise
            currency: 'INR',
            accept_partial: false,
            description: options.description || 'Car Rental Booking Payment',
            customer: {
                name: options.customerName || 'Customer',
                email: options.customerEmail || 'customer@rentride.com',
                contact: validContact
            },
            notify: {
                sms: false,  // Don't send SMS
                email: false // Don't send email
            },
            reminder_enable: false,
            notes: options.notes || {},
            callback_url: options.callback_url || process.env.CLIENT_URL,
            callback_method: 'get'
        };

        const paymentLink = await razorpay.paymentLink.create(paymentLinkOptions);
        return paymentLink;
    } catch (error) {
        console.error('Error creating Razorpay payment link:', error);
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
