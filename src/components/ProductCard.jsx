import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);

  const inWishlist = isInWishlist(product.id);


  const openProductDetail = () => {
    navigate(`/product/${product.id}`);
  };

  const handleWishlist = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    addToCart(product);
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
