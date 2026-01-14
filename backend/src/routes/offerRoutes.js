const express = require('express');
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

const router = express.Router();

router.get('/', getAllOffers);
router.post('/validate', protect, validateOffer);

// Admin routes
router.post('/', protect, authorize('admin'), offerRules, createOffer);
router.put('/:id', protect, authorize('admin'), updateOffer);
router.delete('/:id', protect, authorize('admin'), deleteOffer);

module.exports = router;
