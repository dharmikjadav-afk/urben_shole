import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import products from "../data/products";
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
import "./ProductDetail.css";

const SIZES = [6, 7, 8, 9, 10];

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart } = useContext(CartContext);

  const product = products.find((p) => p.id === Number(id));

  const { user } = useContext(AuthContext);

  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return <h2 style={{ padding: "120px" }}>Product not found</h2>;
  }

  const inWishlist = isInWishlist(product.id);

  const requireLogin = () => {
    if (!user) {
      navigate("/login");
      return true;
    }
    return false;
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!size) {
      setError("Please select a size");
      return;
    }

    const exists = cart.find(
      (item) => item.id === product.id && item.size === size
    );

    if (exists) {
      for (let i = 0; i < qty; i++) {
        addToCart({ ...product, size });
      }
    } else {
      addToCart({ ...product, size });
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!size) {
      setError("Please select a size");
      return;
    }


    const exists = cart.find(
      (item) => item.id === product.id && item.size === size
    );

    if (!exists) {
      addToCart({ ...product, size });
    }

    navigate("/checkout");
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
            Premium quality footwear designed for comfort, durability, and
            everyday confidence. Crafted with breathable materials and a
            lightweight sole.
          </p>


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

          <div className="actions">
            <button className="add-cart-btn" onClick={handleAddToCart}>
              <FiShoppingCart />
              Add to Cart
            </button>

            <button
              className={`wishlist-btn ${inWishlist ? "active" : ""}`}
              onClick={() =>
                inWishlist
                  ? removeFromWishlist(product.id)
                  : addToWishlist(product)
              }
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
