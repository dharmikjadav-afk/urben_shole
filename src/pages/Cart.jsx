import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import "./Cart.css";

const SIZES = [6, 7, 8, 9, 10];

function Cart() {
  const navigate = useNavigate();

  const { cart, addToCart, decreaseQty, removeFromCart, cartTotal } =
    useContext(CartContext);

  // Helper → always use MongoDB _id
  const getId = (item) => item?._id || item?.id;

  // Safe helpers
  const getPrice = (price) => Number(price) || 0;
  const getQty = (qty) => Number(qty) || 1;

  const GST_RATE = 0.18;
  const PLATFORM_FEE = 20;

  const safeTotal = Number(cartTotal) || 0;
  const gstAmount = Math.round(safeTotal * GST_RATE);
  const finalTotal = safeTotal + gstAmount + PLATFORM_FEE;

  // ================= Empty Cart =================
  if (!cart || cart.length === 0) {
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
        {/* ================= Cart Items ================= */}
        <div className="cart-items">
          {cart.map((item, index) => {
            const id = getId(item);
            const price = getPrice(item.price);
            const qty = getQty(item.qty);
            const image = item.image || "/placeholder.png";
            const name = item.name || "Product";
            const size = item.size || 8;

            return (
              // Unique key (product + size)
              <div className="cart-item" key={`${id}-${size}`}>
                <img src={image} alt={name} />

                <div className="cart-details">
                  <h4>{name}</h4>

                  <p className="size-label">Size: UK {size}</p>
                  <p className="unit-price">₹{price}</p>

                  {/* Quantity Controls */}
                  <div className="qty-control">
                    {/* Decrease */}
                    <button onClick={() => decreaseQty(id, size)}>
                      <FiMinus />
                    </button>

                    <span>{qty}</span>

                    {/* Increase */}
                    <button
                      onClick={() =>
                        addToCart({
                          _id: id,
                          size: size,
                        })
                      }
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <div className="cart-right">
                  <p className="item-total">₹{price * qty}</p>

                  {/* Remove */}
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(id, size)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= Order Summary ================= */}
        <div className="order-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{safeTotal}</span>
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
