const Order = require("../models/Order");
const Cart = require("../models/Cart");

// ================= CREATE ORDER =================
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    // Get user cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate subtotal from cart (secure)
    const calculatedSubtotal = cart.items.reduce(
      (total, item) => total + item.product.price * item.qty,
      0,
    );

    const GST_RATE = 0.18;
    const PLATFORM_FEE = 20;

    const gstAmount = Math.round(calculatedSubtotal * GST_RATE);
    const finalTotal = calculatedSubtotal + gstAmount + PLATFORM_FEE;

    const method = (paymentMethod || "cod").toLowerCase();

    // Create order
    const order = await Order.create({
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        qty: item.qty,
      })),
      shippingAddress,
      paymentMethod: method,

      // Pricing
      subtotal: calculatedSubtotal,
      gst: gstAmount,
      platformFee: PLATFORM_FEE,
      totalAmount: finalTotal,

      status: "Pending",

      // Paid only for online payments
      isPaid: method !== "cod",
      paidAt: method !== "cod" ? Date.now() : null,
    });

    // Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET USER ORDERS =================
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get User Orders Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ORDER BY ID =================
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("user", "username email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Allow only owner or admin
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ALL ORDERS (ADMIN) =================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= MARK ORDER AS PAID =================
exports.markOrderPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    await order.save();

    res.json({
      message: "Order marked as paid",
      order,
    });
  } catch (error) {
    console.error("Mark Paid Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= MARK ORDER AS DELIVERED =================
exports.markOrderDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "Delivered";
    order.deliveredAt = Date.now();

    // Important: If COD, mark as paid when delivered
    if (order.paymentMethod === "cod" && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    await order.save();

    res.json({
      message: "Order marked as delivered",
      order,
    });
  } catch (error) {
    console.error("Mark Delivered Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
