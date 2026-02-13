const nodemailer = require("nodemailer");

const sendEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourgmail@gmail.com",
      pass: "your_app_password",
    },
  });

  const verifyLink = `http://localhost:5173/verify/${token}`;

  await transporter.sendMail({
    from: "UrbanSole",
    to: email,
    subject: "Verify Your Email",
    html: `<h3>Click to verify your email</h3>
           <a href="${verifyLink}">Verify Account</a>`,
  });
};

module.exports = sendEmail;
