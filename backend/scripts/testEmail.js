require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmailConnection = async () => {
  console.log('\n📧 TESTING EMAIL CONFIGURATION\n');
  console.log('═'.repeat(60));

  // Check if credentials exist
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('❌ Email credentials not found in .env file');
    console.log('\nAdd these to your .env:');
    console.log('  EMAIL_USER=your.email@gmail.com');
    console.log('  EMAIL_PASSWORD=your_16_char_app_password\n');
    process.exit(1);
  }

  console.log(`\n📨 Email User: ${process.env.EMAIL_USER}`);
  console.log(`🔐 Password Length: ${process.env.EMAIL_PASSWORD.length} characters`);
  console.log(`🏠 SMTP Host: ${process.env.EMAIL_HOST}`);
  console.log(`🔌 SMTP Port: ${process.env.EMAIL_PORT}\n`);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    console.log('🔄 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');
    
    // Send test email
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: `"RentRide Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '✅ RentRide Email Configuration Test',
      text: 'If you receive this email, your email configuration is working perfectly!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
            <h1 style="color: #13c8ec;">✅ Email Configuration Successful!</h1>
            <p style="color: #333; font-size: 16px;">
              Your RentRide backend email configuration is working perfectly!
            </p>
            <p style="color: #666; font-size: 14px;">
              Sent at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
            </p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">
              This is a test email from RentRide Backend
            </p>
          </div>
        </div>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log(`\n✉️  Check your inbox: ${process.env.EMAIL_USER}\n`);
    console.log('═'.repeat(60));
    console.log('✅ EMAIL CONFIGURATION: PASSED\n');
  } catch (error) {
    console.error('\n❌ EMAIL CONNECTION FAILED!\n');
    console.error('Error:', error.message);
    console.log('\n⚠️  Common Issues:');
    console.log('   1. Using regular Gmail password instead of App Password');
    console.log('   2. 2-Step Verification not enabled on Gmail account');
    console.log('   3. Incorrect email or app password');
    console.log('   4. Spaces in app password (remove all spaces)');
    console.log('\n📖 How to fix:');
    console.log('   1. Enable 2-Step Verification: https://myaccount.google.com/security');
    console.log('   2. Generate App Password: https://myaccount.google.com/apppasswords');
    console.log('   3. Use the 16-character app password (no spaces)\n');
    console.log('═'.repeat(60));
    process.exit(1);
  }
};

testEmailConnection();
