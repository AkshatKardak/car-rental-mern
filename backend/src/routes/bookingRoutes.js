const express = require('express');
const {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    updateBookingStatus
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/adminMiddleware');
const { bookingRules } = require('../utils/validators');

const router = express.Router();

router.use(protect); // All booking routes require auth

router.post('/', bookingRules, createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

// Admin route
router.put('/:id/status', authorize('admin'), updateBookingStatus);

module.exports = router;
