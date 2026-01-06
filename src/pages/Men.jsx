import { useState } from "react";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import "./Men.css";

function Men() {
  const menProducts = products.filter((p) => p.category === "men");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState(4000);
  const [priceBucket, setPriceBucket] = useState("");

  const filteredProducts = menProducts
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
    <section className="men-page">
      {/* HERO */}
      <div className="men-hero" data-aos="fade-up">
        <div className="men-hero-overlay" />
        <div className="men-hero-content">
          <h1>Men’s Footwear</h1>
          <p>Designed for performance, comfort, and everyday confidence</p>
        </div>
      </div>


      <div className="men-filters" data-aos="fade-up">
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
        Showing {filteredProducts.length} of {menProducts.length} products
      </p>


      <div className="men-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default Men;
