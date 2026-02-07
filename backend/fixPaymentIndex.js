const mongoose = require('mongoose');
require('dotenv').config();

const fixPaymentIndex = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in .env file!');
      console.log('\nPlease check your .env file has:');
      console.log('MONGODB_URI=your_mongodb_connection_string\n');
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas!\n');

    const db = mongoose.connection.db;
    const paymentsCollection = db.collection('payments');
    
    // Get all current indexes
    console.log('📋 Current indexes on payments collection:');
    const indexes = await paymentsCollection.indexes();
    indexes.forEach(index => {
      console.log(`  - ${index.name}:`, index.key);
    });
    console.log('');
    
    // Drop the problematic transactionId index
    try {
      console.log('🗑️  Attempting to drop transactionId_1 index...');
      await paymentsCollection.dropIndex('transactionId_1');
      console.log('✅ Successfully dropped transactionId_1 index\n');
    } catch (err) {
      if (err.code === 27) {
        console.log('ℹ️  transactionId_1 index does not exist (already dropped)\n');
      } else {
        console.log('⚠️  Error dropping index:', err.message, '\n');
      }
    }
    
    // Create new sparse index for transactionId
    try {
      console.log('🔨 Creating new sparse index for transactionId...');
      await paymentsCollection.createIndex(
        { transactionId: 1 }, 
        { 
          unique: true, 
          sparse: true,
          name: 'transactionId_1'
        }
      );
      console.log('✅ Successfully created sparse index for transactionId\n');
    } catch (err) {
      console.log('⚠️  Error creating index:', err.message, '\n');
    }
    
    // Verify new indexes
    console.log('📋 Updated indexes on payments collection:');
    const newIndexes = await paymentsCollection.indexes();
    newIndexes.forEach(index => {
      console.log(`  - ${index.name}:`, index.key, index.sparse ? '(sparse)' : '');
    });
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    console.log('\n🎉 Done! Now restart your backend server.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixPaymentIndex();
