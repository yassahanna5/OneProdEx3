 import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://dummyjson.com/products/categories");
        const data = await res.json();
        const cats = data.map((cat) => {
          if (typeof cat === "string") return cat;
          if (cat.name) return cat.name;
          return String(cat);
        });
        setCategories(["All Products", ...cats]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <aside
      style={{
        width: "250px",
        background: "RoyalBlue",
        color: "white",
        padding: "20px",
        height: "100vh",
      }}
    >
      <h2>Categories</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {categories.map((cat, index) => {
          const slug = cat.toLowerCase().replace(/\s/g, "-");
          return (
            <li key={index} style={{ marginBottom: "10px" }}>
              <Link
                to={cat === "All Products" ? "/shop" : `/shop/category/${slug}`}
                style={{ color: "white", textDecoration: "none" }}
              >
                {cat}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
