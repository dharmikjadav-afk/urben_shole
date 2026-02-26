const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Import controller
const {
  getCart,
  addToCart,
  decreaseQty,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

// ================= CART ROUTES =================

// Get user cart
router.get("/", authMiddleware, getCart);

// Add product to cart
router.post("/add", authMiddleware, addToCart);

// Decrease quantity
router.post("/decrease", authMiddleware, decreaseQty);

// Remove product completely
router.post("/remove", authMiddleware, removeFromCart);

// Clear entire cart
// Support both POST and DELETE (safe for all cases)
router.post("/clear", authMiddleware, clearCart);
router.delete("/clear", authMiddleware, clearCart);

module.exports = router;