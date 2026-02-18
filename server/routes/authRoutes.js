const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

// Import controller functions
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");

// ================= AUTH ROUTES =================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get profile (protected)
router.get("/profile", protect, getUserProfile);

module.exports = router;
