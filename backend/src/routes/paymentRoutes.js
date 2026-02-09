const express = require('express');
const {
    createPayment,
    verifyPayment,
    getPaymentHistory,
    createDamagePayment,
    verifyDamagePayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Booking Payments
router.post('/process', createPayment);
router.post('/verify', verifyPayment);

// Damage Payments
router.post('/process-damage', createDamagePayment);
router.post('/verify-damage', verifyDamagePayment);

router.get('/history', getPaymentHistory);

module.exports = router;
