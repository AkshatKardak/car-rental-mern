const express = require('express');
const { createPayment, getPaymentHistory } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/process', createPayment);
router.get('/history', getPaymentHistory);

module.exports = router;
