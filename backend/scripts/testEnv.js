require('dotenv').config();

const testEnvVariables = () => {
  console.log('\n🔍 TESTING ENVIRONMENT VARIABLES\n');
  console.log('═'.repeat(60));

  const variables = {
    'Server': {
      'Port': process.env.PORT,
      'Node Environment': process.env.NODE_ENV
    },
    'Database': {
      'MongoDB URI': process.env.MONGODB_URI ? '✓ Set' : '✗ Missing'
    },
    'JWT': {
      'JWT Secret': process.env.JWT_SECRET ? `✓ Set (${process.env.JWT_SECRET.length} chars)` : '✗ Missing',
      'JWT Refresh Secret': process.env.JWT_REFRESH_SECRET ? `✓ Set (${process.env.JWT_REFRESH_SECRET.length} chars)` : '✗ Missing',
      'JWT Expire': process.env.JWT_EXPIRE,
      'JWT Refresh Expire': process.env.JWT_REFRESH_EXPIRE
    },
    'Image Upload': {
      'ImgBB API Key': process.env.IMGBB_API_KEY ? `✓ Set (${process.env.IMGBB_API_KEY.substring(0, 8)}...)` : '✗ Missing'
    },
    'Payment Gateway': {
      'Razorpay Key ID': process.env.RAZORPAY_KEY_ID ? `✓ Set (${process.env.RAZORPAY_KEY_ID})` : '✗ Missing',
      'Razorpay Secret': process.env.RAZORPAY_KEY_SECRET ? `✓ Set (${process.env.RAZORPAY_KEY_SECRET.substring(0, 8)}...)` : '✗ Missing'
    },
    'Email': {
  'Resend API Key': process.env.RESEND_API_KEY ? `✓ Set (${process.env.RESEND_API_KEY.substring(0, 10)}...)` : '✗ Missing'
},
    'Frontend': {
      'Client URL': process.env.CLIENT_URL
    },
    'Optional': {
      'Session Secret': process.env.SESSION_SECRET ? `✓ Set (${process.env.SESSION_SECRET.length} chars)` : '⚠ Optional',
      'Admin Email': process.env.ADMIN_EMAIL || '⚠ Optional',
      'Admin Password': process.env.ADMIN_PASSWORD ? '✓ Set' : '⚠ Optional'
    }
  };

  // Display all variables
  Object.entries(variables).forEach(([category, items]) => {
    console.log(`\n📋 ${category}:`);
    console.log('-'.repeat(60));
    Object.entries(items).forEach(([key, value]) => {
      const icon = value?.includes('✗') ? '❌' : value?.includes('⚠') ? '⚠️ ' : '✅';
      console.log(`  ${icon} ${key}: ${value}`);
    });
  });

  // Summary
  const allValues = Object.values(variables).flatMap(v => Object.values(v));
  const missing = allValues.filter(v => v?.includes('✗')).length;
  const optional = allValues.filter(v => v?.includes('⚠')).length;
  const configured = allValues.length - missing - optional;

  console.log('\n' + '═'.repeat(60));
  console.log('\n📊 SUMMARY:');
  console.log(`  ✅ Configured: ${configured}`);
  console.log(`  ❌ Missing: ${missing}`);
  console.log(`  ⚠️  Optional: ${optional}`);

  if (missing > 0) {
    console.log('\n⚠️  Please configure missing variables in .env file');
    console.log('   See .env.example for reference\n');
    process.exit(1);
  } else {
    console.log('\n✅ All required environment variables are configured!\n');
  }
};

testEnvVariables();
