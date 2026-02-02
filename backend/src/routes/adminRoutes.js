const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/adminMiddleware');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Promotion = require('../models/Promotion');

// Get all users (Admin only)
router.get('/users', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, role } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (role) filter.role = role;
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await User.countDocuments(filter);
    
    // Get user booking counts
    const usersWithBookings = await Promise.all(
      users.map(async (user) => {
        const bookingCount = await Booking.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          bookings: bookingCount
        };
      })
    );
    
    res.json({
      success: true,
      count: users.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
      data: usersWithBookings
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Get all payments/bookings for revenue (Admin only)
router.get('/payments', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    
    const bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .populate('car', 'name brand model')
      .populate('promotion', 'code')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Booking.countDocuments(filter);
    
    // Calculate total revenue
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    res.json({
      success: true,
      count: bookings.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
      totalRevenue: totalRevenue[0]?.total || 0,
      data: bookings
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message
    });
  }
});

// Get all promotions (Admin only)
router.get('/promotions', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { page = 1, limit = 20, active } = req.query;
    
    const filter = {};
    if (active === 'true') {
      filter.active = true;
      filter.validFrom = { $lte: new Date() };
      filter.validUntil = { $gte: new Date() };
    }
    
    const promotions = await Promotion.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Promotion.countDocuments(filter);
    
    res.json({
      success: true,
      count: promotions.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
      data: promotions
    });
  } catch (error) {
    console.error('Get promotions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching promotions',
      error: error.message
    });
  }
});

// Dashboard stats
router.get('/stats/dashboard', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'confirmed' });
    const totalPromotions = await Promotion.countDocuments({ active: true });
    
    const revenue = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalBookings,
        activeBookings,
        totalPromotions,
        totalRevenue: revenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
});

module.exports = router;
