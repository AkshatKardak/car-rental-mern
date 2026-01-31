const express = require('express');
const router = express.Router();
const {
    getAllOffers,
    validateOffer,
    createOffer,
    updateOffer,
    deleteOffer
} = require('../controllers/offerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/adminMiddleware');
const { offerRules } = require('../utils/validators');

// Public route
router.get('/', getAllOffers);

// Protected route
router.post('/validate', protect, validateOffer);

// Admin routes (spread the array with ...)
router.post('/', protect, authorize('admin'), ...offerRules, createOffer);
router.put('/:id', protect, authorize('admin'), updateOffer);
router.delete('/:id', protect, authorize('admin'), deleteOffer);

module.exports = router;
