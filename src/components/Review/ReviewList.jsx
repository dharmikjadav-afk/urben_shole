import { useEffect, useState } from "react";
import axios from "../../api/api";
import { updateReview, deleteReview } from "../../services/reviewService";
import "./Review.css";

function ReviewList({ productId, refreshTrigger }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/reviews/${productId}`);
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

  if (loading) {
    return <p className="review-loading">Loading reviews...</p>;
  }

  if (reviews.length === 0) {
    return (
      <p className="review-empty">
        No reviews yet. Be the first to review this product!
      </p>
    );
  }

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews === 0
      ? 0
      : (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(
          1,
        );

  return (
    <div className="review-list">
      <h3 className="review-title">Customer Reviews</h3>

      {reviews.map((review) => {
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

            {isOwner && (
              <div className="review-actions">
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ReviewList;
