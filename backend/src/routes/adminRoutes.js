const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/admin/stats/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    // Replace with actual database queries
    const stats = {
      totalRevenue: 128450,
      revenueChange: '+12.4%',
      activeBookings: 45,
      bookingsChange: '+5.2%',
      fleetUtilization: 78,
      utilizationChange: '-2.1%',
      pendingRequests: 8
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
});

// @route   GET /api/admin/stats/recent-activity
// @desc    Get recent activity
// @access  Private/Admin
router.get('/stats/recent-activity', protect, authorize('admin'), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    // Replace with actual database query
    const bookings = [];

    res.status(200).json({
      success: true,
      data: { bookings }
    });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity',
      error: error.message
    });
  }
});

module.exports = router;
