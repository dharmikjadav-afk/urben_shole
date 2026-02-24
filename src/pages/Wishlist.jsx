import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { addToCart as addCartAPI } from "../api/api";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import { toast } from "react-toastify";
import "./Wishlist.css";

function Wishlist() {
  const navigate = useNavigate();

  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const token = localStorage.getItem("token");

  // Helper → support both id and _id
  const getProductId = (item) => item?._id || item?.id;

  // ================= Move to Cart =================
  const handleMoveToCart = async (item) => {
    if (!item) return;

    const productId = getProductId(item);

    // Update UI instantly
    addToCart(item);
    removeFromWishlist(productId);

    try {
      await addCartAPI(productId, token);
      toast.success("Moved to cart");
    } catch (error) {
      console.error("Move to Cart Error:", error);
      toast.error("Failed to update server");
    }
  };

  // ================= Remove =================
  const handleRemove = (item) => {
    if (!item) return;

    const productId = getProductId(item);
    removeFromWishlist(productId);
    toast.info("Removed from wishlist");
  };

  // ================= Open Product =================
  const openProduct = (item) => {
    const productId = getProductId(item);
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <section className="wishlist-page">
      <h2 className="wishlist-title">My Wishlist</h2>
      <p className="wishlist-subtitle">Your favorite picks saved for later</p>

      {!wishlist || wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <p>Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => {
            const productId = getProductId(item);
            if (!productId) return null;

            return (
              <div className="wishlist-card" key={productId}>
                {/* IMAGE */}
                <div className="wishlist-img" onClick={() => openProduct(item)}>
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name || "Product"}
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                </div>

                {/* INFO */}
                <div className="wishlist-info">
                  <h4
                    className="wishlist-name"
                    onClick={() => openProduct(item)}
                  >
                    {item.name || "Product"}
                  </h4>

                  <p className="wishlist-price">₹{item.price || 0}</p>

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
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Wishlist;
