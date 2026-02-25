import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

function WishlistProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  const API_URL = "http://localhost:5000/api/wishlist";

  // Helper: support both id and _id
  const getProductId = (product) => (product?._id || product?.id)?.toString();

  // ==============================
  // Fetch Wishlist (Reusable)
  // ==============================
  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token || !user) {
        setWishlist([]);
        return;
      }

      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist(res.data.products || []);
    } catch (error) {
      console.log("Error fetching wishlist:", error);
      setWishlist([]);
    }
  };

  // Load when user changes
  useEffect(() => {
    fetchWishlist();
  }, [user]);

  // ==============================
  // Add to wishlist
  // ==============================
  const addToWishlist = async (product) => {
    const productId = getProductId(product);
    if (!productId) return;

    // Prevent duplicate in UI
    const exists = wishlist.some((item) => getProductId(item) === productId);
    if (exists) return;

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchWishlist(); // Refresh from backend
    } catch (error) {
      console.log("Error adding to wishlist:", error);
    }
  };

  // ==============================
  // Remove from wishlist
  // ==============================
  const removeFromWishlist = async (productId) => {
    if (!productId) return;

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/remove`,
        { productId: productId.toString() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchWishlist(); // Refresh
    } catch (error) {
      console.log("Error removing from wishlist:", error);
    }
  };

  // ==============================
  // Check product in wishlist
  // ==============================
  const isInWishlist = (id) => {
    const productId = id?.toString();
    return wishlist.some((item) => getProductId(item) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        fetchWishlist, // useful if needed elsewhere
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistProvider;
