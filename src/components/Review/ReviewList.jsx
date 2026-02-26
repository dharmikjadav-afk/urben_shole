import { useEffect, useState } from "react";
import axios from "axios";
import { updateReview, deleteReview } from "../../services/reviewService";
import "./Review.css";

function ReviewList({ productId, refreshTrigger }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ===============================
  // Safe user parsing
  // ===============================
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  // ===============================
  // Fetch Reviews
  // ===============================
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/reviews/${productId}`,
      );
      setReviews(res.data);
    } catch (error) {
      console.error("Fetch reviews error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, refreshTrigger]);

  // ===============================
  // Edit Review
  // ===============================
  const handleEdit = async (review) => {
    const newRating = prompt("Enter rating (1-5):", review.rating);
    if (newRating === null) return;

    const ratingNumber = Number(newRating);
    if (ratingNumber < 1 || ratingNumber > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }

    const newComment = prompt("Edit comment:", review.comment);
    if (newComment === null || newComment.trim() === "") return;

    try {
      await updateReview(
        review._id,
        {
          rating: ratingNumber,
          comment: newComment,
        },
        token,
      );

      fetchReviews();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update review");
    }
  };

  // ===============================
  // Delete Review
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await deleteReview(id, token);
      fetchReviews();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete review");
    }
  };

  // ===============================
  // Summary Calculation
  // ===============================
  const totalReviews = reviews.length;

  const averageRating =
    totalReviews === 0
      ? 0
      : (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(
          1,
        );

  const ratingCount = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length,
  );

  // ===============================
  // Loading
  // ===============================
  if (loading) {
    return <p className="review-loading">Loading reviews...</p>;
  }

  // ===============================
  // Empty
  // ===============================
  if (reviews.length === 0) {
    return (
      <p className="review-empty">
        No reviews yet. Be the first to review this product!
      </p>
    );
  }

  return (
    <div className="review-list">
      <h3 className="review-title">Customer Reviews</h3>

      {/* ================= SUMMARY ================= */}
      <div className="review-summary">
        <div className="avg-rating-box">
          <div className="avg-rating-number">
            {averageRating} <span>★</span>
          </div>
          <p>{totalReviews} Reviews</p>
        </div>

        <div className="rating-bars">
          {[5, 4, 3, 2, 1].map((star, index) => {
            const count = ratingCount[index];
            const percent =
              totalReviews === 0 ? 0 : (count / totalReviews) * 100;

            return (
              <div key={star} className="bar-row">
                <span>{star}★</span>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${percent}%` }} />
                </div>
                <span className="bar-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= REVIEWS ================= */}
      {reviews.map((review) => {
        // Owner check (works for both string and populated object)
        const reviewUserId =
          typeof review.user === "object" ? review.user._id : review.user;

        const isOwner =
          user && reviewUserId && reviewUserId.toString() === user._id;

        return (
          <div key={review._id} className="review-card">
            <div className="review-user">
              {review.username}

              {review.verifiedPurchase && (
                <span className="verified-badge">Verified Buyer</span>
              )}
            </div>

            <div className="review-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>{star <= review.rating ? "★" : "☆"}</span>
              ))}
            </div>

            <p className="review-comment">{review.comment}</p>

            <span className="review-date">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>

            {/* ACTIONS */}
            {isOwner && (
              <div className="review-actions">
                <button className="edit-btn" onClick={() => handleEdit(review)}>
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(review._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ReviewList;
