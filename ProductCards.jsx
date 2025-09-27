 
import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "./RTK/Slices/cartSlice";
import { Link } from "react-router-dom";

export default function ProductCards({ product }) {
  const dispatch = useDispatch();

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        textAlign: "center",
      }}
    >
      {/* الصورة والعنوان فقط بيروحوا لـ details */}
      <Link
        to={`/product/${product.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img
          src={product.images[0]}
          alt={product.title}
          style={{ width: "100%", height: "150px", objectFit: "cover" }}
        />
        <h3 style={{ fontSize: "16px", margin: "10px 0" }}>{product.title}</h3>
      </Link>

      <p style={{ fontWeight: "bold", color: "green" }}>${product.price}</p>

      {/* زرار Add to Cart ما يروحش للـ details */}
      <button
        onClick={(e) => {
          e.preventDefault(); // يمنع أي redirect
          dispatch(addToCart(product));
        }}
        style={{
          background: "green",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}




















