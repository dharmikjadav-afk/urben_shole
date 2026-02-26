const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  addReview,
  getProductReviews,
  checkVerifiedBuyer,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

// ===============================
// ADD REVIEW
// POST /api/reviews
// ===============================
router.post("/", authMiddleware, addReview);

// ===============================
// CHECK VERIFIED BUYER
// IMPORTANT: keep before /:productId
// GET /api/reviews/verify/:productId
// ===============================
router.get("/verify/:productId", authMiddleware, checkVerifiedBuyer);

// ===============================
// UPDATE REVIEW
// PUT /api/reviews/:id
// ===============================
router.put("/:id", authMiddleware, updateReview);

// ===============================
// DELETE REVIEW
// DELETE /api/reviews/:id
// ===============================
router.delete("/:id", authMiddleware, deleteReview);

// ===============================
// GET REVIEWS FOR PRODUCT
// IMPORTANT: keep this last
// GET /api/reviews/:productId
// ===============================
router.get("/:productId", getProductReviews);

module.exports = router;
