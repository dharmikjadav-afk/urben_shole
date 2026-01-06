    import { useState, useMemo } from "react";
    import products from "../data/products";
    import ProductCard from "../components/ProductCard";
    import "./Shop.css";

    function Shop() {
    const [category, setCategory] = useState("all");
    const [price, setPrice] = useState("all");
    const [sort, setSort] = useState("default");
    const [search, setSearch] = useState("");

 
    const filteredProducts = useMemo(() => {
        let result = [...products];


        if (category !== "all") {
        result = result.filter((p) => p.category === category);
        }


        if (price === "low") {
        result = result.filter((p) => p.price < 2000);
        }
        if (price === "mid") {
        result = result.filter((p) => p.price >= 2000 && p.price <= 3000);
        }
        if (price === "high") {
        result = result.filter((p) => p.price > 3000);
        }


        if (search.trim()) {
        result = result.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );
        }

        if (sort === "low-high") {
        result.sort((a, b) => a.price - b.price);
        }
        if (sort === "high-low") {
        result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [category, price, sort, search]);

    return (
        <section className="shop-page">

        <div className="shop-header">
            <div>
            <h1>Shop All Shoes</h1>
            <p>
                Showing <strong>{filteredProducts.length}</strong> products
                {price !== "all" && " • Price filter applied"}
            </p>
            </div>


            {price !== "all" && (
            <button
                className="active-filter-pill"
                onClick={() => setPrice("all")}
            >
                {price === "low" && "Below ₹2000"}
                {price === "mid" && "₹2000 – ₹3000"}
                {price === "high" && "Above ₹3000"}
                &nbsp;✕
            </button>
            )}
        </div>

        <div className="shop-layout">
      
            <aside className="shop-filters">
            <h3>Filters</h3>


            <input
                type="text"
                placeholder="Search shoes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="filter-group">
                <h4>Category</h4>
                {["all", "men", "women", "kids"].map((c) => (
                <button
                    key={c}
                    className={category === c ? "active" : ""}
                    onClick={() => setCategory(c)}
                >
                    {c.toUpperCase()}
                </button>
                ))}
            </div>

            <div className="filter-group">
                <h4>Price</h4>
                <button
                className={price === "low" ? "active" : ""}
                onClick={() => setPrice("low")}
                >
                Below ₹2000
                </button>
                <button
                className={price === "mid" ? "active" : ""}
                onClick={() => setPrice("mid")}
                >
                ₹2000 – ₹3000
                </button>
                <button
                className={price === "high" ? "active" : ""}
                onClick={() => setPrice("high")}
                >
                Above ₹3000
                </button>
            </div>

            <div className="filter-group">
                <h4>Sort By</h4>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="default">Default</option>
                <option value="low-high">Price: Low → High</option>
                <option value="high-low">Price: High → Low</option>
                </select>
            </div>


            <button
                className="clear-btn"
                onClick={() => {
                setCategory("all");
                setPrice("all");
                setSort("default");
                setSearch("");
                }}
            >
                Clear Filters
            </button>
            </aside>

            <div className="shop-products">
            {filteredProducts.length === 0 ? (
                <p className="empty">No products found</p>
            ) : (
                filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
                ))
            )}
            </div>
        </div>
        </section>
    );
    }

    export default Shop;
