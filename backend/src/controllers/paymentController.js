const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { createOrder, verifySignature, createPaymentLink } = require('../services/paymentService');
const { ErrorResponse } = require('../middleware/errorHandler');

// @desc    Initiate payment (Create Order)
// @route   POST /api/payments/process
// @access  Private
exports.createPayment = async (req, res, next) => {
    try {
        const { bookingId } = req.body;

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

        // Create Razorpay Order
        const order = await createOrder(booking.totalPrice);

        // Create initial payment record
        const payment = await Payment.create({
            booking: bookingId,
            user: req.user.id,
            amount: booking.totalPrice,
            orderId: order.id,
            status: 'pending'
        });

        res.status(200).json({
            success: true,
            order
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Verify Payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
    try {
        const { orderId, paymentId, signature } = req.body;

        const isSignatureValid = verifySignature(orderId, paymentId, signature);

        if (isSignatureValid) {
            const payment = await Payment.findOne({ orderId });

            if (!payment) {
                return next(new ErrorResponse('Payment record not found', 404));
            }

            payment.transactionId = paymentId;
            payment.status = 'success';
            await payment.save();

            // Update Booking
            const booking = await Booking.findById(payment.booking);
            booking.paymentStatus = 'paid';
            booking.status = 'confirmed';
            await booking.save();

            res.status(200).json({
                success: true,
                message: 'Payment verified successfully'
            });
        } else {
            return next(new ErrorResponse('Invalid signature', 400));
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res, next) => {
    try {
        const payments = await Payment.find({ user: req.user.id }).populate('booking');

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create QR Payment Link
// @route   POST /api/payments/create-qr-payment
// @access  Private
exports.createQRPayment = async (req, res, next) => {
    try {
        const { amount, bookingId, currency = 'INR' } = req.body;

        // Get user details (since this route is protected)
        const customerName = req.user?.name || 'Customer';
        const customerEmail = req.user?.email || 'customer@rentride.com';
        
        // Use user's phone if available, otherwise use your personal number
        const customerContact = req.user?.phone || '+917208669121'; 

        // Create Razorpay Payment Link
        const paymentLink = await createPaymentLink(amount, {
            description: `RentRide - Booking Payment`,
            customerName: customerName,
            customerEmail: customerEmail,
            customerContact: customerContact,
            notes: {
                bookingId: bookingId,
                payment_type: 'qr_code',
                user_id: req.user?.id || 'guest'
            },
            callback_url: `${process.env.CLIENT_URL}/payment-success`
        });

        res.json({
            success: true,
            paymentLink: paymentLink,
            qrData: paymentLink.short_url,
            amount: amount,
            reference_id: paymentLink.reference_id,
            id: paymentLink.id
        });

    } catch (error) {
        console.error('Error creating QR payment:', error);
        next(new ErrorResponse('Failed to create payment QR code', 500));
    }
};
