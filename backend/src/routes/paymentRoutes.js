const express = require('express');
const { createPayment, verifyPayment, getPaymentHistory } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/process', createPayment);
router.post('/verify', verifyPayment); // verification endpoint
router.get('/history', getPaymentHistory);

module.exports = router;
