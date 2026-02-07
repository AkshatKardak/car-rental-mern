const mongoose = require('mongoose');
require('dotenv').config();

const createTestPromotion = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in .env file!');
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');

    const Promotion = require('./src/models/Promotion');

    // Delete existing FLASH500 promotion if exists
    await Promotion.deleteOne({ code: 'FLASH500' });
    console.log('🗑️  Deleted existing FLASH500 promotion (if any)\n');

    // Create new test promotion
    const promotion = await Promotion.create({
      code: 'FLASH500',
      name: 'Flash Sale - ₹500 Off',
      description: 'Get ₹500 off on bookings above ₹5000',
      type: 'fixed',
      value: 500,
      minBookingAmount: 5000,
      maxDiscount: null,
      validFrom: new Date('2026-02-01'),
      validTo: new Date('2026-12-31'),  // ← Changed from validUntil to validTo
      usageLimit: 100,
      usedCount: 0,
      active: true,
      applicableVehicles: []  // Empty means all vehicles
    });

    console.log('✅ Test promotion created successfully!\n');
    console.log('📋 Promotion Details:');
    console.log('   Code:', promotion.code);
    console.log('   Name:', promotion.name);
    console.log('   Type:', promotion.type);
    console.log('   Discount:', `₹${promotion.value}`);
    console.log('   Min Amount:', `₹${promotion.minBookingAmount}`);
    console.log('   Valid From:', promotion.validFrom.toDateString());
    console.log('   Valid To:', promotion.validTo.toDateString());
    console.log('   Usage Limit:', promotion.usageLimit);
    console.log('   Used Count:', promotion.usedCount);
    console.log('   Status:', promotion.active ? '✅ Active' : '❌ Inactive');
    console.log('\n🎉 You can now use code "FLASH500" in your app!\n');

    // Create a few more test promotions
    console.log('Creating additional test promotions...\n');

    await Promotion.deleteMany({ code: { $in: ['SAVE20', 'WELCOME100'] } });

    await Promotion.create([
      {
        code: 'SAVE20',
        name: '20% Off',
        description: 'Get 20% off on bookings above ₹10000',
        type: 'percentage',
        value: 20,
        minBookingAmount: 10000,
        maxDiscount: 2000,
        validFrom: new Date('2026-02-01'),
        validTo: new Date('2026-12-31'),
        usageLimit: 50,
        usedCount: 0,
        active: true,
        applicableVehicles: []
      },
      {
        code: 'WELCOME100',
        name: 'Welcome Bonus',
        description: 'Get ₹100 off on your first booking',
        type: 'fixed',
        value: 100,
        minBookingAmount: 3000,
        maxDiscount: null,
        validFrom: new Date('2026-02-01'),
        validTo: new Date('2026-12-31'),
        usageLimit: 1000,
        usedCount: 0,
        active: true,
        applicableVehicles: []
      }
    ]);

    console.log('✅ Created additional promotions:');
    console.log('   • SAVE20 - 20% off (max ₹2000)');
    console.log('   • WELCOME100 - ₹100 off\n');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

createTestPromotion();
