const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create Razorpay Order
 */
exports.createOrder = async (amount, additionalOptions = {}) => {
    try {
        const options = {
            amount: amount * 100,
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
 * Create UPI QR Code (Test Mode Compatible)
 */
exports.createUPIQRCode = (amount, options = {}) => {
    try {
        // Test mode UPI ID
        const upiId = process.env.RAZORPAY_UPI_ID || 'rentride.test@paytm';
        
        const transactionRef = options.transactionRef || `TEST${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        
        // Create UPI URL
        const upiUrl = `upi://pay?pa=${upiId}&pn=RentRide&am=${amount}&cu=INR&tn=${encodeURIComponent(options.description || 'Car Rental Payment')}&tr=${transactionRef}`;
        
        console.log('✅ UPI QR Created:', {
            transactionRef,
            amount,
            upiId,
            testMode: true
        });
        
        return {
            id: transactionRef,
            upiUrl: upiUrl,
            upiId: upiId,
            amount: amount,
            description: options.description || 'Car Rental Payment',
            transactionRef: transactionRef,
            createdAt: new Date(),
            testMode: true
        };
    } catch (error) {
        console.error('❌ Error creating UPI QR:', error);
        throw error;
    }
};

/**
 * Verify UPI Payment (Test Mode - Auto Success)
 */
exports.verifyUPIPayment = async (transactionRef) => {
    try {
        console.log('🧪 Test Mode: Simulating payment verification for', transactionRef);
        
        // In test mode, always return success
        return { 
            success: true, 
            payment: {
                id: `pay_test_${Date.now()}`,
                amount: 100000,
                status: 'captured',
                method: 'upi',
                upi: {
                    vpa: 'test@paytm'
                },
                created_at: Math.floor(Date.now() / 1000)
            }
        };
    } catch (error) {
        console.error('❌ Error verifying UPI payment:', error);
        throw error;
    }
};

/**
 * Verify Razorpay Payment Signature
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
 * Get Razorpay instance
 */
exports.getRazorpayInstance = () => {
    return razorpay;
};
