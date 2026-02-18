const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourgmail@gmail.com",
    pass: "your_app_password",
  },
});

transporter.sendMail({
  from: "UrbanSole",
  to: "yourgmail@gmail.com",
  subject: "Test Mail",
  text: "If you see this, email is working!",
})
.then(() => console.log("Email sent"))
.catch(err => console.log("Error:", err));