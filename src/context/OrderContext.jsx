import { createContext, useState, useEffect } from "react";
import axios from "../api/api";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  // ================= STATE =================
  const [orders, setOrders] = useState(
    JSON.parse(localStorage.getItem("orders")) || []
  );

  const [loadingOrders, setLoadingOrders] = useState(false);

  // ================= FETCH ORDERS FROM BACKEND =================
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    // Do not call API if user not logged in
    if (!token) {
      setOrders([]);
      localStorage.removeItem("orders");
      return;
    }

    try {
      setLoadingOrders(true);

      // ⭐ FIXED ROUTE HERE
      const res = await axios.get("/api/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
      localStorage.setItem("orders", JSON.stringify(res.data));
    } catch (error) {
      console.error(
        "Fetch orders error:",
        error.response?.data || error.message
      );
    } finally {
      setLoadingOrders(false);
    }
  };

  // ================= FETCH WHEN APP LOADS =================
  useEffect(() => {
    fetchOrders();

    const handleStorageChange = () => {
      fetchOrders();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ================= ADD ORDER (After Checkout) =================
  const addOrder = (order) => {
    const updatedOrders = [order, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  // ================= CLEAR ORDERS (Logout) =================
  const clearOrders = () => {
    setOrders([]);
    localStorage.removeItem("orders");
  };

  // ================= CONTEXT VALUE =================
  return (
    <OrderContext.Provider
      value={{
        orders,
        loadingOrders,
        fetchOrders,
        addOrder,
        clearOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};