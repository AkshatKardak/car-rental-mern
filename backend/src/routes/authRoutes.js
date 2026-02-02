const express = require('express');
const {
    register,
    login,
    getMe,
    updateProfile,
    updatePassword,
    logout,
    deleteAccount,
    firebaseRegister,
    firebaseLogin,
    firebaseGoogleLogin,
    verifyFirebaseToken
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Traditional auth routes
router.post('/register', register);
router.post('/login', login);

// Firebase auth routes
router.post('/firebase-register', firebaseRegister);
router.post('/firebase-login', firebaseLogin);
router.post('/firebase-google', firebaseGoogleLogin);
router.post('/verify-firebase-token', verifyFirebaseToken);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/update-password', protect, updatePassword);
router.post('/logout', protect, logout);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;
