import { useState } from "react";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import "./Kids.css";

function Kids() {
  const kidsProducts = products.filter((p) => p.category === "kids");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState(2500);

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

      <div className="kids-hero" data-aos="fade-up">
        <div className="kids-hero-overlay" />
        <div className="kids-hero-content">
          <h1>Kids’ Collection</h1>
          <p>Fun, safe, and comfortable footwear for every step</p>
        </div>
      </div>


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

      {/* PRODUCTS */}
      <div className="kids-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default Kids;
