const multer = require('multer');
const path = require('path');
const { ErrorResponse } = require('./errorHandler');

// Multer config
// specific how to store files.
// For now, let's use diskStorage to a temp folder, or memoryStorage.
// MemoryStorage is good for immediate upload to Cloudinary.

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Only accept images
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new ErrorResponse('Please upload an image file', 400), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    },
    fileFilter: fileFilter
});

module.exports = upload;
