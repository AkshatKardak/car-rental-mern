const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'],
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundDate: {
    type: Date,
    default: null
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
