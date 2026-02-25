import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { addToWishlist as addWishlistAPI } from "../api/api";
import { toast } from "react-toastify";
import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);

  // Support both MongoDB _id and local id
  const productId = product?._id || product?.id;

  // Check wishlist status safely
  const inWishlist = isInWishlist(productId);

  const openProductDetail = () => {
    navigate(`/product/${productId}`);
  };

  // ================= Wishlist =================
  const handleWishlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (inWishlist) {
        removeFromWishlist(productId);
        toast.info("Removed from wishlist");
      } else {
        addToWishlist(product);
        toast.success("Added to wishlist");

        const token = localStorage.getItem("token");
        await addWishlistAPI(productId, token);
      }
    } catch (error) {
      console.error("Wishlist API Error:", error);
      toast.error("Wishlist action failed");
    }
  };

  // ================= Cart (FIXED) =================
  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      // Only call context (Context handles API)
      await addToCart(product);
      toast.success("Added to cart");
    } catch (error) {
      console.error("Cart Error:", error);
      toast.error("Failed to add cart");
    }
  };

  return (
    <div className="product-card" data-aos="fade-up">
      {/* Wishlist */}
      <button
        className={`wishlist-btn ${inWishlist ? "active" : ""}`}
        onClick={handleWishlist}
      >
        <FiHeart />
      </button>

      <div className="product-img" onClick={openProductDetail}>
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info">
        <h4 className="product-title" onClick={openProductDetail}>
          {product.name}
        </h4>

        <p className="price">₹{product.price}</p>

        <button className="add-cart" onClick={handleAddToCart}>
          <FiShoppingCart />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
