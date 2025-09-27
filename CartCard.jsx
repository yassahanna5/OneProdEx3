  
  /*import React from "react";
import { useDispatch } from "react-redux";
import { increaseQuantity, decreaseQuantity, removeFromCart } from "./RTK/Slices/cartSlice";

export default function CartCard({ item }) {
  const dispatch = useDispatch();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", border: "1px solid #ccc", padding: "10px" }}>
      <img src={item.thumbnail || item.images?.[0]} alt={item.title} width="50" />
      <p>{item.title}</p>
      <p>${item.price}</p>
      <button onClick={() => dispatch(decreaseQuantity(item.id))} disabled={item.quantity === 1}>-</button>
      <span>{item.quantity}</span>
      <button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
      <button onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
    </div>
  );
}   */

















  import React from "react";
import { useDispatch } from "react-redux";
import { increaseQuantity, decreaseQuantity, removeFromCart } from "./RTK/Slices/cartSlice";

export default function CartCard({ item }) {
  const dispatch = useDispatch();

  // التحقق من إمكانية زيادة الكمية
  const canIncrease = item.quantity < (item.stock || 0);

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: "10px", 
      marginBottom: "10px", 
      border: "1px solid #ccc", 
      padding: "10px",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9"
    }}>
      <img 
        src={item.thumbnail || item.images?.[0]} 
        alt={item.title} 
        width="50" 
        style={{ borderRadius: "4px" }}
      />
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: "bold" }}>{item.title}</p>
        <p style={{ margin: 0, color: "#666" }}>${item.price}</p>
        <small style={{ color: "#888" }}>
          Stock: {item.stock || 0} units
        </small>
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button 
          onClick={() => dispatch(decreaseQuantity(item.id))} 
          disabled={item.quantity === 1}
          style={{
            padding: "5px 10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: item.quantity === 1 ? "#f0f0f0" : "#fff",
            cursor: item.quantity === 1 ? "not-allowed" : "pointer"
          }}
        >
          -
        </button>
        
        <span style={{ 
          padding: "5px 10px", 
          border: "1px solid #ddd",
          borderRadius: "4px",
          minWidth: "30px",
          textAlign: "center",
          fontWeight: "bold"
        }}>
          {item.quantity}
        </span>
        
        <button 
          onClick={() => canIncrease && dispatch(increaseQuantity(item.id))}
          disabled={!canIncrease}
          style={{
            padding: "5px 10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: canIncrease ? "#4CAF50" : "#f0f0f0",
            color: canIncrease ? "white" : "#999",
            cursor: canIncrease ? "pointer" : "not-allowed"
          }}
        >
          +
        </button>
      </div>
      
      <button 
        onClick={() => dispatch(removeFromCart(item.id))}
        style={{
          padding: "5px 10px",
          border: "1px solid #f44336",
          borderRadius: "4px",
          backgroundColor: "#f44336",
          color: "white",
          cursor: "pointer"
        }}
      >
        Remove
      </button>
      
      {!canIncrease && (
        <small style={{ color: "#f44336", marginLeft: "10px" }}>
          Maximum stock reached
        </small>
      )}
    </div>
  );
}

 