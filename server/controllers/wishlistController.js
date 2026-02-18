const Wishlist = require("../models/Wishlist");

// ================= HELPER =================

// Get or create wishlist
const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [],
    });
  }

  return wishlist;
};

// Get populated wishlist
const getPopulatedWishlist = async (userId) => {
  return await Wishlist.findOne({ user: userId }).populate("products");
};

// ================= GET WISHLIST =================
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await getPopulatedWishlist(userId);

    if (!wishlist) {
      return res.json({ user: userId, products: [] });
    }

    res.json(wishlist);
  } catch (error) {
    console.error("Get Wishlist Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= ADD TO WISHLIST =================
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const wishlist = await getOrCreateWishlist(userId);

    // Check duplicate
    const exists = wishlist.products.find((id) => id.toString() === productId);

    if (!exists) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const updatedWishlist = await getPopulatedWishlist(userId);
    res.json(updatedWishlist);
  } catch (error) {
    console.error("Add Wishlist Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= REMOVE FROM WISHLIST =================
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const wishlist = await getOrCreateWishlist(userId);

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId,
    );

    await wishlist.save();

    const updatedWishlist = await getPopulatedWishlist(userId);
    res.json(updatedWishlist);
  } catch (error) {
    console.error("Remove Wishlist Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= CLEAR WISHLIST =================
exports.clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await getOrCreateWishlist(userId);
    wishlist.products = [];

    await wishlist.save();

    res.json({ message: "Wishlist cleared" });
  } catch (error) {
    console.error("Clear Wishlist Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
