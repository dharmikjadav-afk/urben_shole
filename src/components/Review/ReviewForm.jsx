import { useState, useEffect } from "react";
import axios from "../../api/api"; // ⭐ use project axios
import { useNavigate } from "react-router-dom";
import "./Review.css";

function ReviewForm({ productId, user, token, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // ===============================
  // Check Verified Buyer
  // ===============================
  useEffect(() => {
    const checkVerification = async () => {
      if (!user || !token) {
        setVerified(false);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/reviews/verify/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setVerified(res.data.verified);
      } catch (error) {
        console.error("Verification error:", error);
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    checkVerification();
  }, [productId, user, token]);

  // ===============================
  // Submit Review
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(
        "/api/reviews",
        {
          productId,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setComment("");
      setRating(5);
      setMessage("Review submitted successfully");

      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to submit review");
    }
  };

  // ===============================
  // UI Cases
  // ===============================

  // Not logged in
  if (!user) {
    return (
      <div className="review-box">
        <p>Please login to write a review.</p>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    );
  }

  if (loading) {
    return <p className="review-loading">Checking verification...</p>;
  }

  // Not verified buyer
  if (!verified) {
    return (
      <div className="review-box">
        <p style={{ color: "red" }}>
          You are not a verified buyer. Please purchase this product first.
        </p>
        <button onClick={() => navigate("/orders")}>View Your Orders</button>
      </div>
    );
  }

  // ===============================
  // Verified User Review Form
  // ===============================
  return (
    <div className="review-box">
      <h3>Write a Review</h3>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? "active" : ""}`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        {/* Comment */}
        <textarea
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
}

export default ReviewForm;
