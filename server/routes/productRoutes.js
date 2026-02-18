const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// Import controller
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// ======================================================
// PUBLIC ROUTES
// ======================================================

// Get all products
// Supports:
// ?category=men
// ?search=shoe
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);

// ======================================================
// ADMIN ROUTES
// ======================================================

// Create product
router.post("/", protect, adminOnly, createProduct);

// Update product
router.put("/:id", protect, adminOnly, updateProduct);

// Delete product
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
