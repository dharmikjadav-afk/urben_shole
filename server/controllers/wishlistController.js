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

    let wishlist = await getPopulatedWishlist(userId);

    if (!wishlist) {
      wishlist = await getOrCreateWishlist(userId);
    }

    res.json({ products: wishlist.products });
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

    // Create wishlist if not exists
    await getOrCreateWishlist(userId);

    // MongoDB safe add (no duplicate)
    await Wishlist.findOneAndUpdate(
      { user: userId },
      { $addToSet: { products: productId } }, // prevents duplicates
      { new: true },
    );

    const updatedWishlist = await getPopulatedWishlist(userId);

    res.json({ products: updatedWishlist.products });
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

    await Wishlist.findOneAndUpdate(
      { user: userId },
      { $pull: { products: productId } },
      { new: true },
    );

    const updatedWishlist = await getPopulatedWishlist(userId);

    res.json({ products: updatedWishlist.products });
  } catch (error) {
    console.error("Remove Wishlist Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= CLEAR WISHLIST =================
exports.clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    await Wishlist.findOneAndUpdate(
      { user: userId },
      { $set: { products: [] } },
      { new: true },
    );

    res.json({ products: [] });
  } catch (error) {
    console.error("Clear Wishlist Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
