require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');

async function testAPIs() {
  console.log('\n🧪 Testing AI API Keys...\n');

  // Check if keys exist
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in .env file');
    return;
  }
  if (!process.env.GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY not found in .env file');
    return;
  }

  console.log('✅ Environment variables loaded');
  console.log(`   - Gemini key: ${process.env.GEMINI_API_KEY.substring(0, 20)}...`);
  console.log(`   - Groq key: ${process.env.GROQ_API_KEY.substring(0, 20)}...\n`);

  // Test Gemini
  try {
    console.log('1️⃣ Testing Gemini API...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const result = await model.generateContent('Say "Gemini working!" in one sentence.');
    const response = result.response.text();
    
    console.log('   ✅ Response:', response);
    console.log('   ✅ Gemini API: WORKING!\n');
  } catch (error) {
    console.error('   ❌ Gemini Error:', error.message);
    console.error('   ❌ Check your GEMINI_API_KEY\n');
  }

  // Test Groq
  try {
    console.log('2️⃣ Testing Groq API...');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say "Groq working!" in one sentence.' }],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 50,
    });
    
    const response = completion.choices[0].message.content;
    
    console.log('   ✅ Response:', response);
    console.log('   ✅ Groq API: WORKING!\n');
  } catch (error) {
    console.error('   ❌ Groq Error:', error.message);
    console.error('   ❌ Check your GROQ_API_KEY\n');
  }

  console.log('🎉 Testing complete!\n');
}

testAPIs();
