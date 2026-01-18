const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  minBookingAmount: {
    type: Number,
    required: true,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  validFrom: {
    type: Date,
    required: true
  },
  validTo: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    required: true
  },
  usedCount: {
    type: Number,
    default: 0
  },
  applicableVehicles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car'
  }],
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Method to check if promotion is valid
promotionSchema.methods.isValid = function() {
  const now = new Date();
  return this.active && 
         now >= this.validFrom && 
         now <= this.validTo && 
         this.usedCount < this.usageLimit;
};

// Method to check if applicable to a vehicle
promotionSchema.methods.isApplicableToVehicle = function(vehicleId) {
  if (this.applicableVehicles.length === 0) return true;
  return this.applicableVehicles.some(id => id.toString() === vehicleId.toString());
};

// Method to calculate discount
promotionSchema.methods.calculateDiscount = function(amount) {
  if (amount < this.minBookingAmount) return 0;
  
  let discount = 0;
  if (this.type === 'percentage') {
    discount = (amount * this.value) / 100;
  } else {
    discount = this.value;
  }
  
  if (this.maxDiscount && discount > this.maxDiscount) {
    discount = this.maxDiscount;
  }
  
  return discount;
};

module.exports = mongoose.model('Promotion', promotionSchema);
