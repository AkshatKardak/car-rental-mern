const Offer = require('../models/Offer');
const { ErrorResponse } = require('../middleware/errorHandler');

// @desc    Get all offers
// @route   GET /api/offers
// @access  Public (or Private? Assume Public for displaying coupons)
exports.getAllOffers = async (req, res, next) => {
    try {
        const offers = await Offer.find({ isActive: true });
        res.status(200).json({
            success: true,
            data: offers
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Validate offer
// @route   POST /api/offers/validate
// @access  Private
exports.validateOffer = async (req, res, next) => {
    try {
        const { code } = req.body;

        const offer = await Offer.findOne({ code, isActive: true });

        if (!offer) {
            return next(new ErrorResponse('Invalid offer code', 404));
        }

        if (!offer.isValid()) {
            return next(new ErrorResponse('Offer expired or limit reached', 400));
        }

        res.status(200).json({
            success: true,
            data: offer
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create offer
// @route   POST /api/offers
// @access  Private/Admin
exports.createOffer = async (req, res, next) => {
    try {
        const offer = await Offer.create(req.body);
        res.status(201).json({
            success: true,
            data: offer
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
exports.updateOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!offer) {
            return next(new ErrorResponse('Offer not found', 404));
        }

        res.status(200).json({
            success: true,
            data: offer
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
exports.deleteOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);

        if (!offer) {
            return next(new ErrorResponse('Offer not found', 404));
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
