const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Import controller
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");

// ================= WISHLIST ROUTES =================

// Get user wishlist
router.get("/", authMiddleware, getWishlist);

// Add product to wishlist
router.post("/add", authMiddleware, addToWishlist);

// Remove product from wishlist
router.post("/remove", authMiddleware, removeFromWishlist);

// Clear wishlist (optional)
router.post("/clear", authMiddleware, clearWishlist);

module.exports = router;
