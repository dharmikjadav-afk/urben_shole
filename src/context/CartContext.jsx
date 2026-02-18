import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  // Helper → support both id and _id
  const getProductId = (product) => product._id || product.id;

  const clearCart = () => {
    if (!user) return;

    setCart([]);
    localStorage.removeItem(`cart_${user.email}`);
  };

  // Load cart when user changes
  useEffect(() => {
    if (user?.email) {
      const stored =
        JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];
      setCart(stored);
    } else {
      setCart([]);
    }
  }, [user]);

  // Save cart
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  // ================= Add to Cart =================
  const addToCart = (product) => {
    if (!user) return;

    const productId = getProductId(product);

    const exists = cart.find((item) => getProductId(item) === productId);

    if (exists) {
      setCart((prev) =>
        prev.map((item) =>
          getProductId(item) === productId
            ? { ...item, qty: item.qty + 1 }
            : item,
        ),
      );
    } else {
      setCart((prev) => [...prev, { ...product, qty: 1 }]);
    }
  };

  // ================= Decrease Qty =================
  const decreaseQty = (id) => {
    if (!user) return;

    setCart((prev) =>
      prev
        .map((item) =>
          getProductId(item) === id ? { ...item, qty: item.qty - 1 } : item,
        )
        .filter((item) => item.qty > 0),
    );
  };

  // ================= Remove =================
  const removeFromCart = (id) => {
    if (!user) return;

    setCart((prev) => prev.filter((item) => getProductId(item) !== id));
  };

  // ================= Total =================
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
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
