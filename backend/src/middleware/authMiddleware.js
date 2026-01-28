const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ErrorResponse } = require('./errorHandler');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // BYPASS: Handle dummy token for development
    if (token === 'dummy-token-12345') {
      console.log('✅ Dummy token accepted - Development mode');
      req.user = {
        _id: 'dummy-admin-id',
        name: 'Admin User',
        email: 'admin@rentride.com',
        role: 'admin'
      };
      return next();
    }

    // Verify real JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse('User not found', 404));
    }

    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Middleware to grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user?.role}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
