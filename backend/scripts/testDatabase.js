require('dotenv').config();
const mongoose = require('mongoose');

const testDatabaseConnection = async () => {
  console.log('\n💾 TESTING DATABASE CONNECTION\n');
  console.log('═'.repeat(60));

  if (!process.env.MONGODB_URI) {
    console.log('❌ MongoDB URI not found in .env file\n');
    process.exit(1);
  }

  console.log(`\n📍 MongoDB URI: ${process.env.MONGODB_URI}\n`);
  console.log('🔄 Connecting to MongoDB...\n');

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB connected successfully!');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🖥️  Host: ${mongoose.connection.host}`);
    console.log(`🔌 Port: ${mongoose.connection.port}`);
    console.log(`⚡ Ready State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}\n`);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📁 Collections in database (${collections.length}):`);
    collections.forEach((col, index) => {
      console.log(`   ${index + 1}. ${col.name}`);
    });
    
    console.log('\n' + '═'.repeat(60));
    console.log('✅ DATABASE CONNECTION: PASSED\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed!');
    console.error('Error:', error.message);
    console.log('\n⚠️  Make sure MongoDB is running:');
    console.log('   - Local: mongod --dbpath /path/to/data');
    console.log('   - Or use MongoDB Atlas for cloud database\n');
    console.log('═'.repeat(60));
    process.exit(1);
  }
};

testDatabaseConnection();
