const mongoose = require('mongoose');
require('dotenv').config();

const cleanupPayments = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');

    const Payment = require('./src/models/Payment');

    // Find all payments with null transactionId
    const paymentsWithNullTransactionId = await Payment.find({ 
      transactionId: null 
    });

    console.log(`Found ${paymentsWithNullTransactionId.length} payments with null transactionId\n`);

    if (paymentsWithNullTransactionId.length > 0) {
      // Delete all but the most recent one for each booking
      const bookingIds = [...new Set(paymentsWithNullTransactionId.map(p => p.booking?.toString()))];
      
      for (const bookingId of bookingIds) {
        const paymentsForBooking = await Payment.find({ 
          booking: bookingId,
          transactionId: null 
        }).sort({ createdAt: -1 });
        
        // Keep the most recent, delete the rest
        if (paymentsForBooking.length > 1) {
          const toDelete = paymentsForBooking.slice(1);
          console.log(`Deleting ${toDelete.length} duplicate payment(s) for booking ${bookingId}`);
          
          for (const payment of toDelete) {
            await Payment.findByIdAndDelete(payment._id);
          }
        }
      }
    }

    console.log('\n✅ Cleanup complete!\n');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

cleanupPayments();
