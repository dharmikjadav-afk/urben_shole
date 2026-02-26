import axios from "axios";

// Base URL (change if deployed)
const API_URL = "http://localhost:5000/api/reviews";

// ======================================
// Get all reviews for a product
// ======================================
export const getProductReviews = async (productId) => {
  try {
    const res = await axios.get(`${API_URL}/${productId}`);
    return res.data;
  } catch (error) {
    console.error("Get reviews error:", error);
    throw error;
  }
};

// ======================================
// Check if user is verified buyer
// ======================================
export const checkVerifiedBuyer = async (productId, token) => {
  try {
    const res = await axios.get(`${API_URL}/verify/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.verified;
  } catch (error) {
    console.error("Verify buyer error:", error);
    throw error;
  }
};

// ======================================
// Add Review
// ======================================
export const addReview = async (reviewData, token) => {
  try {
    const res = await axios.post(API_URL, reviewData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Add review error:", error);
    throw error;
  }
};

// ======================================
// Update Review (Edit)
// ======================================
export const updateReview = async (reviewId, reviewData, token) => {
  try {
    const res = await axios.put(`${API_URL}/${reviewId}`, reviewData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Update review error:", error);
    throw error;
  }
};

// ======================================
// Delete Review
// ======================================
export const deleteReview = async (reviewId, token) => {
  try {
    const res = await axios.delete(`${API_URL}/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Delete review error:", error);
    throw error;
  }
};