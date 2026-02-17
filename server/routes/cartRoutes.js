const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const authMiddleware = require("../middleware/authMiddleware");

// Get Cart
router.get("/", authMiddleware, async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.productId",
  );

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  res.json(cart);
});

// Add to Cart
router.post("/add", authMiddleware, async (req, res) => {
  const { productId } = req.body;

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId,
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += 1;
  } else {
    cart.items.push({ productId, quantity: 1 });
  }

  await cart.save();
  res.json(cart);
});

// Remove from Cart
router.post("/remove", authMiddleware, async (req, res) => {
  const { productId } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId,
  );

  await cart.save();
  res.json(cart);
});

module.exports = router;
