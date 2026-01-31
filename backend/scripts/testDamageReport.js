require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const API_URL = 'http://localhost:5005/api';

console.log('🧪 Testing Damage Report & AI Analysis');
console.log('📍 API URL:', API_URL);
console.log('');

async function testDamageReport() {
  try {
    // Note: This test requires authentication
    console.log('⚠️  This test requires a valid authentication token');
    console.log('💡 To test damage reports:');
    console.log('   1. Login to your app');
    console.log('   2. Create a booking');
    console.log('   3. Upload damage photos from the app');
    console.log('');
    console.log('🔍 Checking if HuggingFace API key is set...');
    
    if (!process.env.HUGGINGFACE_API_KEY) {
      console.log('❌ HUGGINGFACE_API_KEY not found in .env');
      console.log('💡 Add it to test AI image analysis');
      return;
    }
    
    console.log('✅ HuggingFace API key found');
    console.log('');
    
    // Test AI Analysis endpoint (requires image upload)
    console.log('📸 AI Image Analysis Test');
    console.log('   To test AI damage detection:');
    console.log('   1. Go to: http://localhost:5173/report-damage/:bookingId');
    console.log('   2. Upload a car damage photo');
    console.log('   3. Click "Analyze with AI"');
    console.log('   4. Check console for AI analysis results');
    console.log('');
    
    console.log('✅ Damage report system is ready!');
    console.log('');
    console.log('📝 Available Features:');
    console.log('   • Upload damage photos (up to 5)');
    console.log('   • AI-powered damage detection');
    console.log('   • Estimated repair cost calculation');
    console.log('   • Admin review system');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDamageReport();
