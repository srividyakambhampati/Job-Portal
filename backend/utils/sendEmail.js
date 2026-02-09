const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Check if credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
        process.env.EMAIL_USER === 'your-email@gmail.com' ||
        process.env.EMAIL_PASS === 'your-app-password') {
        console.warn('⚠️ Email SKIPPED: To enable emails, update EMAIL_PASS in backend/.env with a real Google App Password.');
        return false;
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE, // e.g., Gmail, Outlook
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Define email options
    const mailOptions = {
        from: `JobPortal <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('❌ Email Error:', error.message);
        return false;
    }
};

module.exports = sendEmail;
