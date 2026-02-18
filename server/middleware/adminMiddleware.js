const User = require("../models/User");

// Admin access middleware
const adminOnly = async (req, res, next) => {
  try {
    // Check if user exists from protect middleware
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, please login" });
    }

    // Get latest user data from DB (optional but safer)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check admin role
    if (user.role === "admin") {
      next(); // allow access
    } else {
      return res.status(403).json({ message: "Admin access only" });
    }
  } catch (error) {
    console.error("Admin Middleware Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = adminOnly;
