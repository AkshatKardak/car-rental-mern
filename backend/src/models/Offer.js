const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    description: {
        type: String,
        required: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    validFrom: {
        type: Date,
        default: Date.now
    },
    validTo: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        default: 100
    },
    usedCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Check if offer is valid
OfferSchema.methods.isValid = function () {
    const now = new Date();
    return this.isActive && now >= this.validFrom && now <= this.validTo && this.usedCount < this.usageLimit;
};

module.exports = mongoose.model('Offer', OfferSchema);
