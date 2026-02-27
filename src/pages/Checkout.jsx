import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import "./Checkout.css";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  // ================= BUY NOW SUPPORT =================
  const buyNowItems = location.state?.items || [];
  const isBuyNow = location.state?.buyNow || false;
  const items = isBuyNow ? buyNowItems : cart;
  // ===================================================

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  const GST_RATE = 0.18;
  const PLATFORM_FEE = 20;

  const gstAmount = Math.round(subtotal * GST_RATE);
  const finalTotal = subtotal + gstAmount + PLATFORM_FEE;

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [payment, setPayment] = useState("cod");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const e = {};

    if (address.name.trim().length < 3) e.name = "Enter full name";
    if (!/^[0-9]{10}$/.test(address.phone))
      e.phone = "10-digit mobile number required";
    if (address.address.trim().length < 10)
      e.address = "Complete address required";
    if (!address.city.trim()) e.city = "City required";
    if (!address.state.trim()) e.state = "State required";
    if (!/^[0-9]{6}$/.test(address.pincode))
      e.pincode = "6-digit pincode required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (!validate()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // ⭐ Backend expects: items [{ productId, qty }]
      const itemsForBackend = items.map((item) => ({
        productId: item._id,
        qty: item.qty,
      }));

      const orderData = {
        shippingAddress: address,
        paymentMethod: payment,
        items: itemsForBackend,
      };

      const response = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      clearCart();
      navigate("/order-confirmation", { state: response.data });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="checkout-page">
      <h2 className="checkout-title">Checkout</h2>
      <p className="checkout-subtitle">
        Secure your order with accurate delivery details
      </p>

      <div className="checkout-layout">
        <div className="checkout-form">
          <h3>Delivery Address</h3>

          <label>Full Name</label>
          <input
            name="name"
            onChange={handleChange}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}

          <label>Mobile Number</label>
          <input
            name="phone"
            onChange={handleChange}
            className={errors.phone ? "error" : ""}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}

          <label>Full Address</label>
          <textarea
            name="address"
            onChange={handleChange}
            className={errors.address ? "error" : ""}
          />
          {errors.address && (
            <span className="error-text">{errors.address}</span>
          )}

          <div className="row">
            <div>
              <label>City</label>
              <input
                name="city"
                onChange={handleChange}
                className={errors.city ? "error" : ""}
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>

            <div>
              <label>State</label>
              <input
                name="state"
                onChange={handleChange}
                className={errors.state ? "error" : ""}
              />
              {errors.state && (
                <span className="error-text">{errors.state}</span>
              )}
            </div>
          </div>

          <label>Pincode</label>
          <input
            name="pincode"
            onChange={handleChange}
            className={errors.pincode ? "error" : ""}
          />
          {errors.pincode && (
            <span className="error-text">{errors.pincode}</span>
          )}
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>

          {items.map((item) => (
            <div className="summary-item" key={`${item._id}-${item.size}`}>
              <div>
                <strong>{item.name}</strong>
                <p className="summary-size">
                  Size: UK {item.size} × {item.qty}
                </p>
              </div>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="summary-row">
            <span>GST (18%)</span>
            <span>₹{gstAmount}</span>
          </div>

          <div className="summary-row">
            <span>Platform Fee</span>
            <span>₹{PLATFORM_FEE}</span>
          </div>

          <div className="summary-row total">
            <span>Total Payable</span>
            <span>₹{finalTotal}</span>
          </div>

          <button
            className="place-order-btn"
            disabled={items.length === 0 || loading}
            onClick={handlePlaceOrder}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
