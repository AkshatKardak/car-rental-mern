const Promotion = require('../models/Promotion');
const Booking = require('../models/Booking');

// Get all promotions
exports.getAllPromotions = async (req, res) => {
  try {
    const { active, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    const filter = {};
    if (active !== undefined) {
      filter.active = active === 'true';
    }
    
    const promotions = await Promotion.find(filter)
      .populate('applicableVehicles', 'name brand model')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 });
    
    res.json({
      success: true,
      count: promotions.length,
      data: promotions
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching promotions', 
      error: error.message 
    });
  }
};

// Get single promotion
exports.getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id)
      .populate('applicableVehicles', 'name brand model');
    
    if (!promotion) {
      return res.status(404).json({ 
        success: false,
        message: 'Promotion not found' 
      });
    }
    
    res.json({
      success: true,
      data: promotion
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching promotion', 
      error: error.message 
    });
  }
};

// Validate promotion code
exports.validatePromotionCode = async (req, res) => {
  try {
    const { code, vehicleId, bookingAmount } = req.body;
    
    const promotion = await Promotion.findOne({ 
      code: code.toUpperCase() 
    }).populate('applicableVehicles');
    
    if (!promotion) {
      return res.status(404).json({ 
        success: false,
        message: 'Invalid promotion code' 
      });
    }
    
    if (!promotion.isValid()) {
      return res.status(400).json({ 
        success: false,
        message: 'Promotion code has expired or is no longer valid' 
      });
    }
    
    if (vehicleId && !promotion.isApplicableToVehicle(vehicleId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Promotion code is not applicable to this vehicle' 
      });
    }
    
    if (bookingAmount < promotion.minBookingAmount) {
      return res.status(400).json({ 
        success: false,
        message: `Minimum booking amount of ₹${promotion.minBookingAmount} required` 
      });
    }
    
    const discount = promotion.calculateDiscount(bookingAmount);
    
    res.json({
      success: true,
      data: {
        promotion: {
          id: promotion._id,
          code: promotion.code,
          name: promotion.name,
          type: promotion.type,
          value: promotion.value
        },
        discount,
        finalAmount: bookingAmount - discount
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error validating promotion code', 
      error: error.message 
    });
  }
};

// Create promotion (Admin only)
exports.createPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Promotion created successfully',
      data: promotion
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Error creating promotion', 
      error: error.message 
    });
  }
};

// Update promotion (Admin only)
exports.updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!promotion) {
      return res.status(404).json({ 
        success: false,
        message: 'Promotion not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Promotion updated successfully',
      data: promotion
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Error updating promotion', 
      error: error.message 
    });
  }
};

// Delete promotion (Admin only)
exports.deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    
    if (!promotion) {
      return res.status(404).json({ 
        success: false,
        message: 'Promotion not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Promotion deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting promotion', 
      error: error.message 
    });
  }
};

// Get promotion usage statistics (Admin only)
exports.getPromotionStats = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    
    if (!promotion) {
      return res.status(404).json({ 
        success: false,
        message: 'Promotion not found' 
      });
    }
    
    // Get bookings that used this promotion
    const bookings = await Booking.find({ promotion: promotion._id })
      .populate('user', 'name email')
      .populate('car', 'name brand model')
      .select('totalPrice discount createdAt');
    
    const stats = {
      promotion: {
        code: promotion.code,
        name: promotion.name,
        usedCount: promotion.usedCount,
        usageLimit: promotion.usageLimit,
        remainingUses: promotion.usageLimit - promotion.usedCount
      },
      bookings: bookings.length,
      totalDiscountGiven: bookings.reduce((sum, b) => sum + (b.discount || 0), 0),
      totalRevenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
      recentUsage: bookings.slice(0, 10)
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching promotion statistics', 
      error: error.message 
    });
  }
};
