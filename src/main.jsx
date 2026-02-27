import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeProvider from "./context/ThemeContext";
import AuthProvider from "./context/AuthContext";
import WishlistProvider from "./context/WishlistContext";
import CartProvider from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext"; // ⭐ NEW
import "./index.css";
import "aos/dist/aos.css";

// Toast imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create root (recommended for React 18)
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.Fragment>
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <OrderProvider>
              {" "}
              {/* ⭐ NEW PROVIDER */}
              <App />
              {/* Global Toast Container */}
              <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="dark"
                toastStyle={{
                  background: "#0f172a",
                  color: "#ffffff",
                  borderRadius: "10px",
                }}
              />
            </OrderProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.Fragment>,
);
