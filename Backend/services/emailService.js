const nodemailer = require('nodemailer');

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Send OTP email
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 * @param {string} purpose - Purpose of OTP (registration, password reset, etc.)
 * @returns {Promise<Object>} - Email send result
 */
const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  try {
    // Only send if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[EMAIL SERVICE] Email not configured. OTP for ${email}: ${otp}`);
      return { success: true, message: 'OTP logged (email not configured)' };
    }

    const transporter = createTransporter();

    const purposes = {
      registration: 'Email Verification',
      password_reset: 'Password Reset',
      verification: 'Email Verification'
    };

    const subject = purposes[purpose] || 'Verification Code';

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Appzeto <noreply@appzeto.com>',
      to: email,
      subject: `${subject} - Appzeto`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00a6a6;">${subject}</h2>
          <p>Your verification code is:</p>
          <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #00a6a6; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome email
 * @param {string} email - Recipient email
 * @param {string} name - User name
 * @returns {Promise<Object>} - Email send result
 */
const sendWelcomeEmail = async (email, name) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[EMAIL SERVICE] Welcome email not sent (email not configured) for ${email}`);
      return { success: true };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Appzeto <noreply@appzeto.com>',
      to: email,
      subject: 'Welcome to Appzeto!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00a6a6;">Welcome to Appzeto, ${name}!</h2>
          <p>Thank you for joining Appzeto. We're excited to have you on board!</p>
          <p>You can now start booking services and enjoy our platform.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Welcome email send error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail
};

