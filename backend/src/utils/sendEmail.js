const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Define email options
    const message = {
        from: `${process.env.FROM_NAME || 'RentRide'} <${process.env.FROM_EMAIL || 'noreply@rentride.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html // Optional if we want HTML emails
    };

    // Send email
    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
