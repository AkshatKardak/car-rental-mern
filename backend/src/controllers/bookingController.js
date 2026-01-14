const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Offer = require('../models/Offer');
const { ErrorResponse } = require('../middleware/errorHandler');
const calculatePrice = require('../utils/calculatePrice');
const { sendBookingConfirmation } = require('../services/emailService');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
    try {
        const { carId, startDate, endDate, offerCode } = req.body;

        const car = await Car.findById(carId);

        if (!car) {
            return next(new ErrorResponse('Car not found', 404));
        }

        // Basic Availability Check (Overlap)
        // Find if any booking for this car overlaps with requested dates
        // Assuming dates are valid Date objects or strings
        const existingBooking = await Booking.find({
            car: carId,
            status: { $in: ['confirmed', 'pending'] }, // Exclude cancelled/completed maybe? Depends on logic. Usually exclude pending if you block concurrency.
            // Check overlap
            $or: [
                { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
            ]
        });

        if (existingBooking.length > 0) {
            return next(new ErrorResponse('Car is not available for selected dates', 400));
        }

        // Calculate Price
        let { days, totalPrice } = calculatePrice(startDate, endDate, car.pricePerDay);

        // Apply Offer
        if (offerCode) {
            const offer = await Offer.findOne({ code: offerCode, isActive: true });
            if (offer && offer.isValid()) {
                if (offer.discountType === 'percentage') {
                    totalPrice = totalPrice - (totalPrice * (offer.discountValue / 100));
                } else if (offer.discountType === 'fixed') {
                    totalPrice = totalPrice - offer.discountValue;
                }
                // Increment usage
                offer.usedCount += 1;
                await offer.save();
            }
        }

        const booking = await Booking.create({
            user: req.user.id,
            car: carId,
            startDate,
            endDate,
            totalPrice
        });

        // Send email
        try {
            await sendBookingConfirmation(req.user, booking);
        } catch (err) {
            console.error('Email send failed', err);
        }

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate('car');

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('car').populate('user', 'name email');

        if (!booking) {
            return next(new ErrorResponse('Booking not found', 404));
        }

        // Verify owner or admin
        if (booking.user.id !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to view this booking', 401));
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return next(new ErrorResponse('Booking not found', 404));
        }

        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to cancel this booking', 401));
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res, next) => {
    try {
        const { status, paymentStatus } = req.body;

        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return next(new ErrorResponse('Booking not found', 404));
        }

        if (status) booking.status = status;
        if (paymentStatus) booking.paymentStatus = paymentStatus;

        await booking.save();

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (err) {
        next(err);
    }
};
