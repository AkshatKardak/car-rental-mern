require('dotenv').config();
const mongoose = require('mongoose');

// Import models (this registers them with mongoose)
const User = require('../src/models/User');
const Car = require('../src/models/Car');
const Booking = require('../src/models/Booking');

async function listBookings() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected!\n');
    
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('car', 'brand model')
      .sort({ createdAt: -1 })
      .limit(10);
    
    if (bookings.length === 0) {
      console.log('📭 No bookings found in database.');
      console.log('\n💡 Create a booking first:');
      console.log('   1. Go to http://localhost:5173');
      console.log('   2. Browse cars and make a booking');
      console.log('   3. Run this script again\n');
      process.exit(0);
    }
    
    console.log(`📋 Found ${bookings.length} Recent Bookings:\n`);
    console.log('━'.repeat(100));
    
    bookings.forEach((booking, index) => {
      const user = booking.user || {};
      const car = booking.car || {};
      
      console.log(`\n${index + 1}. Booking Details:`);
      console.log(`   ID: ${booking._id}`);
      console.log(`   User: ${user.name || 'Unknown'} (${user.email || 'N/A'})`);
      console.log(`   Car: ${car.brand || 'Unknown'} ${car.model || 'Car'}`);
      console.log(`   Status: ${booking.status.toUpperCase()}`);
      console.log(`   Start: ${new Date(booking.startDate).toLocaleString('en-IN')}`);
      console.log(`   End: ${new Date(booking.endDate).toLocaleString('en-IN')}`);
      console.log(`   Total: ₹${booking.totalPrice}`);
      console.log(`   \n   🔗 Report Damage URL:`);
      console.log(`   http://localhost:5173/report-damage/${booking._id}`);
      console.log('\n' + '━'.repeat(100));
    });
    
    console.log('\n✅ Use any booking ID above to test damage reporting!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listBookings();
