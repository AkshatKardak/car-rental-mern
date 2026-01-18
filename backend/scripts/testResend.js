require('dotenv').config();
const { Resend } = require('resend');

const testResendConnection = async () => {
  console.log('\n📧 TESTING RESEND API\n');
  console.log('═'.repeat(60));

  // Check if API key exists
  if (!process.env.RESEND_API_KEY) {
    console.log('❌ Resend API key not found in .env file');
    console.log('\nAdd this to your .env file:');
    console.log('  RESEND_API_KEY=re_your_api_key_here\n');
    console.log('📖 Get your API key from: https://resend.com/api-keys\n');
    process.exit(1);
  }

  console.log(`🔑 API Key: ${process.env.RESEND_API_KEY.substring(0, 10)}...\n`);

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    console.log('📤 Sending test email...\n');

    const { data, error } = await resend.emails.send({
      from: 'RentRide <onboarding@resend.dev>',
      to: ['kardakakshat@gmail.com'], // Your email
      subject: '✅ Resend Configuration Test - RentRide Backend',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #13c8ec 0%, #a855f7 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: #000000; margin: 0; font-size: 28px; font-weight: bold;">
                  🚗 RentRide
                </h1>
                <p style="color: rgba(0,0,0,0.8); margin: 10px 0 0 0; font-size: 14px;">
                  Email Configuration Test
                </p>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px;">
                <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; border-radius: 5px; margin-bottom: 30px;">
                  <h2 style="color: #065f46; margin: 0 0 5px 0; font-size: 20px;">
                    ✅ Email Configuration Successful!
                  </h2>
                  <p style="color: #047857; margin: 0; font-size: 14px;">
                    Your RentRide backend can now send emails via Resend.
                  </p>
                </div>

                <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">
                  Configuration Details:
                </h3>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                  <tr>
                    <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold; color: #374151; width: 40%;">
                      Service
                    </td>
                    <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e7eb; color: #6b7280;">
                      Resend Email API
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold; color: #374151;">
                      Status
                    </td>
                    <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e7eb; color: #10b981; font-weight: bold;">
                      ✓ Connected
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold; color: #374151;">
                      Environment
                    </td>
                    <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e7eb; color: #6b7280;">
                      ${process.env.NODE_ENV || 'development'}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold; color: #374151;">
                      Timestamp
                    </td>
                    <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e7eb; color: #6b7280;">
                      ${new Date().toLocaleString('en-IN', { 
                        timeZone: 'Asia/Kolkata',
                        dateStyle: 'full',
                        timeStyle: 'long'
                      })}
                    </td>
                  </tr>
                </table>

                <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 5px; margin-bottom: 30px;">
                  <p style="margin: 0; color: #1e40af; font-size: 14px;">
                    <strong>💡 Next Steps:</strong><br>
                    Your backend is now configured to send:<br>
                    • Welcome emails<br>
                    • Booking confirmations<br>
                    • Password reset emails<br>
                    • Payment receipts
                  </p>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                  <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" 
                     style="display: inline-block; background: linear-gradient(135deg, #13c8ec 0%, #a855f7 100%); color: #000000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Visit RentRide Dashboard
                  </a>
                </div>
              </div>

              <!-- Footer -->
              <div style="background-color: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #6b7280; font-size: 12px; text-align: center;">
                  This is an automated test email from RentRide Backend<br>
                  Powered by Resend • ${new Date().getFullYear()}
                </p>
              </div>

            </div>
          </body>
        </html>
      `,
      text: `
RentRide - Email Configuration Test

✅ Email Configuration Successful!

Your RentRide backend can now send emails via Resend.

Configuration Details:
- Service: Resend Email API
- Status: Connected
- Environment: ${process.env.NODE_ENV || 'development'}
- Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Next Steps:
Your backend is now configured to send:
• Welcome emails
• Booking confirmations
• Password reset emails
• Payment receipts

---
This is an automated test email from RentRide Backend
Powered by Resend • ${new Date().getFullYear()}
      `
    });

    if (error) {
      throw error;
    }

    console.log('✅ Resend email sent successfully!');
    console.log(`📬 Email ID: ${data.id}`);
    console.log(`✉️  Check your inbox: kardakakshat@gmail.com\n`);
    
    console.log('📊 Email Details:');
    console.log(`   From: RentRide <onboarding@resend.dev>`);
    console.log(`   To: kardakakshat@gmail.com`);
    console.log(`   Subject: ✅ Resend Configuration Test - RentRide Backend\n`);

    console.log('═'.repeat(60));
    console.log('✅ RESEND API: PASSED\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ RESEND SENDING FAILED!\n');
    console.error('Error:', error.message || error);
    
    console.log('\n⚠️  Common Issues:');
    console.log('   1. Invalid API key (must start with "re_")');
    console.log('   2. API key not activated');
    console.log('   3. Free tier limit reached (100 emails/day)');
    console.log('   4. Network connectivity issue');
    console.log('   5. Incorrect email format');
    
    console.log('\n🔧 Troubleshooting:');
    console.log('   • Verify API key: https://resend.com/api-keys');
    console.log('   • Check usage: https://resend.com/emails');
    console.log('   • Ensure key has "Sending access" permission');
    
    console.log('\n📖 Documentation: https://resend.com/docs/send-with-nodejs\n');
    console.log('═'.repeat(60));
    
    process.exit(1);
  }
};

testResendConnection();
