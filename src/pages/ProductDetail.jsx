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
import { addToWishlist as addWishlistAPI } from "../api/api";
import { toast } from "react-toastify";

// Review Components
import ReviewForm from "../components/Review/ReviewForm";
import ReviewList from "../components/Review/ReviewList";

import "./ProductDetail.css";

const SIZES = [6, 7, 8, 9, 10];

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(null);
  const [error, setError] = useState("");

  const [refreshReviews, setRefreshReviews] = useState(false);

  const [isVerifiedBuyer, setIsVerifiedBuyer] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);

  // ================= Fetch Product =================
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

  // ================= Check Purchase (FINAL FIX) =================
  useEffect(() => {
    const checkPurchase = async () => {
      if (!user || !token || !product) {
        setCheckingPurchase(false);
        return;
      }

      try {
        const res = await axios.get("/api/orders/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const orders = res.data;

        const purchased = orders.some((order) =>
          order.items.some((item) => {
            const orderProductId =
              item.productId || item.product?._id || item.product;

            return String(orderProductId) === String(product._id);
          }),
        );

        setIsVerifiedBuyer(purchased);
      } catch (error) {
        console.error("Purchase check error:", error);
      } finally {
        setCheckingPurchase(false);
      }
    };

    checkPurchase();
  }, [user, token, product]);

  // ================= Safe Loading =================
  if (loading || !product) {
    return (
      <h2 style={{ padding: "120px" }}>
        {loading ? "Loading product..." : "Product not found"}
      </h2>
    );
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

    try {
      for (let i = 0; i < qty; i++) {
        await addToCart(item);
      }
      toast.success("Added to cart");
    } catch (error) {
      console.error("Cart Error:", error);
      toast.error("Failed to add to cart");
    }
  };

  // ================= Buy Now =================
  const handleBuyNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!size) {
      setError("Please select a size");
      return;
    }

    const buyNowItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: qty,
      size: size,
    };

    navigate("/checkout", {
      state: {
        buyNow: true,
        items: [buyNowItem],
      },
    });
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

  const handleReviewAdded = () => {
    setRefreshReviews(!refreshReviews);
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
          <span className="category">{product.category?.toUpperCase()}</span>
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

      {/* ================= REVIEWS ================= */}
      <div className="review-section">
        {checkingPurchase ? (
          <p>Checking purchase status...</p>
        ) : user && isVerifiedBuyer ? (
          <ReviewForm
            productId={productId}
            user={user}
            token={token}
            onReviewAdded={handleReviewAdded}
          />
        ) : user ? (
          <div className="not-verified-box">
            <p style={{ color: "red" }}>
              You are not a verified buyer. Please purchase this product first.
            </p>
            <button onClick={() => navigate("/orders")}>
              View Your Orders
            </button>
          </div>
        ) : (
          <p>Please login to write a review.</p>
        )}

        <ReviewList productId={productId} refreshTrigger={refreshReviews} />
      </div>
    </section>
  );
}

export default ProductDetail;
