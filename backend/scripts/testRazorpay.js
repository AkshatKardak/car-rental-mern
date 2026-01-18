require('dotenv').config();
const Razorpay = require('razorpay');

const testRazorpayConnection = async () => {
  console.log('\n💳 TESTING RAZORPAY API\n');
  console.log('═'.repeat(60));

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.log('❌ Razorpay credentials not found in .env file\n');
    process.exit(1);
  }

  console.log(`\n🔑 Key ID: ${process.env.RAZORPAY_KEY_ID}`);
  console.log(`🔐 Secret: ${process.env.RAZORPAY_KEY_SECRET.substring(0, 8)}...\n`);

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  try {
    console.log('🔄 Testing Razorpay API connection...\n');

    // Try to create a test order
    const order = await razorpay.orders.create({
      amount: 50000, // ₹500 in paise
      currency: 'INR',
      receipt: `test_receipt_${Date.now()}`,
      notes: {
        test: true,
        purpose: 'API connection test'
      }
    });

    console.log('✅ Razorpay API connection successful!');
    console.log('\n📝 Test Order Created:');
    console.log(`   Order ID: ${order.id}`);
    console.log(`   Amount: ₹${order.amount / 100}`);
    console.log(`   Currency: ${order.currency}`);
    console.log(`   Status: ${order.status}`);
    console.log(`   Created At: ${new Date(order.created_at * 1000).toLocaleString('en-IN')}\n`);

    console.log('💡 Note: This is a TEST order. No actual payment will be processed.\n');
    console.log('═'.repeat(60));
    console.log('✅ RAZORPAY API: PASSED\n');
  } catch (error) {
    console.error('❌ Razorpay API connection failed!');
    console.error('Error:', error.message);
    console.log('\n⚠️  Possible issues:');
    console.log('   1. Invalid API keys');
    console.log('   2. Keys are not in TEST mode (should start with rzp_test_)');
    console.log('   3. Network connectivity issue');
    console.log('\n📖 Get your keys from: https://dashboard.razorpay.com/\n');
    console.log('═'.repeat(60));
    process.exit(1);
  }
};

testRazorpayConnection();
