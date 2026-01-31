const DamageReport = require('../models/DamageReport');
const Booking = require('../models/Booking');
const { ErrorResponse } = require('../middleware/errorHandler');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Analyze damage with AI (Gemini Vision)
// @route   POST /api/damages/analyze-ai
// @access  Private
exports.analyzeDamageWithAI = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new ErrorResponse('Please upload at least one image', 400));
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Convert first image to base64
    const imageBuffer = req.files[0].buffer;
    const base64Image = imageBuffer.toString('base64');

    const prompt = `Analyze this vehicle damage image and provide:
1. Type of damage (e.g., scratch, dent, broken part, etc.)
2. Severity (Minor, Moderate, Severe)
3. Estimated repair cost in INR (Indian Rupees)
4. Brief description of the damage

Respond in JSON format with keys: damageType, severity, estimatedCost, description`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: req.files[0].mimetype
        }
      }
    ]);

    const response = result.response.text();
    
    // Parse AI response (remove markdown code blocks if present)
    let analysis = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    analysis = JSON.parse(analysis);

    res.status(200).json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('AI Analysis error:', error);
    next(new ErrorResponse('Failed to analyze damage with AI', 500));
  }
};

// @desc    Get all damage reports
// @route   GET /api/damages
// @access  Private
exports.getAllDamageReports = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };

    const damageReports = await DamageReport.find(query)
      .populate('booking')
      .populate('user', 'name email')
      .populate('car', 'name brand model')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: damageReports.length,
      data: damageReports
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get damage report by ID
// @route   GET /api/damages/:id
// @access  Private
exports.getDamageReportById = async (req, res, next) => {
  try {
    const damageReport = await DamageReport.findById(req.params.id)
      .populate('booking')
      .populate('user', 'name email')
      .populate('car', 'name brand model');

    if (!damageReport) {
      return next(new ErrorResponse('Damage report not found', 404));
    }

    // Check if user owns this report or is admin
    if (damageReport.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized', 401));
    }

    res.status(200).json({
      success: true,
      data: damageReport
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create damage report
// @route   POST /api/damages
// @access  Private
exports.createDamageReport = async (req, res, next) => {
  try {
    const { bookingId, description, aiAnalysis } = req.body;

    // Verify booking exists and user owns it
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return next(new ErrorResponse('Booking not found', 404));
    }

    if (booking.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized', 401));
    }

    // Upload images to ImageBB or your storage
    const imageUrls = [];
    
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const formData = new FormData();
          formData.append('image', file.buffer.toString('base64'));

          const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' }
            }
          );

          if (response.data.success) {
            imageUrls.push(response.data.data.url);
          }
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
        }
      }
    }

    const damageReportData = {
      booking: bookingId,
      user: req.user.id,
      car: booking.car,
      description,
      images: imageUrls,
      status: 'pending'
    };

    // Add AI analysis if provided
    if (aiAnalysis) {
      const analysis = typeof aiAnalysis === 'string' ? JSON.parse(aiAnalysis) : aiAnalysis;
      damageReportData.aiAnalysis = analysis;
      damageReportData.estimatedCost = analysis.estimatedCost || 0;
    }

    const damageReport = await DamageReport.create(damageReportData);

    res.status(201).json({
      success: true,
      data: damageReport
    });

  } catch (error) {
    console.error('Create damage report error:', error);
    next(error);
  }
};

// @desc    Update damage report (Admin only)
// @route   PUT /api/damages/:id
// @access  Private/Admin
exports.updateDamageReport = async (req, res, next) => {
  try {
    let damageReport = await DamageReport.findById(req.params.id);

    if (!damageReport) {
      return next(new ErrorResponse('Damage report not found', 404));
    }

    damageReport = await DamageReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: damageReport
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete damage report
// @route   DELETE /api/damages/:id
// @access  Private/Admin
exports.deleteDamageReport = async (req, res, next) => {
  try {
    const damageReport = await DamageReport.findById(req.params.id);

    if (!damageReport) {
      return next(new ErrorResponse('Damage report not found', 404));
    }

    await damageReport.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get damage stats for a car
// @route   GET /api/damages/car/:carId/stats
// @access  Private
exports.getCarDamageStats = async (req, res, next) => {
  try {
    const stats = await DamageReport.aggregate([
      { $match: { car: req.params.carId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalCost: { $sum: '$estimatedCost' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
