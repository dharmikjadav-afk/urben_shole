const Review = require("../models/Review");
const Order = require("../models/Order");

// ======================================
// Helper: Check if user purchased product
// Supports both productId and product fields
// ======================================
const hasUserPurchasedProduct = async (userId, productId) => {
  const orders = await Order.find({ user: userId }).select("items");

  return orders.some(
    (order) =>
      order.items &&
      order.items.some((item) => {
        // Case 1: productId stored
        if (item.productId) {
          return item.productId.toString() === productId.toString();
        }

        // Case 2: product stored as reference
        if (item.product) {
          return item.product.toString() === productId.toString();
        }

        return false;
      }),
  );
};

// ======================================
// ADD REVIEW (Verified Buyer Only)
// ======================================
exports.addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const username = req.user.username;
    const { productId, rating, comment } = req.body;

    // Validate input
    if (!productId || !rating || !comment) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Rating validation
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // Check purchase
    const hasPurchased = await hasUserPurchasedProduct(userId, productId);

    if (!hasPurchased) {
      return res.status(403).json({
        message:
          "You are not a verified buyer. Please purchase this product first.",
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      user: userId,
      productId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    // Create review
    const review = new Review({
      user: userId,
      username,
      productId,
      rating,
      comment,
      verifiedPurchase: true,
    });

    await review.save();

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================================
// GET REVIEWS FOR A PRODUCT
// ======================================
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).sort({
      createdAt: -1,
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================================
// CHECK VERIFIED BUYER
// ======================================
exports.checkVerifiedBuyer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const hasPurchased = await hasUserPurchasedProduct(userId, productId);

    res.status(200).json({
      verified: hasPurchased,
    });
  } catch (error) {
    console.error("Verify Buyer Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================================
// UPDATE REVIEW
// ======================================
exports.updateReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Only owner can edit
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Validate rating
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Rating must be between 1 and 5",
        });
      }
      review.rating = rating;
    }

    // Validate comment
    if (comment !== undefined) {
      if (comment.trim() === "") {
        return res.status(400).json({
          message: "Comment cannot be empty",
        });
      }
      review.comment = comment;
    }

    await review.save();

    res.json({
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("Update Review Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================================
// DELETE REVIEW
// ======================================
exports.deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Only owner can delete
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();

    res.json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
