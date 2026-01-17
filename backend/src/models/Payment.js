const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        default: 'Razorpay'
    },
    orderId: { // Razorpay Order ID
        type: String,
        required: true
    },
    transactionId: { // Razorpay Payment ID
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
