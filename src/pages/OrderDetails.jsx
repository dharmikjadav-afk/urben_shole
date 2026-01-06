import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./OrderDetails.css";

function OrderDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(state);

  if (!order) {
    return (
      <section className="order-details-page">
        <h2>Order not found</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </section>
    );
  }

  const cancellableStages = ["Order Placed", "Packed"];
  const canCancel = cancellableStages.includes(order.status);

  const handleCancelOrder = () => {
    if (!canCancel) return;

    const refundStatus =
      order.paymentMethod === "cod" ? "Not Applicable" : "Refund Initiated";

    const updatedOrder = {
      ...order,
      status: "Cancelled",
      refundStatus,
    };

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const updatedOrders = orders.map((o) =>
      o.id === order.id ? updatedOrder : o
    );

    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    setOrder(updatedOrder);
  };


  useEffect(() => {
    if (
      order.status === "Cancelled" &&
      order.refundStatus === "Refund Initiated"
    ) {
      const timer = setTimeout(() => {
        const completedOrder = {
          ...order,
          refundStatus: "Refund Completed",
        };

        const orders = JSON.parse(localStorage.getItem("orders")) || [];

        const updatedOrders = orders.map((o) =>
          o.id === order.id ? completedOrder : o
        );

        localStorage.setItem("orders", JSON.stringify(updatedOrders));

        setOrder(completedOrder);
      }, 3000); 

      return () => clearTimeout(timer);
    }
  }, [order]);

  return (
    <section className="order-details-page">
      <h2>Order Details</h2>

      <div className="order-card">
        <p>
          <strong>Order ID:</strong> {order.id}
        </p>
        <p>
          <strong>Date:</strong> {order.date}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`order-status ${order.status
              .toLowerCase()
              .replace(/\s/g, "-")}`}
          >
            {order.status}
          </span>
        </p>

        {order.refundStatus && (
          <p>
            <strong>Refund:</strong>{" "}
            <span
              className={`refund-status ${order.refundStatus
                .toLowerCase()
                .replace(/\s/g, "-")}`}
            >
              {order.refundStatus}
            </span>
          </p>
        )}
      </div>

      <div className="order-items">
        <h3>Items</h3>

        {order.items.map((item) => (
          <div key={`${item.id}-${item.size}`} className="order-item">
            <div>
              <h4>{item.name}</h4>
              <p className="order-size">
                Size: UK {item.size} × {item.qty}
              </p>
            </div>

            <span>₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      <div className="order-summary">
        <p>Subtotal: ₹{order.subtotal}</p>
        <p>GST: ₹{order.gst}</p>
        <p>Platform Fee: ₹{order.platformFee}</p>
        <h3>Total: ₹{order.total}</h3>
      </div>

      {canCancel && (
        <button className="cancel-order-btn" onClick={handleCancelOrder}>
          Cancel Order
        </button>
      )}

      {!canCancel && order.status !== "Cancelled" && (
        <p className="cancel-note">This order can no longer be cancelled.</p>
      )}
    </section>
  );
}

export default OrderDetails;
