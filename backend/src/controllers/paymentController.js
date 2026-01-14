const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { processPayment } = require('../services/paymentService');
const { ErrorResponse } = require('../middleware/errorHandler');

// @desc    Process payment
// @route   POST /api/payments/process
// @access  Private
exports.createPayment = async (req, res, next) => {
    try {
        const { bookingId, paymentMethodSource } = req.body;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return next(new ErrorResponse('Booking not found', 404));
        }

        if (booking.user.toString() !== req.user.id) {
            return next(new ErrorResponse('Not authorized', 401));
        }

        if (booking.paymentStatus === 'paid') {
            return next(new ErrorResponse('Booking already paid', 400));
        }

        // Process payment
        const paymentResult = await processPayment({
            amount: booking.totalPrice,
            source: paymentMethodSource,
            description: `Payment for booking ${bookingId}`
        });

        if (!paymentResult.success) {
            return next(new ErrorResponse(paymentResult.message, 400));
        }

        // Create transaction record
        const payment = await Payment.create({
            booking: bookingId,
            user: req.user.id,
            amount: booking.totalPrice,
            transactionId: paymentResult.transactionId,
            status: 'success'
        });

        // Update booking status
        booking.paymentStatus = 'paid';
        booking.status = 'confirmed'; // Auto confirm on payment?
        await booking.save();

        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res, next) => {
    try {
        let query = { user: req.user.id };
        if (req.user.role === 'admin') {
            query = {}; // Admin sees all? Or admin has separate route? API list implies this is general.
            // If admin wants all, maybe separate filters. Assuming 'history' is for logged in user mostly.
            // But if admin calls it, let's give all.
        }

        const payments = await Payment.find(query).populate('booking');

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Refund payment (Admin) (Placeholder)
// @route   POST /api/payments/refund
// @access  Private/Admin
// Not in API list but requested in requirements.
exports.refundPayment = async (req, res, next) => {
    res.status(501).json({ success: false, message: 'Not implemented' });
};
