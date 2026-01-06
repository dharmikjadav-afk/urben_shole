import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import "./Cart.css";

const SIZES = [6, 7, 8, 9, 10];

function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    addToCart,
    decreaseQty,
    removeFromCart,
    updateSize,
    cartTotal,
  } = useContext(CartContext);

  const GST_RATE = 0.18;
  const PLATFORM_FEE = 20;

  const gstAmount = Math.round(cartTotal * GST_RATE);
  const finalTotal = cartTotal + gstAmount + PLATFORM_FEE;

  if (cart.length === 0) {
    return (
      <section className="cart-page">
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <p>Add premium shoes to continue shopping.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <h2 className="cart-title">Shopping Cart</h2>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={`${item.id}-${item.size}`}>
              <img src={item.image} alt={item.name} />

              <div className="cart-details">
                <h4>{item.name}</h4>

                {/* SIZE EDIT */}
                <select
                  className="size-select"
                  value={item.size}
                  onChange={(e) =>
                    updateSize(item.id, item.size, Number(e.target.value))
                  }
                >
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      UK {s}
                    </option>
                  ))}
                </select>

                <p className="unit-price">₹{item.price}</p>

                <div className="qty-control">
                  <button onClick={() => decreaseQty(item.id)}>
                    <FiMinus />
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => addToCart(item)}>
                    <FiPlus />
                  </button>
                </div>
              </div>

              <div className="cart-right">
                <p className="item-total">₹{item.price * item.qty}</p>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{cartTotal}</span>
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
            <span>Total</span>
            <span>₹{finalTotal}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </section>
  );
}

export default Cart;
