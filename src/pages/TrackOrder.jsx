import { useEffect, useState } from "react";
import "./TrackOrder.css";
import {
  FiCheckCircle,
  FiBox,
  FiTruck,
  FiMapPin,
  FiHome,
  FiHelpCircle,
} from "react-icons/fi";

const STATUS_FLOW = [
  { label: "Order Placed", icon: <FiCheckCircle /> },
  { label: "Packed", icon: <FiBox /> },
  { label: "Shipped", icon: <FiTruck /> },
  { label: "Out for Delivery", icon: <FiMapPin /> },
  { label: "Delivered", icon: <FiHome /> },
];

function TrackOrder() {
  const [order, setOrder] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    if (orders.length > 0) {
      const latestOrder = orders[orders.length - 1];
      setOrder(latestOrder);

      let step = 0;
      const interval = setInterval(() => {
        step++;
        if (step < STATUS_FLOW.length) {
          setCurrentStep(step);
        } else {
          clearInterval(interval);
        }
      }, 2500);

      return () => clearInterval(interval);
    }
  }, []);

  if (!order) {
    return (
      <section className="track-page">
        <h2>No active order found</h2>
      </section>
    );
  }

  return (
    <section className="track-page">
      <h2 className="track-title">Order Tracking</h2>

      <div className="track-card">

        <div className="track-header">
          <div>
            <span>Order ID</span>
            <strong>{order.id}</strong>
          </div>
          <div>
            <span>Order Date</span>
            <strong>{order.date}</strong>
          </div>
          <div>
            <span>Payment</span>
            <strong>{order.paymentMethod.toUpperCase()}</strong>
          </div>
        </div>


        <div className="track-section">
          <h3>Delivery Address</h3>
          <p>
            {order.address.name}
            <br />
            {order.address.address}
            <br />
            {order.address.city}, {order.address.state} –{" "}
            {order.address.pincode}
            <br />
            Phone: {order.address.phone}
          </p>
        </div>


        <div className="track-section">
          <h3>Shipment Status</h3>

          <div className="timeline-vertical">
            {STATUS_FLOW.map((step, index) => (
              <div
                key={step.label}
                className={`timeline-row ${
                  index <= currentStep ? "active" : ""
                }`}
              >
                <div className="timeline-icon">{step.icon}</div>

                <div className="timeline-content">
                  <strong>{step.label}</strong>
                  <span>{index <= currentStep ? "Completed" : "Pending"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="track-section delivery-box">
          <p>
            <strong>Expected Delivery:</strong>{" "}
            {currentStep >= 4 ? "Delivered" : "3–5 Business Days"}
          </p>
          <p>
            <strong>Total Paid:</strong> ₹{order.total}
          </p>
        </div>


        <div className="support-box">
          <FiHelpCircle />
          <p>
            Need help with your order? Contact
            <strong> support@urbansole.com</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

export default TrackOrder;