import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "./Home.css";
import { Link } from "react-router-dom";
import {
  FiTruck,
  FiLock,
  FiRefreshCw,
  FiHeadphones,
  FiStar,
} from "react-icons/fi";
import { getProducts } from "../api/api";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scrollToCategories = () => {
    const section = document.getElementById("categories");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-glow" />

        <div className="hero-content">
          <span className="hero-badge" data-aos="fade-down">
            Premium Collection 2026
          </span>

          <h1 data-aos="fade-up">
            Walk With <span>Confidence</span>
          </h1>

          <p data-aos="fade-up" data-aos-delay="100">
            Discover premium shoes crafted for men, women, and kids.
          </p>

          <div className="hero-actions" data-aos="fade-up" data-aos-delay="200">
            <Link to="/shop" className="btn-primary">
              Shop Now
            </Link>

            <button
              type="button"
              className="btn-outline"
              onClick={scrollToCategories}
            >
              Explore Collection
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories-section" id="categories">
        <div className="categories-header">
          <h2>Shop by Category</h2>
          <p>Find the perfect style for everyone</p>
        </div>

        <div className="categories-grid">
          <Link to="/men">
            <div className="category-card">
              <img src="men.jpg" alt="Men" />
              <div className="category-overlay">
                <h3>Men</h3>
                <span>Explore Collection →</span>
              </div>
            </div>
          </Link>

          <Link to="/women">
            <div className="category-card">
              <img src="women.jpg" alt="Women" />
              <div className="category-overlay">
                <h3>Women</h3>
                <span>Explore Collection →</span>
              </div>
            </div>
          </Link>

          <Link to="/kids">
            <div className="category-card">
              <img src="kids.jpg" alt="Kids" />
              <div className="category-overlay">
                <h3>Kids</h3>
                <span>Explore Collection →</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* FEATURED */}
      <section className="featured">
        <div className="section-header" data-aos="fade-up">
          <h2>Featured Products</h2>
          <p>Top picks chosen for style and comfort</p>
        </div>

        <div className="product-grid">
          {loading ? (
            <p>Loading products...</p>
          ) : (
            products
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
          )}
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="trust-section">
        <div className="section-header" data-aos="fade-up">
          <h2>Why Choose UrbanSole</h2>
          <p>We deliver quality, comfort, and confidence</p>
        </div>

        <div className="trust-grid">
          <div className="trust-card" data-aos="fade-up" data-aos-delay="100">
            <span className="trust-icon">
              <FiTruck />
            </span>
            <h4>Free Shipping</h4>
            <p>Free delivery on all orders above ₹999</p>
          </div>

          <div className="trust-card" data-aos="fade-up" data-aos-delay="200">
            <span className="trust-icon">
              <FiLock />
            </span>
            <h4>Secure Payment</h4>
            <p>100% safe and encrypted transactions</p>
          </div>

          <div className="trust-card" data-aos="fade-up" data-aos-delay="300">
            <span className="trust-icon">
              <FiRefreshCw />
            </span>
            <h4>Easy Returns</h4>
            <p>Hassle-free 7 days return policy</p>
          </div>

          <div className="trust-card" data-aos="fade-up" data-aos-delay="400">
            <span className="trust-icon">
              <FiHeadphones />
            </span>
            <h4>24/7 Support</h4>
            <p>We’re here to help anytime you need</p>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="new-arrivals">
        <div className="section-header" data-aos="fade-up">
          <h2>New Arrivals</h2>
          <p>Fresh styles just added to our collection</p>
        </div>

        <div className="product-grid">
          {loading ? (
            <p>Loading products...</p>
          ) : (
            [...products]
              .reverse()
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="section-header" data-aos="fade-up">
          <h2>What Our Customers Say</h2>
          <p>Real feedback from people who trust UrbanSole</p>
        </div>

        <div className="testimonials-grid">
          {[
            {
              name: "Rahul Mehta",
              img: "https://randomuser.me/api/portraits/men/32.jpg",
              stars: 5,
              text: "The quality is excellent and the comfort is unmatched.",
            },
            {
              name: "Ananya Sharma",
              img: "https://randomuser.me/api/portraits/women/44.jpg",
              stars: 4,
              text: "Stylish, lightweight, and durable.",
            },
            {
              name: "Arjun Patel",
              img: "https://randomuser.me/api/portraits/men/54.jpg",
              stars: 4,
              text: "Great experience overall.",
            },
          ].map((review, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-header">
                <img src={review.img} alt={review.name} />
                <div>
                  <h4>{review.name}</h4>
                  <span>Verified Buyer</span>
                </div>
              </div>

              <div className="stars">
                {[...Array(5)].map((_, idx) => (
                  <FiStar
                    key={idx}
                    className={idx < review.stars ? "filled" : ""}
                  />
                ))}
              </div>

              <p className="review">{review.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter" data-aos="fade-up">
        <div className="newsletter-inner">
          <h2>Join UrbanSole</h2>
          <p>Subscribe for exclusive offers and new arrivals.</p>

          <form
            className="newsletter-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}

export default Home;
