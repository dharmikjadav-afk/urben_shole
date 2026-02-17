import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import {
  removeFromWishlist as removeWishlistAPI,
  addToCart as addCartAPI,
} from "../api/api";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import { toast } from "react-toastify";
import "./Wishlist.css";

function Wishlist() {
  const navigate = useNavigate();

  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const token = localStorage.getItem("token");

  // ================= Move to Cart =================
  const handleMoveToCart = async (item) => {
    // Update UI
    addToCart(item);
    removeFromWishlist(item.id);

    try {
      await addCartAPI(item._id || item.id, token);
      await removeWishlistAPI(item._id || item.id, token);
      toast.success("Moved to cart");
    } catch (error) {
      console.error("Move to Cart Error:", error);
      toast.error("Failed to update server");
    }
  };

  // ================= Remove =================
  const handleRemove = async (item) => {
    // Update UI
    removeFromWishlist(item.id);

    try {
      await removeWishlistAPI(item._id || item.id, token);
      toast.info("Removed from wishlist");
    } catch (error) {
      console.error("Remove Wishlist Error:", error);
      toast.error("Failed to update server");
    }
  };

  return (
    <section className="wishlist-page">
      <h2 className="wishlist-title">My Wishlist</h2>
      <p className="wishlist-subtitle">Your favorite picks saved for later</p>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <p>Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div className="wishlist-card" key={item.id}>
              {/* IMAGE */}
              <div
                className="wishlist-img"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <img src={item.image} alt={item.name} />
              </div>

              {/* INFO */}
              <div className="wishlist-info">
                <h4
                  className="wishlist-name"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  {item.name}
                </h4>

                <p className="wishlist-price">₹{item.price}</p>

                <div className="wishlist-actions">
                  <button
                    className="wishlist-cart-btn"
                    onClick={() => handleMoveToCart(item)}
                  >
                    <FiShoppingCart />
                    Add to Cart
                  </button>

                  <button
                    className="wishlist-remove-btn"
                    onClick={() => handleRemove(item)}
                  >
                    <FiTrash2 />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Wishlist;
