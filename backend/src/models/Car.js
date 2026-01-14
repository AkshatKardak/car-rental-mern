const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: [true, 'Please add a brand']
    },
    model: {
        type: String,
        required: [true, 'Please add a model']
    },
    year: {
        type: Number,
        required: [true, 'Please add a year']
    },
    category: {
        type: String,
        required: [true, 'Please specify category'],
        enum: ['SUV', 'Sedan', 'Luxury', 'Electric', 'Convertible', 'Hatchback', 'Van', 'Truck']
    },
    pricePerDay: {
        type: Number,
        required: [true, 'Please add price per day']
    },
    images: {
        type: [String], // Array of URLs
        default: []
    },
    features: {
        type: [String],
        default: []
    },
    availability: {
        type: Boolean,
        default: true
    },
    mileage: {
        type: Number,
        default: 0
    },
    transmission: {
        type: String,
        enum: ['Automatic', 'Manual'],
        default: 'Automatic'
    },
    fuelType: {
        type: String,
        enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
        default: 'Petrol'
    }
}, { timestamps: true });

// Index for search
CarSchema.index({ brand: 'text', model: 'text', features: 'text' });

module.exports = mongoose.model('Car', CarSchema);
