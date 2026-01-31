const express = require('express');
const { createPayment, verifyPayment, getPaymentHistory, createQRPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/process', createPayment);
router.post('/verify', verifyPayment);
router.get('/history', getPaymentHistory);
router.post('/create-qr-payment', createQRPayment);

module.exports = router;
