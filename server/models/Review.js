const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // User who wrote the review
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Product ID (string because your products come from frontend data/images)
    productId: {
      type: String,
      required: true,
    },

    // User name (for quick display without extra query)
    username: {
      type: String,
      required: true,
    },

    // Star rating (1 to 5)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Review comment
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    // Verified buyer flag
    verifiedPurchase: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  },
);

// Prevent multiple reviews by same user for same product
reviewSchema.index({ user: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
