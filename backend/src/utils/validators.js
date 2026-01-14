const { check, validationResult } = require('express-validator');
const { ErrorResponse } = require('../middleware/errorHandler');

// Middleware to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const message = errors.array().map(err => err.msg).join(', ');
        return res.status(400).json({ success: false, error: message });
    }
    next();
};

// Validation rules
exports.registerRules = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    validate
];

exports.loginRules = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    validate
];

exports.createCarRules = [
    check('brand', 'Brand is required').not().isEmpty(),
    check('model', 'Model is required').not().isEmpty(),
    check('pricePerDay', 'Price per day is required').isNumeric(),
    validate
];

exports.bookingRules = [
    check('carId', 'Car ID is required').not().isEmpty(),
    check('startDate', 'Start date is required').isISO8601().toDate(),
    check('endDate', 'End date is required').isISO8601().toDate(),
    validate
];

exports.offerRules = [
    check('code', 'Code is required').not().isEmpty(),
    check('discountValue', 'Discount value must be a number').isNumeric(),
    check('validTo', 'Expiration date is required').isISO8601().toDate(),
    validate
];
