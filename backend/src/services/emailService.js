const sendEmail = require('../utils/sendEmail');

exports.sendBookingConfirmation = async (user, booking) => {
    const message = `Dear ${user.name},\n\nYour booking request for has been received.\n\nBooking ID: ${booking._id}\nStart Date: ${booking.startDate}\nEnd Date: ${booking.endDate}\nTotal Price: $${booking.totalPrice}\n\nWe will notify you once it is confirmed.\n\nThank you for choosing RentRide!`;

    await sendEmail({
        email: user.email,
        subject: 'RentRide - Booking Received',
        message
    });
};

exports.sendWelcomeEmail = async (user) => {
    const message = `Welcome to RentRide, ${user.name}!\n\nWe are excited to have you on board. Start exploring our premium cars today!`;

    await sendEmail({
        email: user.email,
        subject: 'Welcome to RentRide',
        message
    });
};
