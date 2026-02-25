const mongoose = require("mongoose");

// ================= CART ITEM =================
const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    qty: {
      type: Number,
      default: 1,
      min: 1,
    },
    size: {
      type: Number,
      default: 8,
    },
  },
  {
    _id: false, // no separate _id for each item (cleaner)
  },
);

// ================= CART SCHEMA =================
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one cart per user
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false, // prevents VersionError (__v issues)
  },
);

// ================= MODEL =================
module.exports = mongoose.model("Cart", cartSchema);
