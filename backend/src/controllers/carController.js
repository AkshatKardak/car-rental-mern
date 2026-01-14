const Car = require('../models/Car');
const { ErrorResponse } = require('../middleware/errorHandler');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Helper for stream upload
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'rentride/cars' },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

// @desc    Get all cars with filters (search merged here)
// @route   GET /api/cars
// @access  Public
exports.getAllCars = async (req, res, next) => {
    try {
        const { category, minPrice, maxPrice, brand, model, availability } = req.query;

        let query = {};

        if (category) query.category = category;
        if (brand) query.brand = { $regex: brand, $options: 'i' };
        if (model) query.model = { $regex: model, $options: 'i' };

        if (minPrice || maxPrice) {
            query.pricePerDay = {};
            if (minPrice) query.pricePerDay.$gte = minPrice;
            if (maxPrice) query.pricePerDay.$lte = maxPrice;
        }

        if (availability) query.availability = availability === 'true';

        // Check for text search if generic 'search' param is provided
        if (req.query.search) {
            // If we want to use the text index
            query.$text = { $search: req.query.search };
        }

        const cars = await Car.find(query);

        res.status(200).json({
            success: true,
            count: cars.length,
            data: cars
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
exports.getCarById = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return next(new ErrorResponse('Car not found', 404));
        }

        res.status(200).json({
            success: true,
            data: car
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new car
// @route   POST /api/cars
// @access  Private/Admin
exports.createCar = async (req, res, next) => {
    try {
        let carData = { ...req.body };

        // Handle image upload if file present
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            carData.images = [result.secure_url]; // For now single image upload from basic implementation, can be extended
        }

        // Handle features array if sent as string
        if (typeof carData.features === 'string') {
            carData.features = carData.features.split(',').map(f => f.trim());
        }

        const car = await Car.create(carData);

        res.status(201).json({
            success: true,
            data: car
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private/Admin
exports.updateCar = async (req, res, next) => {
    try {
        let car = await Car.findById(req.params.id);

        if (!car) {
            return next(new ErrorResponse('Car not found', 404));
        }

        let updateData = { ...req.body };

        // Handle image upload if file present
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            // Maybe append or replace? Let's push to array
            car.images.push(result.secure_url);
            updateData.images = car.images;
        }

        car = await Car.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: car
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
exports.deleteCar = async (req, res, next) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);

        if (!car) {
            return next(new ErrorResponse('Car not found', 404));
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
