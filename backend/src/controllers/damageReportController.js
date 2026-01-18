const DamageReport = require('../models/DamageReport');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { uploadToImgBB } = require('../utils/imgbb');

// Get all damage reports
exports.getAllDamageReports = async (req, res) => {
  try {
    const { status, carId, userId, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (carId) filter.car = carId;
    if (userId) filter.user = userId;
    
    const reports = await DamageReport.find(filter)
      .populate('booking', 'startDate endDate')
      .populate('car', 'name brand model registrationNumber')
      .populate('user', 'name email phone')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 });
    
    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching damage reports', 
      error: error.message 
    });
  }
};

// Get single damage report
exports.getDamageReportById = async (req, res) => {
  try {
    const report = await DamageReport.findById(req.params.id)
      .populate('booking')
      .populate('car', 'name brand model registrationNumber images')
      .populate('user', 'name email phone');
    
    if (!report) {
      return res.status(404).json({ 
        success: false,
        message: 'Damage report not found' 
      });
    }
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching damage report', 
      error: error.message 
    });
  }
};

// Create damage report
exports.createDamageReport = async (req, res) => {
  try {
    const { bookingId, damageType, severity, description, location, estimatedCost } = req.body;
    
    // Verify booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }
    
    // Upload images if provided
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = await uploadToImgBB(file.buffer);
        imageUrls.push(imageUrl);
      }
    }
    
    const report = await DamageReport.create({
      booking: bookingId,
      car: booking.car,
      user: booking.user,
      damageType,
      severity,
      description,
      location,
      estimatedCost,
      images: imageUrls
    });
    
    // Update car status to 'Under Maintenance' if severe damage
    if (severity === 'Severe') {
      await Car.findByIdAndUpdate(booking.car, { 
        status: 'Under Maintenance' 
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Damage report created successfully',
      data: report
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Error creating damage report', 
      error: error.message 
    });
  }
};

// Update damage report
exports.updateDamageReport = async (req, res) => {
  try {
    const report = await DamageReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('car');
    
    if (!report) {
      return res.status(404).json({ 
        success: false,
        message: 'Damage report not found' 
      });
    }
    
    // If status changed to 'Repaired', update car status back to 'Available'
    if (req.body.status === 'Repaired') {
      report.repairedDate = new Date();
      await report.save();
      
      await Car.findByIdAndUpdate(report.car._id, { 
        status: 'Available' 
      });
    }
    
    res.json({
      success: true,
      message: 'Damage report updated successfully',
      data: report
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Error updating damage report', 
      error: error.message 
    });
  }
};

// Delete damage report
exports.deleteDamageReport = async (req, res) => {
  try {
    const report = await DamageReport.findByIdAndDelete(req.params.id);
    
    if (!report) {
      return res.status(404).json({ 
        success: false,
        message: 'Damage report not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Damage report deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting damage report', 
      error: error.message 
    });
  }
};

// Get damage statistics for a car
exports.getCarDamageStats = async (req, res) => {
  try {
    const { carId } = req.params;
    
    const reports = await DamageReport.find({ car: carId });
    
    const stats = {
      totalReports: reports.length,
      byStatus: {
        Reported: reports.filter(r => r.status === 'Reported').length,
        'Under Review': reports.filter(r => r.status === 'Under Review').length,
        Approved: reports.filter(r => r.status === 'Approved').length,
        Repaired: reports.filter(r => r.status === 'Repaired').length
      },
      bySeverity: {
        Minor: reports.filter(r => r.severity === 'Minor').length,
        Moderate: reports.filter(r => r.severity === 'Moderate').length,
        Severe: reports.filter(r => r.severity === 'Severe').length
      },
      totalEstimatedCost: reports.reduce((sum, r) => sum + r.estimatedCost, 0),
      totalActualCost: reports.reduce((sum, r) => sum + (r.actualCost || 0), 0)
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching damage statistics', 
      error: error.message 
    });
  }
};
