import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders.reverse());
  }, []);

  // EMPTY STATE
  if (orders.length === 0) {
    return (
      <section className="orders-page">
        <h2 className="orders-title">My Orders</h2>
        <p className="empty-text">You haven’t placed any orders yet.</p>
      </section>
    );
  }

  return (
    <section className="orders-page">
      <h2 className="orders-title">My Orders</h2>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th className="hide-mobile">Date</th>
              <th>Status</th>
              <th className="hide-mobile">Total</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="order-id">{order.id}</td>

                <td className="order-date hide-mobile">{order.date}</td>

                <td className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </td>

                <td className="order-total hide-mobile">₹{order.total}</td>

                <td>
                  <button
                    className="view-btn"
                    onClick={() => navigate("/order-details", { state: order })}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default MyOrders;
