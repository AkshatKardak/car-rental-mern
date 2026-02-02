const express = require('express');
const { 
    createPayment, 
    verifyPayment, 
    getPaymentHistory
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/process', createPayment);
router.post('/verify', verifyPayment);
router.get('/history', getPaymentHistory);

module.exports = router;
