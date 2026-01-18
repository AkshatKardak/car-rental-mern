const express = require('express');
const router = express.Router();
const {
  getAllPromotions,
  getPromotionById,
  validatePromotionCode,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getPromotionStats
} = require('../controllers/promotionController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getAllPromotions);
router.post('/validate', protect, validatePromotionCode);

// Protected admin routes
router.post('/', protect, admin, createPromotion);
router.get('/:id', protect, getPromotionById);
router.put('/:id', protect, admin, updatePromotion);
router.delete('/:id', protect, admin, deletePromotion);
router.get('/:id/stats', protect, admin, getPromotionStats);

module.exports = router;
