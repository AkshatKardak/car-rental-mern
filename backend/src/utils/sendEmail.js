const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const { data, error } = await resend.emails.send({
      from: options.from || 'RentRide <onboarding@resend.dev>',
      to: [options.email || options.to],
      subject: options.subject,
      html: options.html || `<p>${options.message || options.text}</p>`,
      text: options.text || options.message,
      reply_to: options.replyTo || process.env.EMAIL_USER || 'noreply@rentride.com'
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log('✅ Email sent successfully:', data.id);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

module.exports = sendEmail;
