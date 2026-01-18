const mongoose = require('mongoose');

const damageReportSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  damageType: {
    type: String,
    required: true,
    enum: ['Scratch', 'Dent', 'Paint Damage', 'Glass Damage', 'Tire Damage', 'Interior Damage', 'Other']
  },
  severity: {
    type: String,
    required: true,
    enum: ['Minor', 'Moderate', 'Severe']
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  estimatedCost: {
    type: Number,
    required: true
  },
  actualCost: {
    type: Number,
    default: null
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Reported', 'Under Review', 'Approved', 'Repaired'],
    default: 'Reported'
  },
  reportedDate: {
    type: Date,
    default: Date.now
  },
  repairedDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DamageReport', damageReportSchema);
