const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Promotion = require('../models/Promotion');

// Create booking with promotion
exports.createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate, promotionCode } = req.body;
    
    // Get car details
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    // Check car availability
    if (!car.available) {
      return res.status(400).json({
        success: false,
        message: 'Car is not available'
      });
    }
    
    // Calculate base price
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    let totalPrice = car.pricePerDay * days;
    
    // Apply promotion if provided
    let promotion = null;
    let discount = 0;
    
    if (promotionCode) {
      promotion = await Promotion.findOne({ 
        code: promotionCode.toUpperCase() 
      });
      
      if (promotion && promotion.isValid() && promotion.isApplicableToVehicle(carId)) {
        if (totalPrice >= promotion.minBookingAmount) {
          discount = promotion.calculateDiscount(totalPrice);
          totalPrice = totalPrice - discount;
          
          // Increment usage count
          promotion.usedCount += 1;
          await promotion.save();
        }
      }
    }
    
    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      car: carId,
      startDate,
      endDate,
      promotion: promotion ? promotion._id : null,
      promotionCode: promotionCode || null,
      discount,
      totalPrice
    });
    
    // Populate car details
    await booking.populate('car', 'name brand model pricePerDay');
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Get all bookings (Admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) {
      filter.status = status;
    }
    
    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('car', 'name brand model')
      .populate('promotion', 'code name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Booking.countDocuments(filter);
    
    res.json({
      success: true,
      count: bookings.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Get single booking
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('car', 'name brand model pricePerDay')
      .populate('promotion', 'code name type value');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// Get user's own bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('car', 'name brand model pricePerDay image')
      .populate('promotion', 'code name')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your bookings',
      error: error.message
    });
  }
};

// Update booking (Admin only)
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('car', 'name brand model');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
};

// Delete booking (Admin only)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message
    });
  }
};
