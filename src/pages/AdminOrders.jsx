import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/orders";

  // ================= FETCH ALL ORDERS =================
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (error) {
      console.log("Fetch orders error:", error);
      alert("Only admin can access this page");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= MARK AS PAID =================
  const markPaid = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/${id}/pay`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchOrders();
    } catch (error) {
      console.log("Mark paid error:", error);
    }
  };

  // ================= MARK AS DELIVERED =================
  const markDelivered = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/${id}/deliver`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchOrders();
    } catch (error) {
      console.log("Mark delivered error:", error);
    }
  };

  if (loading) {
    return <div className="admin-orders">Loading orders...</div>;
  }

  return (
    <section className="admin-orders">
      <h2>Admin Orders Panel</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="orders-table">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-top">
                <div>
                  <strong>Order ID:</strong> {order._id}
                  <p>User: {order.user?.email}</p>
                </div>

                <div>
                  <p>Total: ₹{order.totalAmount}</p>
                  <p>Status: {order.status}</p>
                  <p>
                    Payment:{" "}
                    {order.isPaid ? "Paid" : order.paymentMethod.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="order-actions">
                {!order.isPaid && (
                  <button
                    className="paid-btn"
                    onClick={() => markPaid(order._id)}
                  >
                    Mark Paid
                  </button>
                )}

                {order.status !== "Delivered" && (
                  <button
                    className="deliver-btn"
                    onClick={() => markDelivered(order._id)}
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminOrders;
