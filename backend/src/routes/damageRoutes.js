const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getAllDamageReports,
  getDamageReportById,
  createDamageReport,
  updateDamageReport,
  deleteDamageReport,
  getCarDamageStats
} = require('../controllers/damageReportController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// All routes require authentication
router.use(protect);

router.get('/', getAllDamageReports);
router.post('/', upload.array('images', 5), createDamageReport);
router.get('/car/:carId/stats', getCarDamageStats);
router.get('/:id', getDamageReportById);
router.put('/:id', admin, updateDamageReport);
router.delete('/:id', admin, deleteDamageReport);

module.exports = router;
