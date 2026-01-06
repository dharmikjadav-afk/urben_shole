import { useState } from "react";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import "./Women.css";

function Women() {
  const womenProducts = products.filter((p) => p.category === "women");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState(4000);
  const [priceBucket, setPriceBucket] = useState("");

  const filteredProducts = womenProducts
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => p.price <= priceRange)
    .filter((p) => {
      if (priceBucket === "low") return p.price < 2000;
      if (priceBucket === "mid") return p.price >= 2000 && p.price <= 3000;
      if (priceBucket === "high") return p.price > 3000;
      return true;
    })
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <section className="women-page">
      <div className="women-hero" data-aos="fade-up">
        <div className="women-hero-overlay" />
        <div className="women-hero-content">
          <h1>Women’s Collection</h1>
          <p>Elegant styles crafted for comfort and confidence</p>
        </div>
      </div>

      <div className="women-filters" data-aos="fade-up">
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

        <select onChange={(e) => setPriceBucket(e.target.value)}>
          <option value="">Price Range</option>
          <option value="low">Below ₹2000</option>
          <option value="mid">₹2000 – ₹3000</option>
          <option value="high">Above ₹3000</option>
        </select>

        <div className="range-box">
          <label>Max ₹{priceRange}</label>
          <input
            type="range"
            min="1500"
            max="4000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
          />
        </div>
      </div>

      <p className="result-count">
        Showing {filteredProducts.length} of {womenProducts.length} products
      </p>

      <div className="women-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default Women;
