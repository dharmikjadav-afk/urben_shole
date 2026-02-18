import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

function WishlistProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  // Helper: get product unique id (supports id or _id)
  const getProductId = (product) => product._id || product.id;

  // Load wishlist from localStorage when user changes
  useEffect(() => {
    if (user?.email) {
      const storedWishlist =
        JSON.parse(localStorage.getItem(`wishlist_${user.email}`)) || [];
      setWishlist(storedWishlist);
    } else {
      setWishlist([]);
    }
  }, [user]);

  // Save wishlist to localStorage
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  // Add to wishlist
  const addToWishlist = (product) => {
    const productId = getProductId(product);

    const exists = wishlist.some((item) => getProductId(item) === productId);

    if (!exists) {
      setWishlist((prev) => [...prev, product]);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => getProductId(item) !== id));
  };

  // Check if product is in wishlist (for heart fill)
  const isInWishlist = (id) => {
    return wishlist.some((item) => getProductId(item) === id);
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
