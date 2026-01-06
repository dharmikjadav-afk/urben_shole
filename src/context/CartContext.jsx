import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  const clearCart = () => {
    if (!user) return;

    setCart([]);
    localStorage.removeItem(`cart_${user.email}`);
  };


  useEffect(() => {
    if (user?.email) {
      const stored =
        JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];
      setCart(stored);
    } else {
      setCart([]);
    }
  }, [user]);


  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (product) => {
    if (!user) return;

    const exists = cart.find((item) => item.id === product.id);

    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };


  const decreaseQty = (id) => {
    if (!user) return;

    setCart(
      cart
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0)
    );
  };


  const removeFromCart = (id) => {
    if (!user) return;

    setCart(cart.filter((item) => item.id !== id));
  };


  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
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
