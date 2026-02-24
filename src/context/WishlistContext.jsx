import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

function WishlistProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  const API_URL = "http://localhost:5000/api/wishlist";

  // Helper: get product unique id
  const getProductId = (product) => (product?._id || product?.id)?.toString();

  // ==============================
  // Load wishlist from backend
  // ==============================
  useEffect(() => {
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

    fetchWishlist();
  }, [user]);

  // ==============================
  // Add to wishlist
  // ==============================
  const addToWishlist = async (product) => {
    const productId = getProductId(product);

    // Prevent duplicate in UI (important)
    const exists = wishlist.some((item) => getProductId(item) === productId);
    if (exists) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setWishlist(res.data.products || []);
    } catch (error) {
      console.log("Error adding to wishlist:", error);
    }
  };

  // ==============================
  // Remove from wishlist
  // ==============================
  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/remove`,
        { productId: productId.toString() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setWishlist(res.data.products || []);
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
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistProvider;
