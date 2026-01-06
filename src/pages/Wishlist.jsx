import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import "./Wishlist.css";

function Wishlist() {
  const navigate = useNavigate();

  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  const { addToCart } = useContext(CartContext);

  const handleMoveToCart = (item) => {
    addToCart(item); 
    removeFromWishlist(item.id); 
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
              {/* IMAGE → PRODUCT DETAIL */}
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
                    onClick={() => removeFromWishlist(item.id)}
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
