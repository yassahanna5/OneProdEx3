  import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ProductCards from "./ProductCards";

export default function Category() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (category === "all") {
        let { data } = await axios.get("https://dummyjson.com/products?limit=200");
        setProducts(data.products);
      } else {
        let { data } = await axios.get(`https://dummyjson.com/products/category/${category}`);
        setProducts(data.products);
      }
    };
    fetchProducts();
  }, [category]);

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>
        {category === "all"
          ? "All Products"
          : `Products in ${category}`}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ProductCards product={p} />
          </Link>
        ))}
      </div>
    </div>
  );
} 



 