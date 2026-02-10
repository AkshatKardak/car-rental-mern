const Offer = require('../models/Offer');
const { ErrorResponse } = require('../middleware/errorHandler');

// @desc    Get all active offers
// @route   GET /api/offers
// @access  Public
exports.getAllOffers = async (req, res, next) => {
  try {
    const currentDate = new Date();
    
    const offers = await Offer.find({
      isActive: true,
      validFrom: { $lte: currentDate },
      validTo: { $gte: currentDate }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate offer code
// @route   POST /api/offers/validate
// @access  Private
exports.validateOffer = async (req, res, next) => {
  try {
    const { code, bookingAmount } = req.body;

    if (!code || !bookingAmount) {
      return next(new ErrorResponse('Please provide offer code and booking amount', 400));
    }

    const offer = await Offer.findOne({ code: code.toUpperCase() });

    if (!offer) {
      return next(new ErrorResponse('Invalid offer code', 404));
    }

    // Check if offer is active
    if (!offer.isActive) {
      return next(new ErrorResponse('This offer is no longer active', 400));
    }

    const currentDate = new Date();

    // Check if offer is within valid date range
    if (currentDate < offer.validFrom || currentDate > offer.validTo) {
      return next(new ErrorResponse('This offer has expired or is not yet valid', 400));
    }

    // Check minimum booking amount
    if (bookingAmount < offer.minBookingAmount) {
      return next(new ErrorResponse(
        `Minimum booking amount of ₹${offer.minBookingAmount} required for this offer`,
        400
      ));
    }

    // Check usage limit
    if (offer.usageLimit && offer.usedCount >= offer.usageLimit) {
      return next(new ErrorResponse('This offer has reached its usage limit', 400));
    }

    // Calculate discount
    let discountAmount = 0;
    
    if (offer.discountType === 'percentage') {
      discountAmount = (bookingAmount * offer.discountValue) / 100;
      
      // Apply max discount cap if exists
      if (offer.maxDiscount && discountAmount > offer.maxDiscount) {
        discountAmount = offer.maxDiscount;
      }
    } else if (offer.discountType === 'fixed') {
      discountAmount = offer.discountValue;
    }

    const finalAmount = bookingAmount - discountAmount;

    res.status(200).json({
      success: true,
      data: {
        offer: {
          code: offer.code,
          title: offer.title,
          description: offer.description,
          discountType: offer.discountType,
          discountValue: offer.discountValue
        },
        originalAmount: bookingAmount,
        discountAmount,
        finalAmount
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private/Admin
exports.createOffer = async (req, res, next) => {
  try {
    // Convert code to uppercase
    if (req.body.code) {
      req.body.code = req.body.code.toUpperCase();
    }

    // Check if offer code already exists
    const existingOffer = await Offer.findOne({ code: req.body.code });
    
    if (existingOffer) {
      return next(new ErrorResponse('Offer code already exists', 400));
    }

    const offer = await Offer.create(req.body);

    res.status(201).json({
      success: true,
      data: offer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
exports.updateOffer = async (req, res, next) => {
  try {
    let offer = await Offer.findById(req.params.id);

    if (!offer) {
      return next(new ErrorResponse('Offer not found', 404));
    }

    // Convert code to uppercase if provided
    if (req.body.code) {
      req.body.code = req.body.code.toUpperCase();
      
      // Check if new code already exists (excluding current offer)
      const existingOffer = await Offer.findOne({
        code: req.body.code,
        _id: { $ne: req.params.id }
      });
      
      if (existingOffer) {
        return next(new ErrorResponse('Offer code already exists', 400));
      }
    }

    offer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: offer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
exports.deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return next(new ErrorResponse('Offer not found', 404));
    }

    await offer.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};