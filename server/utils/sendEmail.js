const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    // Verify connection (helps detect errors)
    await transporter.verify();

    const mailOptions = {
      from: `"UrbanSole" <${process.env.EMAIL}>`,
      to: to,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully to:", to);
  } catch (error) {
    console.error("Email Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
