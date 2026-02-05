const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/adminMiddleware');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Promotion = require('../models/Promotion');
const Car = require('../models/Car');

// ========================================
// USER MANAGEMENT ROUTES
// ========================================

// Get all users (Admin only)
router.get('/users', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, role, search } = req.query;
    
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (role && role !== 'all') filter.role = role;
    
    // Search by name or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
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
      currentPage: parseInt(page),
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

// Update user status (Admin only)
router.patch('/users/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Also delete user's bookings
    await Booking.deleteMany({ user: req.params.id });
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

// ========================================
// PAYMENT/BOOKING MANAGEMENT ROUTES
// ========================================

// Get all payments/bookings (Admin only)
router.get('/payments', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    
    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('car', 'name brand model pricePerDay')
      .populate('promotion', 'code name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Booking.countDocuments(filter);
    
    // Calculate total revenue (only confirmed bookings)
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    res.json({
      success: true,
      count: bookings.length,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
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

// Update booking status (Admin only)
router.patch('/payments/:id/status', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email').populate('car', 'name brand model');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
});

// ========================================
// PROMOTION MANAGEMENT ROUTES
// ========================================

// Get all promotions (Admin only)
router.get('/promotions', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { page = 1, limit = 20, active, search } = req.query;
    
    const filter = {};
    
    if (active === 'true') {
      filter.active = true;
      filter.validFrom = { $lte: new Date() };
      filter.validUntil = { $gte: new Date() };
    } else if (active === 'false') {
      filter.$or = [
        { active: false },
        { validUntil: { $lt: new Date() } }
      ];
    }
    
    // Search by code or name
    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
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
      currentPage: parseInt(page),
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

// Create promotion (Admin only)
router.post('/promotions', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const promotion = await Promotion.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Promotion created successfully',
      data: promotion
    });
  } catch (error) {
    console.error('Create promotion error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating promotion',
      error: error.message
    });
  }
});

// Update promotion (Admin only)
router.put('/promotions/:id', protect, authorize('admin', 'manager'), async (req, res) => {
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
    console.error('Update promotion error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating promotion',
      error: error.message
    });
  }
});

// Delete promotion (Admin only)
router.delete('/promotions/:id', protect, authorize('admin'), async (req, res) => {
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
    console.error('Delete promotion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting promotion',
      error: error.message
    });
  }
});

// Toggle promotion status (Admin only)
router.patch('/promotions/:id/toggle', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }
    
    promotion.active = !promotion.active;
    await promotion.save();
    
    res.json({
      success: true,
      message: `Promotion ${promotion.active ? 'activated' : 'deactivated'} successfully`,
      data: promotion
    });
  } catch (error) {
    console.error('Toggle promotion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling promotion status',
      error: error.message
    });
  }
});

// ========================================
// DASHBOARD STATS ROUTES
// ========================================

// Get dashboard statistics (Admin only)
router.get('/stats/dashboard', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const totalCars = await Car.countDocuments();
    const availableCars = await Car.countDocuments({ available: true });
    const totalPromotions = await Promotion.countDocuments({ active: true });
    
    // Calculate revenue
    const revenue = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    // Calculate this month's revenue
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyRevenue = await Booking.aggregate([
      { 
        $match: { 
          status: 'confirmed',
          createdAt: { $gte: startOfMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalBookings,
        activeBookings,
        pendingBookings,
        totalCars,
        availableCars,
        totalPromotions,
        totalRevenue: revenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0
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

// Get recent activity (Admin only)
router.get('/stats/recent-activity', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('car', 'name brand model')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json({
      success: true,
      data: {
        bookings: recentBookings,
        users: recentUsers
      }
    });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activity',
      error: error.message
    });
  }
});

// Get revenue analytics (Admin only)
router.get('/stats/revenue-analytics', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let groupBy;
    let dateRange = new Date();
    
    switch (period) {
      case 'week':
        dateRange.setDate(dateRange.getDate() - 7);
        groupBy = { $dayOfMonth: '$createdAt' };
        break;
      case 'month':
        dateRange.setMonth(dateRange.getMonth() - 1);
        groupBy = { $dayOfMonth: '$createdAt' };
        break;
      case 'year':
        dateRange.setFullYear(dateRange.getFullYear() - 1);
        groupBy = { $month: '$createdAt' };
        break;
      default:
        dateRange.setMonth(dateRange.getMonth() - 1);
        groupBy = { $dayOfMonth: '$createdAt' };
    }
    
    const revenueData = await Booking.aggregate([
      {
        $match: {
          status: 'confirmed',
          createdAt: { $gte: dateRange }
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: revenueData
    });
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue analytics',
      error: error.message
    });
  }
});

module.exports = router;
