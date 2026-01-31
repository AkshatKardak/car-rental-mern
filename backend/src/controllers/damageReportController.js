const DamageReport = require('../models/DamageReport');
const Booking = require('../models/Booking');
const { ErrorResponse } = require('../middleware/errorHandler');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Analyze damage with AI (Using Cloudinary + HuggingFace)
// @route   POST /api/damages/analyze-ai
// @access  Private
exports.analyzeDamageWithAI = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new ErrorResponse('Please upload at least one image', 400));
    }

    const imageBuffer = req.files[0].buffer;

    // Method 1: Upload to Cloudinary and get AI tags
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'damage-analysis',
            categorization: 'google_tagging',
            detection: 'captioning',
            auto_tagging: 0.6
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(imageBuffer);
      });

      // Get AI-generated tags from Cloudinary
      const tags = uploadResult.tags || [];
      const moderation = uploadResult.moderation || [];
      
      // Analyze using HuggingFace for better description
      let detailedDescription = '';
      try {
        const hfResponse = await axios.post(
          'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large',
          imageBuffer,
          {
            headers: {
              'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
              'Content-Type': 'application/octet-stream'
            },
            timeout: 10000
          }
        );
        detailedDescription = hfResponse.data[0]?.generated_text || '';
      } catch (hfError) {
        console.log('HuggingFace failed, using Cloudinary tags only');
        detailedDescription = tags.join(', ');
      }

      // Combine all analysis
      const combinedDescription = (detailedDescription + ' ' + tags.join(' ')).toLowerCase();
      const analysis = analyzeDamageFromDescription(combinedDescription);

      // Add image URL to response
      analysis.imageUrl = uploadResult.secure_url;

      return res.status(200).json({
        success: true,
        data: analysis
      });

    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed:', cloudinaryError);
      
      // Fallback to HuggingFace only
      try {
        const hfResponse = await axios.post(
          'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large',
          imageBuffer,
          {
            headers: {
              'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
              'Content-Type': 'application/octet-stream'
            }
          }
        );

        const description = hfResponse.data[0].generated_text.toLowerCase();
        const analysis = analyzeDamageFromDescription(description);

        return res.status(200).json({
          success: true,
          data: analysis
        });

      } catch (hfError) {
        console.error('Both services failed');
      }
    }

    // Final fallback
    res.status(200).json({
      success: true,
      data: {
        damageType: "Vehicle damage reported",
        severity: "Pending review",
        estimatedCost: 5000,
        description: "Damage report submitted. Our team will assess and contact you shortly."
      }
    });

  } catch (error) {
    console.error('AI Analysis error:', error);
    next(new ErrorResponse('Failed to analyze damage', 500));
  }
};

// Helper function to analyze damage from description
function analyzeDamageFromDescription(description) {
  let damageType = "Vehicle damage";
  let severity = "Moderate";
  let estimatedCost = 5000;
  let repairDetails = [];

  // Enhanced damage detection keywords
  const damageKeywords = {
    // Minor damages
    scratch: { type: "Scratch/Scuff", severity: "Minor", cost: 2000, repair: "Paint touch-up and polishing" },
    scuff: { type: "Scuff marks", severity: "Minor", cost: 1500, repair: "Surface buffing" },
    paint: { type: "Paint damage", severity: "Minor", cost: 3000, repair: "Repainting required" },
    chip: { type: "Paint chip", severity: "Minor", cost: 1500, repair: "Spot repair" },
    
    // Moderate damages
    dent: { type: "Dent", severity: "Moderate", cost: 5000, repair: "Paintless dent removal or panel beating" },
    bumper: { type: "Bumper damage", severity: "Moderate", cost: 8000, repair: "Bumper repair/replacement" },
    fender: { type: "Fender damage", severity: "Moderate", cost: 7000, repair: "Fender repair" },
    door: { type: "Door damage", severity: "Moderate", cost: 10000, repair: "Door panel repair" },
    hood: { type: "Hood damage", severity: "Moderate", cost: 9000, repair: "Hood repair/replacement" },
    mirror: { type: "Mirror damage", severity: "Moderate", cost: 3500, repair: "Mirror replacement" },
    headlight: { type: "Headlight damage", severity: "Moderate", cost: 6000, repair: "Headlight replacement" },
    taillight: { type: "Taillight damage", severity: "Moderate", cost: 5000, repair: "Taillight replacement" },
    
    // Severe damages
    broken: { type: "Broken part", severity: "Severe", cost: 15000, repair: "Component replacement required" },
    crack: { type: "Cracked component", severity: "Severe", cost: 12000, repair: "Immediate replacement needed" },
    smash: { type: "Smashed part", severity: "Severe", cost: 18000, repair: "Major repair/replacement" },
    shatter: { type: "Shattered component", severity: "Severe", cost: 15000, repair: "Complete replacement" },
    window: { type: "Window/Windshield damage", severity: "Severe", cost: 12000, repair: "Glass replacement" },
    windshield: { type: "Windshield damage", severity: "Severe", cost: 15000, repair: "Windshield replacement" },
    
    // Tire/Wheel damages
    tire: { type: "Tire damage", severity: "Moderate", cost: 4000, repair: "Tire replacement" },
    wheel: { type: "Wheel damage", severity: "Moderate", cost: 8000, repair: "Wheel repair/replacement" },
    rim: { type: "Rim damage", severity: "Moderate", cost: 7000, repair: "Rim repair" },
    
    // Structural
    frame: { type: "Frame damage", severity: "Severe", cost: 25000, repair: "Structural repair - specialist needed" },
    chassis: { type: "Chassis damage", severity: "Severe", cost: 30000, repair: "Major structural work" }
  };

  let detectedDamages = [];
  let totalCost = 0;

  // Check for all damage keywords
  for (const [keyword, details] of Object.entries(damageKeywords)) {
    if (description.includes(keyword)) {
      detectedDamages.push(details);
      totalCost += details.cost;
      repairDetails.push(details.repair);
    }
  }

  // If damages detected
  if (detectedDamages.length > 0) {
    // Use most severe damage as primary
    const sortBySeverity = { 'Severe': 3, 'Moderate': 2, 'Minor': 1 };
    detectedDamages.sort((a, b) => sortBySeverity[b.severity] - sortBySeverity[a.severity]);
    
    damageType = detectedDamages[0].type;
    severity = detectedDamages[0].severity;
    
    // Multiple damages increase severity and cost
    if (detectedDamages.length > 1) {
      severity = "Severe";
      estimatedCost = Math.min(totalCost, 30000); // Cap at 30k
    } else {
      estimatedCost = detectedDamages[0].cost;
    }
  }

  // Build description
  let descriptionText = `AI Analysis detected: ${damageType}.`;
  if (detectedDamages.length > 1) {
    descriptionText += ` Multiple damages found: ${detectedDamages.map(d => d.type).join(', ')}.`;
  }
  descriptionText += ` ${repairDetails[0] || 'Professional inspection recommended'}.`;

  return {
    damageType,
    severity,
    estimatedCost,
    description: descriptionText,
    detectedDamages: detectedDamages.map(d => d.type),
    repairRecommendations: repairDetails.length > 0 ? repairDetails : ["Visit authorized service center for detailed assessment"]
  };
}

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

    // Upload images to Cloudinary
    const imageUrls = [];
    
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: 'damage-reports',
                transformation: [
                  { width: 1200, height: 900, crop: 'limit' },
                  { quality: 'auto' }
                ]
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            uploadStream.end(file.buffer);
          });

          imageUrls.push(uploadResult.secure_url);
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
