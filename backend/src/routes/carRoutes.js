const express = require('express');
const {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
} = require('../controllers/carController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/adminMiddleware');
const upload = require('../middleware/upload');
const { createCarRules } = require('../utils/validators');

const router = express.Router();

router.get('/', getAllCars);
router.get('/:id', getCarById);

// Admin routes
router.post('/', protect, authorize('admin'), upload.single('image'), createCarRules, createCar);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateCar);
router.delete('/:id', protect, authorize('admin'), deleteCar);

module.exports = router;
