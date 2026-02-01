const express = require('express');
const { 
    createPayment, 
    verifyPayment, 
    getPaymentHistory, 
    createQRPayment,
    confirmUPIPayment,
    checkUPIStatus
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes (require login)
router.post('/process', protect, createPayment);
router.post('/verify', protect, verifyPayment);
router.get('/history', protect, getPaymentHistory);

// Public UPI QR routes (no login required)
router.post('/create-qr-payment', createQRPayment);
router.post('/confirm-upi', confirmUPIPayment);
router.get('/check-upi/:transactionRef', checkUPIStatus);

module.exports = router;
