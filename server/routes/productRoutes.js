const express = require("express");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// ======================================================
// GET ALL PRODUCTS
// Supports:
// ?category=men
// ?search=shoe
// ======================================================
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    // Filter by category (men, women, kids)
    if (category) {
      filter.category = category;
    }

    // Search by product name
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ======================================================
// GET SINGLE PRODUCT
// ======================================================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ======================================================
// CREATE PRODUCT (ADMIN)
// ======================================================
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, category, image, countInStock } =
      req.body;

    if (!name || !price || !category || !image) {
      return res.status(400).json({
        message: "Required fields: name, price, category, image",
      });
    }

    const product = await Product.create({
      name,
      description: description || "",
      price,
      category,
      image,
      countInStock: countInStock || 0,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
