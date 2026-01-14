const express = require('express');
const { signup, login, logout, getMe, refreshToken } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerRules, loginRules } = require('../utils/validators');

const router = express.Router();

router.post('/signup', registerRules, signup);
router.post('/login', loginRules, login);
router.get('/logout', logout); // or post
router.post('/logout', logout); // Support both
router.get('/me', protect, getMe);
// router.get('/refresh-token', protect, refreshToken); // Optional

module.exports = router;
