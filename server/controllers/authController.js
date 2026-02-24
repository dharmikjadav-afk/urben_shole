const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// ================= HELPER: GENERATE TOKEN =================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required",
      });
    }

    email = email.trim().toLowerCase();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      username,
      email,
      password,
      otp,
      otpExpire: Date.now() + 10 * 60 * 1000,
    });

    console.log("Sending OTP to:", email);

    const html = `
      <h2>UrbanSole Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 10 minutes.</p>
    `;

    await sendEmail(email, "UrbanSole OTP Verification", html);

    console.log("OTP Email sent");

    res.status(201).json({
      message: "Registration successful. OTP sent to email.",
      userId: user._id,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET PROFILE =================
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check OTP
    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Verify user
    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.json({
      message: "Email verified successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    console.log("Resending OTP to:", email);

    const html = `
      <h2>UrbanSole Email Verification</h2>
      <p>Your new OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 10 minutes.</p>
    `;

    await sendEmail(email, "UrbanSole OTP Resend", html);

    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
