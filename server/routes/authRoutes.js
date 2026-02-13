const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const protect = require("../middleware/authMiddleware");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const router = express.Router();

// ================= EMAIL TRANSPORTER =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= HELPER =================
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ======================================================
// REGISTER (SEND OTP)
// ======================================================
router.post("/register", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.trim().toLowerCase();

    let user = await User.findOne({ email });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: "User already exists" });
      }

      user.username = username;
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpire = otpExpire;
      user.isVerified = false;
      await user.save();
    } else {
      user = await User.create({
        username,
        email,
        password: hashedPassword,
        otp,
        otpExpire,
        isVerified: false,
      });
    }

    await transporter.sendMail({
      to: user.email,
      subject: "UrbanSole Email OTP Verification",
      html: `<h2>Your OTP: ${otp}</h2><p>Valid for 10 minutes</p>`,
    });

    res.status(201).json({
      message: "OTP sent to your email",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================================
// VERIFY OTP
// ======================================================
router.post("/verify-otp", async (req, res) => {
  try {
    let { email, otp } = req.body;

    email = email.trim().toLowerCase();
    otp = String(otp).trim();

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.otp)
      return res.status(400).json({ message: "Please resend OTP" });

    if (user.otpExpire < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch {
    res.status(500).json({ message: "Verification failed" });
  }
});

// ======================================================
// RESEND OTP
// ======================================================
router.post("/resend-otp", async (req, res) => {
  try {
    let { email } = req.body;
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await transporter.sendMail({
      to: user.email,
      subject: "UrbanSole OTP Resend",
      html: `<h2>${otp}</h2><p>Valid for 10 minutes</p>`,
    });

    res.json({ message: "OTP resent successfully" });
  } catch {
    res.status(500).json({ message: "Failed to resend OTP" });
  }
});

// ======================================================
// LOGIN
// ======================================================
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Not verified → send OTP again + redirect
    if (!user.isVerified) {
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      await transporter.sendMail({
        to: user.email,
        subject: "Verify your email",
        html: `<h2>${otp}</h2><p>Please verify your email</p>`,
      });

      return res.status(400).json({
        message: "Email not verified. OTP sent again.",
        redirectToVerify: true,
        email: user.email,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================================
// FORGOT PASSWORD (SEND LINK)
// ======================================================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const link = `http://localhost:5173/reset-password/${resetToken}`;

    await transporter.sendMail({
      to: user.email,
      subject: "Reset Password",
      html: `<a href="${link}">Reset Password</a>`,
    });

    res.json({ message: "Password reset link sent" });
  } catch {
    res.status(500).json({ message: "Email sending failed" });
  }
});

// ======================================================
// RESET PASSWORD (IMPORTANT - fixes your error)
// ======================================================
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.params.token;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Token invalid or expired" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch {
    res.status(500).json({ message: "Reset failed" });
  }
});

// ======================================================
router.get("/profile", protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
