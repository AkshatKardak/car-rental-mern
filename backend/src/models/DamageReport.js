const mongoose = require('mongoose');

const damageReportSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
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
  description: {
    type: String,
    required: [true, 'Please provide damage description']
  },
  images: [{
    type: String
  }],
  aiAnalysis: {
    damageType: String,
    severity: String,
    estimatedCost: Number,
    description: String
  },
  estimatedCost: {
    type: Number,
    default: 0
  },
  actualCost: {
    type: Number
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'resolved'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentId: {
    type: String
  },
  adminNotes: {
    type: String
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DamageReport', damageReportSchema);
