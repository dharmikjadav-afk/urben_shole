const Cart = require("../models/Cart");
const mongoose = require("mongoose");

// ================= FORMAT CART FOR FRONTEND =================
const formatCart = (cart) => {
  if (!cart || !cart.items) return [];

  return cart.items
    .filter((item) => item.product)
    .map((item) => ({
      _id: item.product._id,
      id: item.product._id,
      name: item.product.name || "Product",
      price: Number(item.product.price) || 0,
      image: item.product.image || "",
      qty: Number(item.qty) || 1,
      size: item.size || 8,
    }));
};

// ================= HELPER =================
const getPopulatedCart = async (userId) => {
  return await Cart.findOne({ user: userId }).populate("items.product");
};

// ================= GET CART =================
exports.getCart = async (req, res) => {
  try {
    const cart = await getPopulatedCart(req.user.id);
    if (!cart) return res.json({ items: [] });

    res.json({ items: formatCart(cart) });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= ADD TO CART (FINAL FIX) =================
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, size = 8 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID required" });
    }

    const productObjectId = new mongoose.Types.ObjectId(productId);

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // 🔥 Match by product + size
    const index = cart.items.findIndex(
      (item) =>
        item.product.toString() === productObjectId.toString() &&
        item.size === size,
    );

    if (index > -1) {
      cart.items[index].qty += 1;
    } else {
      cart.items.push({
        product: productObjectId,
        qty: 1,
        size,
      });
    }

    await cart.save();

    const updatedCart = await getPopulatedCart(userId);
    res.json({ items: formatCart(updatedCart) });
  } catch (error) {
    console.error("Add To Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DECREASE QTY =================
exports.decreaseQty = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, size = 8 } = req.body;

    const productObjectId = new mongoose.Types.ObjectId(productId);

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.json({ items: [] });

    const index = cart.items.findIndex(
      (item) =>
        item.product.toString() === productObjectId.toString() &&
        item.size === size,
    );

    if (index > -1) {
      if (cart.items[index].qty > 1) {
        cart.items[index].qty -= 1;
      } else {
        cart.items.splice(index, 1);
      }

      await cart.save();
    }

    const updatedCart = await getPopulatedCart(userId);
    res.json({ items: formatCart(updatedCart) });
  } catch (error) {
    console.error("Decrease Qty Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= REMOVE FROM CART =================
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, size = 8 } = req.body;

    const productObjectId = new mongoose.Types.ObjectId(productId);

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.json({ items: [] });

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productObjectId.toString() &&
          item.size === size
        ),
    );

    await cart.save();

    const updatedCart = await getPopulatedCart(userId);
    res.json({ items: formatCart(updatedCart) });
  } catch (error) {
    console.error("Remove From Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= CLEAR CART =================
exports.clearCart = async (req, res) => {
  try {
    await Cart.updateOne({ user: req.user.id }, { $set: { items: [] } });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Clear Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
