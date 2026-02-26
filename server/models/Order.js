const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    // MongoDB reference (existing - keep)
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    // NEW: String productId (for frontend/static products & review system)
    productId: {
      type: String,
      required: true,
    },

    qty: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    // Shipping Address
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      default: "COD",
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,
    deliveredAt: Date,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
