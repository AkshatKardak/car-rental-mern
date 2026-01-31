require('dotenv').config();
const mongoose = require('mongoose');
const Promotion = require('../src/models/Promotion');

const promotions = [
  {
    name: 'Weekend Special',
    code: 'WEEKEND25',
    description: 'Get 25% off on weekend bookings',
    type: 'percentage',
    value: 25,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    minBookingAmount: 2000,
    maxDiscount: 1000,
    usageLimit: 1000,
    active: true
  },
  {
    name: 'Long Term Discount',
    code: 'LONGTERM30',
    description: 'Book for 7+ days and save 30%',
    type: 'percentage',
    value: 30,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    minBookingAmount: 5000,
    maxDiscount: 3000,
    usageLimit: 500,
    active: true
  },
  {
    name: 'Luxury Car Discount',
    code: 'LUXURY500',
    description: 'Flat ₹500 off on luxury car rentals',
    type: 'fixed',
    value: 500,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
    minBookingAmount: 10000,
    maxDiscount: null,
    usageLimit: 200,
    active: true
  },
  {
    name: 'Flash Sale',
    code: 'FLASH40',
    description: 'Limited time offer - 40% off',
    type: 'percentage',
    value: 40,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    minBookingAmount: 3000,
    maxDiscount: 2000,
    usageLimit: 100,
    active: true
  },
  {
    name: 'First Ride',
    code: 'FIRST20',
    description: 'First booking discount - 20% off',
    type: 'percentage',
    value: 20,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    minBookingAmount: 1500,
    maxDiscount: 800,
    usageLimit: 5000,
    active: true
  },
  {
    name: 'New User Special',
    code: 'NEWUSER15',
    description: 'Welcome offer - 15% off for new users',
    type: 'percentage',
    value: 15,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
    minBookingAmount: 1000,
    maxDiscount: 500,
    usageLimit: 10000,
    active: true
  }
];

async function seedPromotions() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing existing promotions...');
    await Promotion.deleteMany({});
    console.log('✅ Cleared existing promotions');

    console.log('🌱 Seeding promotions...');
    const createdPromotions = await Promotion.insertMany(promotions);
    console.log(`✅ Created ${createdPromotions.length} promotions`);

    console.log('\n📋 Promotion Codes Created:');
    console.log('━'.repeat(60));
    createdPromotions.forEach(promo => {
      const discount = promo.type === 'percentage' ? `${promo.value}%` : `₹${promo.value}`;
      const expiry = promo.validTo.toLocaleDateString('en-IN');
      console.log(`   🎟️  ${promo.code.padEnd(15)} | ${discount.padEnd(8)} off | Valid till: ${expiry}`);
    });
    console.log('━'.repeat(60));

    console.log('\n✅ Seeding completed successfully!');
    console.log('💡 Tip: Test these codes in your payment page\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding promotions:', error.message);
    process.exit(1);
  }
}

seedPromotions();
