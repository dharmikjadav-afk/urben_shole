import { useLocation, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiTruck, FiHome } from "react-icons/fi";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/");
    return null;
  }

  const {
    id,
    items,
    total,
    address,
    paymentMethod,
    subtotal,
    gst,
    platformFee,
    date,
  } = state;

  return (
    <section className="order-confirm-page">
      <div className="order-confirm-card">
        {/* SUCCESS */}
        <div className="success-header">
          <FiCheckCircle className="success-icon" />
          <h2>Order Placed Successfully</h2>
          <p>Your order has been confirmed and is being processed.</p>
        </div>

        {/* ORDER META */}
        <div className="order-meta">
          <div>
            <span>Order ID</span>
            <strong>{id}</strong>
          </div>
          <div>
            <span>Order Date</span>
            <strong>{date}</strong>
          </div>
        </div>

        {/* DELIVERY */}
        <div className="order-section">
          <h3>Delivery Address</h3>
          <p>
            {address.name}
            <br />
            {address.address}
            <br />
            {address.city}, {address.state} - {address.pincode}
            <br />
            Phone: {address.phone}
          </p>

          <p className="delivery-estimate">
            <FiTruck /> Estimated delivery in <strong>3–5 business days</strong>
          </p>
        </div>

        {/* ITEMS */}
        <div className="order-section">
          <h3>Items Ordered</h3>

          {items.map((item) => (
            <div className="order-item" key={item.id}>
              <span>
                {item.name} × {item.qty}
              </span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}
        </div>

        {/* PAYMENT */}
        <div className="order-section">
          <h3>Payment Details</h3>

          <div className="price-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="price-row">
            <span>GST (18%)</span>
            <span>₹{gst}</span>
          </div>

          <div className="price-row">
            <span>Platform Fee</span>
            <span>₹{platformFee}</span>
          </div>

          <div className="price-row total">
            <span>Total Paid</span>
            <span>₹{total}</span>
          </div>

          <p className="payment-method">
            Payment Method: <strong>{paymentMethod.toUpperCase()}</strong>
          </p>
        </div>

        {/* FOOTER */}
        <div className="order-footer">
          <p className="support-note">
            Need help? Contact <strong>support@urbansole.com</strong>
          </p>

          <div className="order-actions">
            <button
              className="track-btn"
              onClick={() => navigate("/track-order")}
            >
              <FiTruck /> Track Order
            </button>

            <button className="home-btn" onClick={() => navigate("/")}>
              <FiHome /> Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderConfirmation;
