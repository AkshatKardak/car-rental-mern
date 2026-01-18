require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const testImgBBConnection = async () => {
  console.log('\n🖼️  TESTING IMGBB API\n');
  console.log('═'.repeat(60));

  if (!process.env.IMGBB_API_KEY) {
    console.log('❌ ImgBB API key not found in .env file\n');
    process.exit(1);
  }

  console.log(`\n🔑 API Key: ${process.env.IMGBB_API_KEY.substring(0, 8)}...\n`);

  try {
    console.log('🔄 Testing ImgBB API connection...\n');

    // Create a simple test image (1x1 pixel PNG)
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const formData = new FormData();
    formData.append('image', testImageBase64);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      formData,
      {
        headers: formData.getHeaders()
      }
    );

    if (response.data.success) {
      console.log('✅ ImgBB API connection successful!');
      console.log('\n📝 Test Image Upload:');
      console.log(`   Image ID: ${response.data.data.id}`);
      console.log(`   URL: ${response.data.data.url}`);
      console.log(`   Display URL: ${response.data.data.display_url}`);
      console.log(`   Size: ${response.data.data.size} bytes`);
      console.log(`   Delete URL: ${response.data.data.delete_url}\n`);
      
      console.log('💡 Note: Test image uploaded successfully!\n');
      console.log('═'.repeat(60));
      console.log('✅ IMGBB API: PASSED\n');
    }
  } catch (error) {
    console.error('❌ ImgBB API connection failed!');
    console.error('Error:', error.response?.data?.error?.message || error.message);
    console.log('\n⚠️  Possible issues:');
    console.log('   1. Invalid API key');
    console.log('   2. API key expired or revoked');
    console.log('   3. Network connectivity issue');
    console.log('\n📖 Get your API key from: https://api.imgbb.com/\n');
    console.log('═'.repeat(60));
    process.exit(1);
  }
};

testImgBBConnection();
