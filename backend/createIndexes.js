require('dotenv').config();
const mongoose = require('mongoose');
const Car = require('./src/models/Car');

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

const createIndexes = async () => {
  await connectDB();
  
  try {
    // Create text index on Car collection
    await Car.createIndexes();
    console.log('✅ Text indexes created successfully');

    // Verify cars exist
    const count = await Car.countDocuments();
    console.log(`📊 Total cars in database: ${count}`);

    if (count === 0) {
      console.log('⚠️  No cars found! Run: node seed.js');
    } else {
      // Show sample cars
      const sampleCars = await Car.find().limit(3).select('name brand pricePerDay category');
      console.log('\n🚗 Sample Cars:');
      sampleCars.forEach((car, i) => {
        console.log(`   ${i + 1}. ${car.name} (${car.brand}) - ₹${car.pricePerDay}/day [${car.category}]`);
      });
    }

    console.log('\n✅ Database is ready!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createIndexes();
