const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Database connection
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const reviewRoutes = require("./routes/reviewRoutes"); // ✅ NEW

// Initialize app
const app = express();

// ================= DATABASE =================
connectDB();

// ================= MIDDLEWARE =================

// Parse JSON
app.use(express.json());

// CORS (allow frontend)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  }),
);

// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes); // ✅ NEW ROUTE

// Health check
app.get("/", (req, res) => {
  res.send("UrbanSole Backend is running");
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({
    message: "Server error",
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
