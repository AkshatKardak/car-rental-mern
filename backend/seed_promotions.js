require('dotenv').config();
const mongoose = require('mongoose');
const Promotion = require('./src/models/Promotion');

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rentride';
    await mongoose.connect(dbURI);
    console.log(`✅ MongoDB Connected to: ${dbURI}`);
  } catch (error) {
    console.error('❌ Connection Error:', error);
    process.exit(1);
  }
};

const seedPromotions = async () => {
  await connectDB();
  
  try {
    // Clear existing promotions
    await Promotion.deleteMany();
    console.log('🧹 Old promotions cleared.');

    // Create promotions matching the schema
    const promotions = [
      {
        code: 'WELCOME50',
        name: 'Welcome Bonus',
        description: 'Flat ₹50 off on your first booking',
        type: 'fixed',
        value: 50,
        maxDiscount: 50,
        minBookingAmount: 500,
        validFrom: new Date(),
        validTo: new Date('2026-12-31'),
        usageLimit: 1000,
        usedCount: 0,
        active: true,
        applicableVehicles: []
      },
      {
        code: 'WEEKEND20',
        name: 'Weekend Special',
        description: '20% off on weekend bookings',
        type: 'percentage',
        value: 20,
        maxDiscount: 500,
        minBookingAmount: 1000,
        validFrom: new Date(),
        validTo: new Date('2026-12-31'),
        usageLimit: 500,
        usedCount: 0,
        active: true,
        applicableVehicles: []
      },
      {
        code: 'LUXURY1000',
        name: 'Luxury Special',
        description: 'Flat ₹1000 off on luxury car rentals',
        type: 'fixed',
        value: 1000,
        maxDiscount: 1000,
        minBookingAmount: 5000,
        validFrom: new Date(),
        validTo: new Date('2026-12-31'),
        usageLimit: 200,
        usedCount: 0,
        active: true,
        applicableVehicles: []
      },
      {
        code: 'LONGTERM30',
        name: 'Long Term Deal',
        description: '30% off on bookings above 7 days',
        type: 'percentage',
        value: 30,
        maxDiscount: 2000,
        minBookingAmount: 10000,
        validFrom: new Date(),
        validTo: new Date('2026-12-31'),
        usageLimit: 100,
        usedCount: 0,
        active: true,
        applicableVehicles: []
      },
      {
        code: 'FLASH500',
        name: 'Flash Sale',
        description: 'Limited time ₹500 instant discount',
        type: 'fixed',
        value: 500,
        maxDiscount: 500,
        minBookingAmount: 3000,
        validFrom: new Date(),
        validTo: new Date('2026-03-31'),
        usageLimit: 50,
        usedCount: 0,
        active: true,
        applicableVehicles: []
      },
      {
        code: 'ELECTRIC25',
        name: 'Go Green',
        description: '25% off on electric vehicle rentals',
        type: 'percentage',
        value: 25,
        maxDiscount: 1500,
        minBookingAmount: 2000,
        validFrom: new Date(),
        validTo: new Date('2026-12-31'),
        usageLimit: 300,
        usedCount: 0,
        active: true,
        applicableVehicles: []
      },
      {
        code: 'SPORTS15',
        name: 'Sports Car Special',
        description: '15% off on sports car bookings',
        type: 'percentage',
        value: 15,
        maxDiscount: 3000,
        minBookingAmount: 8000,
        validFrom: new Date(),
        validTo: new Date('2026-12-31'),
        usageLimit: 150,
        usedCount: 0,
        active: true,
        applicableVehicles: []
      },
      {
        code: 'NEWUSER100',
        name: 'New User Offer',
        description: 'Flat ₹100 off on first ride',
        type: 'fixed',
        value: 100,
        maxDiscount: 100,
        minBookingAmount: 800,
        validFrom: new Date(),
        validTo: new Date('2026-12-31'),
        usageLimit: 2000,
        usedCount: 0,
        active: true,
        applicableVehicles: []
      }
    ];

    await Promotion.insertMany(promotions);
    
    console.log('✅ Promotions Seeded Successfully!');
    console.log('\n📊 Promotions Added:');
    promotions.forEach((promo, i) => {
      console.log(`   ${i + 1}. ${promo.code} - ${promo.name}`);
      console.log(`      ${promo.description}`);
      console.log(`      Discount: ${promo.type === 'percentage' ? promo.value + '%' : '₹' + promo.value}`);
      console.log(`      Max Discount: ₹${promo.maxDiscount} | Min Amount: ₹${promo.minBookingAmount}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding promotions:', error);
    process.exit(1);
  }
};

seedPromotions();
