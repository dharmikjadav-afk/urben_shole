import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/api";
import "./Kids.css";

function Kids() {
  const [kidsProducts, setKidsProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState(2500);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();

        // Filter only kids products
        const kidsOnly = res.data.filter(
          (p) => p.category.toLowerCase() === "kids",
        );

        setKidsProducts(kidsOnly);
      } catch (error) {
        console.error("Failed to load kids products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = kidsProducts
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => p.price <= priceRange)
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <section className="kids-page">
      {/* Hero */}
      <div className="kids-hero" data-aos="fade-up">
        <div className="kids-hero-overlay" />
        <div className="kids-hero-content">
          <h1>Kids’ Collection</h1>
          <p>Fun, safe, and comfortable footwear for every step</p>
        </div>
      </div>

      {/* Filters */}
      <div className="kids-filters" data-aos="fade-up">
        <input
          type="text"
          placeholder="Search shoes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
          <option value="name">Name: A → Z</option>
        </select>

        <div className="range-box">
          <label>Max ₹{priceRange}</label>
          <input
            type="range"
            min="1000"
            max="2500"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
          />
        </div>
      </div>

      <p className="result-count">
        Showing {filteredProducts.length} of {kidsProducts.length} products
      </p>

      {/* Products */}
      <div className="kids-grid">
        {loading ? (
          <p>Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </section>
  );
}

export default Kids;
