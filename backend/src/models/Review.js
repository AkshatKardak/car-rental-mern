const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    booking: { // Optional, but good for verified reviews
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment']
    }
}, { timestamps: true });

// Prevent user from submitting multiple reviews per car (optional, depends on policy)
// ReviewSchema.index({ car: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
