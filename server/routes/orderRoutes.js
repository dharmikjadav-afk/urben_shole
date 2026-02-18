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

// Get single order by ID
router.get("/:id", protect, getOrderById);

// ================= ADMIN ROUTES =================

// Get all orders
router.get("/", protect, adminOnly, getAllOrders);

// Mark as paid
router.put("/:id/pay", protect, adminOnly, markOrderPaid);

// Mark as delivered
router.put("/:id/deliver", protect, adminOnly, markOrderDelivered);

module.exports = router;
