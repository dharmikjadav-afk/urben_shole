import { useState, useEffect } from "react";
import axios from "axios";
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
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/reviews/verify/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setVerified(res.data.verified);
      } catch (error) {
        console.error("Verification error:", error);
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
        "http://localhost:5000/api/reviews",
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

      // Refresh review list
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
    return <p>Checking verification...</p>;
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
        <div style={{ marginBottom: "10px" }}>
          <label>Rating: </label>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                cursor: "pointer",
                fontSize: "20px",
                color: star <= rating ? "gold" : "gray",
                marginRight: "5px",
              }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Comment */}
        <div>
          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows="4"
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
}

export default ReviewForm;
