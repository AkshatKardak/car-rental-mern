const mongoose = require('mongoose');
require('dotenv').config();

const verifyIndexes = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');

    const db = mongoose.connection.db;
    const paymentsCollection = db.collection('payments');
    
    console.log('📋 Current indexes on payments collection:');
    const indexes = await paymentsCollection.indexes();
    
    indexes.forEach(index => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key), index.sparse ? '(sparse ✅)' : '(NOT sparse ❌)');
    });

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

verifyIndexes();
