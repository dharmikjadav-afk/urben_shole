import { createContext, useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

export const CartContext = createContext();

function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  const API_URL = "http://localhost:5000/api/cart";

  // Prevent multiple API calls
  const loadingRef = useRef(false);

  // Always return string ObjectId
  const getProductId = (product) => {
    const id = product?._id || product?.id;
    return id?.toString();
  };

  // ================= Fetch Cart =================
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCart([]);
        return;
      }

      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(res.data.items || []);
    } catch (error) {
      console.log("Fetch cart error:", error);
      setCart([]);
    }
  };

  // Load cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  // Backup cart locally (optional safety)
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  // ================= Add to Cart =================
  const addToCart = async (product) => {
    if (!user || !product) return;
    if (loadingRef.current) return;

    loadingRef.current = true;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const productId = getProductId(product);
      const size = Number(product.size) || 8;

      if (!productId) return;

      const res = await axios.post(
        `${API_URL}/add`,
        {
          productId,
          size,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCart(res.data.items || []);
    } catch (error) {
      console.log("Add to cart error:", error);
    } finally {
      loadingRef.current = false;
    }
  };

  // ================= Increase Qty =================
  const increaseQty = (product) => {
    addToCart(product);
  };

  // ================= Decrease Qty =================
  const decreaseQty = async (productId, size = 8) => {
    if (!user) return;
    if (loadingRef.current) return;

    loadingRef.current = true;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.post(
        `${API_URL}/decrease`,
        {
          productId: productId.toString(),
          size: Number(size),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCart(res.data.items || []);
    } catch (error) {
      console.log("Decrease qty error:", error);
    } finally {
      loadingRef.current = false;
    }
  };

  // ================= Remove Item =================
  const removeFromCart = async (productId, size = 8) => {
    if (!user) return;
    if (loadingRef.current) return;

    loadingRef.current = true;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.post(
        `${API_URL}/remove`,
        {
          productId: productId.toString(),
          size: Number(size),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCart(res.data.items || []);
    } catch (error) {
      console.log("Remove error:", error);
    } finally {
      loadingRef.current = false;
    }
  };

  // ================= Clear Cart =================
  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");

      // If no token, just clear locally
      if (!token) {
        setCart([]);
        return;
      }

      await axios.delete(`${API_URL}/clear`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart([]);

      if (user?.email) {
        localStorage.removeItem(`cart_${user.email}`);
      }
    } catch (error) {
      console.log("Clear cart error:", error);
      setCart([]);
    }
  };

  // ================= Total =================
  const cartTotal = cart.reduce(
    (total, item) =>
      total + (Number(item.price) || 0) * (Number(item.qty) || 1),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
