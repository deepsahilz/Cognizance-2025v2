const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

const send2FAEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Your App" <noreply@yourdomain.com>`,
      to: email,
      subject: "Your 2FA Code",
      html: `<h1>Your 2FA Code is: ${otp}</h1>`,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
};

module.exports = { transporter, send2FAEmail };
