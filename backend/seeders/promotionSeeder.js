const mongoose = require('mongoose');
require('dotenv').config();

// Promotion Model
const promotionSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true },
  maxDiscount: Number,
  minBookingAmount: { type: Number, default: 0 },
  validFrom: { type: Date, default: Date.now },
  validUntil: Date,
  active: { type: Boolean, default: true },
  usageLimit: Number,
  usedCount: { type: Number, default: 0 }
}, { timestamps: true });

const Promotion = mongoose.model('Promotion', promotionSchema);

// Promotions Data
const promotionsData = [
  {
    code: 'WELCOME50',
    name: 'Welcome Bonus',
    description: 'Flat ₹50 off on your first booking',
    type: 'fixed',
    value: 50,
    maxDiscount: 50,
    minBookingAmount: 500,
    validUntil: new Date('2026-12-31'),
    active: true,
    usageLimit: 1000
  },
  {
    code: 'WEEKEND20',
    name: 'Weekend Special',
    description: '20% off on weekend bookings',
    type: 'percentage',
    value: 20,
    maxDiscount: 500,
    minBookingAmount: 1000,
    validUntil: new Date('2026-12-31'),
    active: true,
    usageLimit: 500
  },
  {
    code: 'LUXURY1000',
    name: 'Luxury Special',
    description: 'Flat ₹1000 off on luxury car rentals',
    type: 'fixed',
    value: 1000,
    maxDiscount: 1000,
    minBookingAmount: 5000,
    validUntil: new Date('2026-12-31'),
    active: true,
    usageLimit: 200
  },
  {
    code: 'LONGTERM30',
    name: 'Long Term Deal',
    description: '30% off on bookings above 7 days',
    type: 'percentage',
    value: 30,
    maxDiscount: 2000,
    minBookingAmount: 10000,
    validUntil: new Date('2026-12-31'),
    active: true,
    usageLimit: 100
  },
  {
    code: 'FLASH500',
    name: 'Flash Sale',
    description: 'Limited time ₹500 instant discount',
    type: 'fixed',
    value: 500,
    maxDiscount: 500,
    minBookingAmount: 3000,
    validUntil: new Date('2026-03-31'),
    active: true,
    usageLimit: 300
  }
];

// Seed function
const seedPromotions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing promotions
    await Promotion.deleteMany({});
    console.log('🗑️  Cleared existing promotions');

    // Insert new promotions
    const insertedPromos = await Promotion.insertMany(promotionsData);
    console.log(`✅ Successfully seeded ${insertedPromos.length} promotions`);

    // Display inserted promotions
    insertedPromos.forEach((promo, index) => {
      console.log(`${index + 1}. ${promo.code} - ${promo.name} (${promo.type === 'percentage' ? promo.value + '%' : '₹' + promo.value})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding promotions:', error);
    process.exit(1);
  }
};

seedPromotions();
