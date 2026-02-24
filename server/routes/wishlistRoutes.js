const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Import controllers
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");

// ================= WISHLIST ROUTES =================

// Get logged-in user's wishlist
// GET /api/wishlist
router.get("/", authMiddleware, getWishlist);

// Add product to wishlist
// POST /api/wishlist/add
// Body: { productId }
router.post("/add", authMiddleware, addToWishlist);

// Remove product from wishlist
// POST /api/wishlist/remove
// Body: { productId }
router.post("/remove", authMiddleware, removeFromWishlist);

// Clear entire wishlist (optional)
// POST /api/wishlist/clear
router.post("/clear", authMiddleware, clearWishlist);

module.exports = router;
