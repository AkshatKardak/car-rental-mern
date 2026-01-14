const User = require('../models/User');
const { ErrorResponse } = require('../middleware/errorHandler');
const generateToken = require('../utils/generateToken'); // or use User method

// Helper to send token response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    // We can use the util or the model method. 
    // To be consistent with User model having generateAuthToken, let's use that.
    const token = user.generateAuthToken();

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body; // role not allowed to be set purely here usually, default user

        const user = await User.create({
            name,
            email,
            password,
            phone
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return next(new ErrorResponse('Please provide an email and password', 400));
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Refresh Token (Simple Implementation)
// @route   GET /api/auth/refresh-token
// @access  Public (or Private with expired token?)
// For simplicity, just issues a new token if a valid check is done, or re-logins.
// But mostly just `getMe` ensures token works. 
// A real refresh token flow requires a separate RefreshToken model or long-lived cookie.
// I will implement a placeholder or simple logic where you can hit it with a valid cookie to extend it.
exports.refreshToken = async (req, res, next) => {
    // This usually requires a separate long-term token not the access token. 
    // If not implemented, just return not impl or simple renewal if auth middleware allowed it.
    // If auth middleware blocked it, we can't refresh.
    // Let's assume client handles it by re-login or this just sends a new token for active user.
    if (req.user) {
        sendTokenResponse(req.user, 200, res);
    } else {
        next(new ErrorResponse('Not authorized', 401));
    }
};
