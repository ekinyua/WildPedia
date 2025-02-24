// services/email.service.js

const nodemailer = require('nodemailer');
const logger = require('../logger');  

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const emailService = {
  async sendVerificationEmail(user, verificationToken) {
    logger.info(`Attempting to send verification email to ${user.email}`);

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Verify Your Email - WildPedia',
      html: `
        <h2>Welcome to WildPedia!</h2>
        <p>Thank you for registering. Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      `
    };

    try {
      logger.info('Email configuration:', {
        from: process.env.SMTP_FROM,
        to: user.email,
        url: verificationUrl
      });

      await transporter.sendMail(mailOptions);
      logger.info(`Verification email sent successfully to ${user.email}`);
      return true;
    } catch (error) {
      logger.error('Error sending verification email:', error);
      return false;
    }
  }
};

module.exports = emailService;