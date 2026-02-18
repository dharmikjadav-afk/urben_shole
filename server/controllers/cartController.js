const Cart = require("../models/Cart");

// ================= HELPER =================
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  return cart;
};

// Helper to return populated cart
const getPopulatedCart = async (userId) => {
  return await Cart.findOne({ user: userId }).populate("items.product");
};

// ================= GET CART =================
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await getPopulatedCart(userId);

    if (!cart) {
      return res.json({ user: userId, items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= ADD TO CART =================
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await getOrCreateCart(userId);

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.items.push({
        product: productId,
        qty: 1,
      });
    }

    await cart.save();

    const updatedCart = await getPopulatedCart(userId);
    res.json(updatedCart);
  } catch (error) {
    console.error("Add To Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DECREASE QTY =================
exports.decreaseQty = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await getOrCreateCart(userId);

    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (item) {
      item.qty -= 1;

      if (item.qty <= 0) {
        cart.items = cart.items.filter(
          (i) => i.product.toString() !== productId,
        );
      }
    }

    await cart.save();

    const updatedCart = await getPopulatedCart(userId);
    res.json(updatedCart);
  } catch (error) {
    console.error("Decrease Qty Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= REMOVE FROM CART =================
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await getOrCreateCart(userId);

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    const updatedCart = await getPopulatedCart(userId);
    res.json(updatedCart);
  } catch (error) {
    console.error("Remove From Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= CLEAR CART =================
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await getOrCreateCart(userId);
    cart.items = [];

    await cart.save();

    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Clear Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
