const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile, updatePreferences } = require('../controllers/userController');

// GET /api/users/test
router.get('/test', (req, res) => {
    res.json({ success: true, message: 'User routes working!' });
});

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/preferences', protect, updatePreferences);

module.exports = router;
