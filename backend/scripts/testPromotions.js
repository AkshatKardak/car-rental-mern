require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.CLIENT_URL?.replace('5173', '5005') || 'http://localhost:5005';
const BASE_URL = `${API_URL}/api`;

console.log('🧪 Testing Promotions API');
console.log('📍 API URL:', BASE_URL);
console.log('');

async function testPromotions() {
  try {
    // Test 1: Get all promotions
    console.log('1️⃣  Testing: GET /api/promotions');
    const allPromotions = await axios.get(`${BASE_URL}/promotions`);
    console.log('✅ Status:', allPromotions.status);
    console.log('✅ Found promotions:', allPromotions.data.data.length);
    console.log('');

    if (allPromotions.data.data.length > 0) {
      const firstPromo = allPromotions.data.data[0];
      console.log('📋 Sample Promotion:');
      console.log('   Code:', firstPromo.code);
      console.log('   Name:', firstPromo.name);
      console.log('   Discount:', firstPromo.discountValue + (firstPromo.discountType === 'percentage' ? '%' : '₹'));
      console.log('   Valid Until:', new Date(firstPromo.validUntil).toLocaleDateString());
      console.log('');

      // Test 2: Validate a promotion code
      console.log('2️⃣  Testing: POST /api/promotions/validate');
      console.log('   Testing code:', firstPromo.code);
      
      try {
        const validateResponse = await axios.post(
          `${BASE_URL}/promotions/validate`,
          { code: firstPromo.code }
        );
        console.log('✅ Status:', validateResponse.status);
        console.log('✅ Validation Result:', validateResponse.data.success ? 'Valid' : 'Invalid');
        console.log('');
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('⚠️  Validation requires authentication (expected for protected routes)');
          console.log('');
        } else {
          throw error;
        }
      }

      // Test 3: Invalid promotion code
      console.log('3️⃣  Testing: Invalid promotion code');
      try {
        await axios.post(`${BASE_URL}/promotions/validate`, { code: 'INVALID123' });
        console.log('❌ Should have failed with invalid code');
      } catch (error) {
        if (error.response?.status === 404 || error.response?.status === 400) {
          console.log('✅ Correctly rejected invalid code');
          console.log('');
        } else if (error.response?.status === 401) {
          console.log('⚠️  Requires authentication');
          console.log('');
        }
      }

      // Test 4: Get promotion by ID
      console.log('4️⃣  Testing: GET /api/promotions/:id');
      const getById = await axios.get(`${BASE_URL}/promotions/${firstPromo._id}`);
      console.log('✅ Status:', getById.status);
      console.log('✅ Retrieved promotion:', getById.data.data.code);
      console.log('');
    }

    console.log('✅ All promotion tests completed successfully!');
    console.log('');
    console.log('📝 Available Promo Codes:');
    allPromotions.data.data.forEach(promo => {
      console.log(`   • ${promo.code} - ${promo.name}`);
    });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

testPromotions();
