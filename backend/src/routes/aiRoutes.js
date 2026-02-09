const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
  chatWithAI, 
  getChatHistory,
  identifyCarFromImage 
} = require('../controllers/aiController');
const { getInsuranceAdvice } = require('../controllers/insuranceController');
const { protect } = require('../middleware/authMiddleware');

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/temp/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// All routes require authentication
router.use(protect);

// Chat endpoints
router.post('/chat', chatWithAI);
router.get('/history', getChatHistory);

// Insurance advisor
router.post('/insurance-advice', getInsuranceAdvice);

// Visual car recognition
router.post('/identify-car', upload.single('image'), identifyCarFromImage);

module.exports = router;
