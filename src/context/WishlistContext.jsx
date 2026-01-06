import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

function WishlistProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user?.email) {
      const storedWishlist =
        JSON.parse(localStorage.getItem(`wishlist_${user.email}`)) || [];
      setWishlist(storedWishlist);
    } else {
      setWishlist([]); 
    }
  }, [user]);


  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const addToWishlist = (product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (!exists) {
      setWishlist([...wishlist, product]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
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
