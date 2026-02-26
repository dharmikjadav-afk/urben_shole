const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// Import controller
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  markOrderPaid,
  markOrderDelivered,
} = require("../controllers/orderController");

// ================= USER ROUTES =================

// Create order
router.post("/", protect, createOrder);

// Get logged-in user's orders
router.get("/my", protect, getUserOrders);

// ================= ADMIN ROUTES =================

// Get all orders (admin)
router.get("/all", protect, adminOnly, getAllOrders);

// Mark as paid
router.put("/:id/pay", protect, adminOnly, markOrderPaid);

// Mark as delivered
router.put("/:id/deliver", protect, adminOnly, markOrderDelivered);

// ================= COMMON =================

// Get single order by ID
// (Placed at bottom to avoid conflict with /my or /all)
router.get("/:id", protect, getOrderById);

module.exports = router;
