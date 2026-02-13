const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "user", // user | admin (future)
    },

    // ===== Email OTP Verification Fields =====
    isVerified: {
      type: Boolean,
      default: false, // user must verify OTP
    },

    otp: {
      type: String,
    },

    otpExpire: {
      type: Date,
    },
    // ==========================================

    // ===== Forgot Password Fields =====
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },
    // ===================================
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
