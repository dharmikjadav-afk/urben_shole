import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "../api/api";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import {
  FiHeart,
  FiShoppingCart,
  FiTruck,
  FiRefreshCw,
  FiShield,
} from "react-icons/fi";
import {
  addToCart as addCartAPI,
  addToWishlist as addWishlistAPI,
} from "../api/api";
import { toast } from "react-toastify";
import "./ProductDetail.css";

const SIZES = [6, 7, 8, 9, 10];

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { cart, addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Product load error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <h2 style={{ padding: "120px" }}>Loading product...</h2>;
  }

  if (!product) {
    return <h2 style={{ padding: "120px" }}>Product not found</h2>;
  }

  const productId = product._id;
  const inWishlist = isInWishlist(productId);

  // ================= Add to Cart =================
  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!size) {
      setError("Please select a size");
      return;
    }

    const item = { ...product, size };

    for (let i = 0; i < qty; i++) {
      addToCart(item);
    }

    try {
      const token = localStorage.getItem("token");
      await addCartAPI(productId, token);
      toast.success("Added to cart");
    } catch (error) {
      console.error("Cart API Error:", error);
      toast.error("Failed to save cart");
    }
  };

  // ================= Buy Now =================
  const handleBuyNow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!size) {
      setError("Please select a size");
      return;
    }

    const item = { ...product, size };
    addToCart(item);

    try {
      const token = localStorage.getItem("token");
      await addCartAPI(productId, token);
    } catch (error) {
      console.error("Cart API Error:", error);
    }

    navigate("/checkout");
  };

  // ================= Wishlist =================
  const handleWishlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (inWishlist) {
      removeFromWishlist(productId);
      toast.info("Removed from wishlist");
      return;
    }

    addToWishlist(product);

    try {
      const token = localStorage.getItem("token");
      await addWishlistAPI(productId, token);
      toast.success("Added to wishlist");
    } catch (error) {
      console.error("Wishlist API Error:", error);
      toast.error("Failed to save wishlist");
    }
  };

  return (
    <section className="product-detail">
      <div className="breadcrumb">
        Home / {product.category} / <span>{product.name}</span>
      </div>

      <div className="product-detail-grid">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <span className="category">{product.category.toUpperCase()}</span>
          <p className="price">₹{product.price}</p>

          <p className="description">
            {product.description ||
              "Premium quality footwear designed for comfort, durability, and everyday confidence."}
          </p>

          {/* Size */}
          <div className="size-section">
            <h4>Select Size (UK)</h4>
            <div className="size-grid">
              {SIZES.map((s) => (
                <button
                  key={s}
                  className={`size-btn ${size === s ? "active" : ""}`}
                  onClick={() => {
                    setSize(s);
                    setError("");
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            {error && <p className="size-error">{error}</p>}
          </div>

          {/* Actions */}
          <div className="actions">
            <button className="add-cart-btn" onClick={handleAddToCart}>
              <FiShoppingCart />
              Add to Cart
            </button>

            <button
              className={`wishlist-btn ${inWishlist ? "active" : ""}`}
              onClick={handleWishlist}
            >
              <FiHeart />
            </button>
          </div>

          <button className="buy-now-btn" onClick={handleBuyNow}>
            Buy Now
          </button>

          <div className="trust-info">
            <div>
              <FiTruck /> Free delivery above ₹999
            </div>
            <div>
              <FiRefreshCw /> 7 days easy return
            </div>
            <div>
              <FiShield /> Secure checkout
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
