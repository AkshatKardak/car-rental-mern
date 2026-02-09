const express = require('express');
const router = express.Router();

// GET /api/users/test
router.get('/test', (req, res) => {
    res.json({ success: true, message: 'User routes working!' });
});

// GET /api/users/profile
router.get('/profile', (req, res) => {
    res.json({ success: true, message: 'Profile endpoint' });
});

module.exports = router;
