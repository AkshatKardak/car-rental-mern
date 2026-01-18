const { spawn } = require('child_process');
const path = require('path');

const tests = [
  { name: 'Environment Variables', file: 'testEnv.js', emoji: '🔍' },
  { name: 'Database Connection', file: 'testDatabase.js', emoji: '💾' },
  { name: 'Email Configuration', file: 'testResend.js', emoji: '📧' },
  { name: 'Razorpay API', file: 'testRazorpay.js', emoji: '💳' },
  { name: 'ImgBB API', file: 'testImgBB.js', emoji: '🖼️' }
];

const runTest = (testFile) => {
  return new Promise((resolve, reject) => {
    const testPath = path.join(__dirname, testFile);
    const process = spawn('node', [testPath], { stdio: 'inherit' });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${testFile} failed with code ${code}`));
      }
    });
  });
};

const runAllTests = async () => {
  console.log('\n' + '═'.repeat(70));
  console.log('🚀 RUNNING ALL BACKEND TESTS');
  console.log('═'.repeat(70));

  const results = [];

  for (const test of tests) {
    console.log(`\n${test.emoji} Testing: ${test.name}...`);
    try {
      await runTest(test.file);
      results.push({ name: test.name, status: '✅ PASSED', emoji: test.emoji });
    } catch (error) {
      results.push({ name: test.name, status: '❌ FAILED', emoji: test.emoji });
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('═'.repeat(70));
  
  results.forEach(result => {
    console.log(`${result.emoji} ${result.name}: ${result.status}`);
  });

  const passed = results.filter(r => r.status.includes('PASSED')).length;
  const failed = results.filter(r => r.status.includes('FAILED')).length;

  console.log('\n' + '═'.repeat(70));
  console.log(`✅ Passed: ${passed}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  console.log('═'.repeat(70) + '\n');

  if (failed > 0) {
    console.log('⚠️  Some tests failed. Please check the logs above.\n');
    process.exit(1);
  } else {
    console.log('🎉 All tests passed! Your backend is ready to go!\n');
    process.exit(0);
  }
};

runAllTests();
