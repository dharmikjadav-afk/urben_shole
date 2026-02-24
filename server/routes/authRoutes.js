const express = require("express");
const router = express.Router();

// Middleware
const protect = require("../middleware/authMiddleware");

// Controllers
const authController = require("../controllers/authController");

// ================= AUTH ROUTES =================

// Register
router.post("/register", authController.registerUser);

// Login
router.post("/login", authController.loginUser);

router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);

// Get profile (protected)
router.get("/profile", protect, authController.getUserProfile);

module.exports = router;
