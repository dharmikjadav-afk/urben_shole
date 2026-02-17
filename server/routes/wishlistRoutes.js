const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const authMiddleware = require("../middleware/authMiddleware");

// Get Wishlist
router.get("/", authMiddleware, async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
    "products",
  );

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user.id, products: [] });
  }

  res.json(wishlist);
});

// Add to Wishlist
router.post("/add", authMiddleware, async (req, res) => {
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user.id, products: [] });
  }

  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
  }

  await wishlist.save();
  res.json(wishlist);
});

// Remove from Wishlist
router.post("/remove", authMiddleware, async (req, res) => {
  const { productId } = req.body;

  const wishlist = await Wishlist.findOne({ user: req.user.id });

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId,
  );

  await wishlist.save();
  res.json(wishlist);
});

module.exports = router;
