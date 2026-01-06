import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeProvider from "./context/ThemeContext";
import AuthProvider from "./context/AuthContext";
import "./index.css";
import "aos/dist/aos.css";
import WishlistProvider from "./context/WishlistContext";
import CartProvider from "./context/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
