const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.error(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    // JsonWebTokenError
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token. Please log in again.';
        error = new ErrorResponse(message, 401);
    }

    // TokenExpiredError
    if (err.name === 'TokenExpiredError') {
        const message = 'Your token has expired. Please log in again.';
        error = new ErrorResponse(message, 401);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Export both default and the helper class if needed elsewhere, 
// usually we just use the handler and maybe export ErrorResponse separately 
// or put ErrorResponse in utils. For now, keep it simple.
// To make ErrorResponse available globally or importable, I can export it too.

module.exports = errorHandler;
// Also good to export ErrorResponse for use in controllers.
module.exports.ErrorResponse = ErrorResponse;
