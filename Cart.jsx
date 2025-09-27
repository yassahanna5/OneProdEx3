/* 
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} from "./RTK/Slices/cartSlice";

export default function Cart() {
  const cart = useSelector((state) => state.cart) || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div style={{ 
      padding: "30px",
      maxWidth: "1200px",
      margin: "0 auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <h2 style={{ 
          fontSize: "28px",
          color: "#333",
          margin: 0
        }}>
          Shopping Cart 🛒
        </h2>
        <span style={{
          fontSize: "18px",
          color: "#666"
        }}>
          {cart.length} {cart.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      {cart.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "12px"
        }}>
          <p style={{
            fontSize: "18px",
            color: "#666",
            margin: 0
          }}>
            Your cart is empty
          </p>
        </div>
      ) : (
        <>
          <div style={{
            display: "grid",
            gap: "20px"
          }}>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s",
                  ":hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                  }
                }}
              >
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: "20px",
                  alignItems: "center"
                }}>
                  
                  <div style={{
                    display: "flex",
                    gap: "10px",
                    overflowX: "auto",
                    paddingBottom: "5px"
                  }}>
                    {item.images?.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${item.title} - Image ${index + 1}`}
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "2px solid #f0f0f0",
                          transition: "transform 0.2s",
                          ":hover": {
                            transform: "scale(1.05)"
                          }
                        }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/120";
                        }}
                      />
                    ))}
                  </div>

                   <div>
                    <h3 style={{
                      fontSize: "20px",
                      color: "#333",
                      margin: "0 0 8px 0"
                    }}>
                      {item.title}
                    </h3>
                    <p style={{
                      fontSize: "18px",
                      color: "#0070ba",
                      fontWeight: "bold",
                      margin: 0
                    }}>
                      ${item.price}
                    </p>
                    <p style={{
                      fontSize: "14px",
                      color: "#666",
                      margin: "8px 0 0 0"
                    }}>
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                   <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "10px"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      backgroundColor: "#f8f9fa",
                      padding: "5px",
                      borderRadius: "8px"
                    }}>
                      <button
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                        disabled={item.quantity === 1}
                        style={{
                          background: item.quantity === 1 ? "#e0e0e0" : "#0070ba",
                          color: "white",
                          border: "none",
                          width: "32px",
                          height: "32px",
                          borderRadius: "6px",
                          cursor: item.quantity === 1 ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          transition: "background 0.2s"
                        }}
                      >
                        -
                      </button>

                      <span style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        minWidth: "30px",
                        textAlign: "center"
                      }}>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => dispatch(increaseQuantity(item.id))}
                        style={{
                          background: "#0070ba",
                          color: "white",
                          border: "none",
                          width: "32px",
                          height: "32px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          transition: "background 0.2s"
                        }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      style={{
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "background 0.2s",
                        ":hover": {
                          background: "#c82333"
                        }
                      }}
                    >
                      Remove Item
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

           <div style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <h3 style={{
                fontSize: "24px",
                color: "#333",
                margin: 0
              }}>
                Total: ${totalPrice.toFixed(2)}
              </h3>
            </div>

            <div style={{
              display: "flex",
              gap: "15px"
            }}>
              <button
                onClick={() => dispatch(clearCart())}
                style={{
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  transition: "background 0.2s",
                  ":hover": {
                    background: "#c82333"
                  }
                }}
              >
                Clear Cart
              </button>
              
              <button
                onClick={() => navigate("/checkout")}
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  transition: "background 0.2s",
                  ":hover": {
                    background: "#218838"
                  }
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}*/

 




































/*import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} from "./RTK/Slices/cartSlice";

export default function Cart() {
  const cart = useSelector((state) => state.cart) || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // دالة للتحقق من إمكانية زيادة الكمية
  const canIncreaseQuantity = (item) => {
    return item.quantity < (item.stock || item.quantity || 0);
  };

  return (
    <div style={{ 
      padding: "30px",
      maxWidth: "1200px",
      margin: "0 auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <h2 style={{ 
          fontSize: "28px",
          color: "#333",
          margin: 0
        }}>
          Shopping Cart 🛒
        </h2>
        <span style={{
          fontSize: "18px",
          color: "#666"
        }}>
          {cart.length} {cart.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      {cart.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "12px"
        }}>
          <p style={{
            fontSize: "18px",
            color: "#666",
            margin: 0
          }}>
            Your cart is empty
          </p>
        </div>
      ) : (
        <>
          <div style={{
            display: "grid",
            gap: "20px"
          }}>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s",
                  ":hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                  }
                }}
              >
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: "20px",
                  alignItems: "center"
                }}>
                   <div style={{
                    display: "flex",
                    gap: "10px",
                    overflowX: "auto",
                    paddingBottom: "5px"
                  }}>
                    {item.images?.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${item.title} - Image ${index + 1}`}
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "2px solid #f0f0f0",
                          transition: "transform 0.2s",
                          ":hover": {
                            transform: "scale(1.05)"
                          }
                        }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/120";
                        }}
                      />
                    ))}
                  </div>

                   <div>
                    <h3 style={{
                      fontSize: "20px",
                      color: "#333",
                      margin: "0 0 8px 0"
                    }}>
                      {item.title}
                    </h3>
                    <p style={{
                      fontSize: "18px",
                      color: "#0070ba",
                      fontWeight: "bold",
                      margin: 0
                    }}>
                      ${item.price}
                    </p>
                    <p style={{
                      fontSize: "14px",
                      color: "#666",
                      margin: "8px 0 0 0"
                    }}>
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p style={{
                      fontSize: "14px",
                      color: "#888",
                      margin: "4px 0 0 0"
                    }}>
                      Stock: {item.stock || item.quantity || 0} units
                    </p>
                  </div>

                   <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "10px"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      backgroundColor: "#f8f9fa",
                      padding: "5px",
                      borderRadius: "8px"
                    }}>
                      <button
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                        disabled={item.quantity === 1}
                        style={{
                          background: item.quantity === 1 ? "#e0e0e0" : "#0070ba",
                          color: "white",
                          border: "none",
                          width: "32px",
                          height: "32px",
                          borderRadius: "6px",
                          cursor: item.quantity === 1 ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          transition: "background 0.2s"
                        }}
                      >
                        -
                      </button>

                      <span style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        minWidth: "30px",
                        textAlign: "center"
                      }}>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => {
                          if (canIncreaseQuantity(item)) {
                            dispatch(increaseQuantity({ productId: item.id, increaseBy: 1 }));
                          }
                        }}
                        disabled={!canIncreaseQuantity(item)}
                        style={{
                          background: canIncreaseQuantity(item) ? "#0070ba" : "#e0e0e0",
                          color: "white",
                          border: "none",
                          width: "32px",
                          height: "32px",
                          borderRadius: "6px",
                          cursor: canIncreaseQuantity(item) ? "pointer" : "not-allowed",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          transition: "background 0.2s"
                        }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      style={{
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "background 0.2s",
                        ":hover": {
                          background: "#c82333"
                        }
                      }}
                    >
                      Remove Item
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

           <div style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <h3 style={{
                fontSize: "24px",
                color: "#333",
                margin: 0
              }}>
                Total: ${totalPrice.toFixed(2)}
              </h3>
            </div>

            <div style={{
              display: "flex",
              gap: "15px"
            }}>
              <button
                onClick={() => dispatch(clearCart())}
                style={{
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  transition: "background 0.2s",
                  ":hover": {
                    background: "#c82333"
                  }
                }}
              >
                Clear Cart
              </button>
              
              <button
                onClick={() => navigate("/checkout")}
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  transition: "background 0.2s",
                  ":hover": {
                    background: "#218838"
                  }
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}*/























































import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} from "./RTK/Slices/cartSlice";

export default function Cart() {
  const cart = useSelector((state) => state.cart) || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // دالة للتحقق من إمكانية زيادة الكمية - تم التصحيح
  const canIncreaseQuantity = (item) => {
    return item.quantity < (item.stock || 0); // إزالة item.quantity من المقارنة
  };

  return (
    <div style={{ 
      padding: "30px",
      maxWidth: "1200px",
      margin: "0 auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <h2 style={{ 
          fontSize: "28px",
          color: "#333",
          margin: 0
        }}>
          Shopping Cart 🛒
        </h2>
        <span style={{
          fontSize: "18px",
          color: "#666"
        }}>
          {cart.length} {cart.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      {cart.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "12px"
        }}>
          <p style={{
            fontSize: "18px",
            color: "#666",
            margin: 0
          }}>
            Your cart is empty
          </p>
        </div>
      ) : (
        <>
          <div style={{
            display: "grid",
            gap: "20px"
          }}>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s",
                  ":hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                  }
                }}
              >
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: "20px",
                  alignItems: "center"
                }}>
                  {/* قسم الصور */}
                  <div style={{
                    display: "flex",
                    gap: "10px",
                    overflowX: "auto",
                    paddingBottom: "5px"
                  }}>
                    {item.images?.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${item.title} - Image ${index + 1}`}
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "2px solid #f0f0f0",
                          transition: "transform 0.2s",
                          ":hover": {
                            transform: "scale(1.05)"
                          }
                        }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/120";
                        }}
                      />
                    ))}
                  </div>

                  {/* قسم التفاصيل */}
                  <div>
                    <h3 style={{
                      fontSize: "20px",
                      color: "#333",
                      margin: "0 0 8px 0"
                    }}>
                      {item.title}
                    </h3>
                    <p style={{
                      fontSize: "18px",
                      color: "#0070ba",
                      fontWeight: "bold",
                      margin: 0
                    }}>
                      ${item.price}
                    </p>
                    <p style={{
                      fontSize: "14px",
                      color: "#666",
                      margin: "8px 0 0 0"
                    }}>
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p style={{
                      fontSize: "14px",
                      color: "#888",
                      margin: "4px 0 0 0"
                    }}>
                      {/* تم التصحيح هنا أيضاً */}
                      Stock: {item.stock || 0} units
                    </p>
                    {/* إضافة رسالة توضيحية */}
                    {!canIncreaseQuantity(item) && (
                      <p style={{
                        fontSize: "12px",
                        color: "#f44336",
                        margin: "4px 0 0 0",
                        fontStyle: "italic"
                      }}>
                        Maximum stock reached
                      </p>
                    )}
                  </div>

                  {/* قسم الأزرار - تم التصحيح هنا */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "10px"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      backgroundColor: "#f8f9fa",
                      padding: "5px",
                      borderRadius: "8px"
                    }}>
                      <button
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                        disabled={item.quantity === 1}
                        style={{
                          background: item.quantity === 1 ? "#e0e0e0" : "#0070ba",
                          color: "white",
                          border: "none",
                          width: "32px",
                          height: "32px",
                          borderRadius: "6px",
                          cursor: item.quantity === 1 ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          transition: "background 0.2s"
                        }}
                      >
                        -
                      </button>

                      <span style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        minWidth: "30px",
                        textAlign: "center"
                      }}>
                        {item.quantity}
                      </span>

                      {/* التصحيح الرئيسي هنا: إرسال id مباشرة بدلاً من object */}
                      <button
                        onClick={() => {
                          if (canIncreaseQuantity(item)) {
                            dispatch(increaseQuantity(item.id)); // إرسال id مباشرة
                          }
                        }}
                        disabled={!canIncreaseQuantity(item)}
                        style={{
                          background: canIncreaseQuantity(item) ? "#0070ba" : "#e0e0e0",
                          color: "white",
                          border: "none",
                          width: "32px",
                          height: "32px",
                          borderRadius: "6px",
                          cursor: canIncreaseQuantity(item) ? "pointer" : "not-allowed",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          transition: "background 0.2s"
                        }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      style={{
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "background 0.2s",
                        ":hover": {
                          background: "#c82333"
                        }
                      }}
                    >
                      Remove Item
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* قسم المجموع والأزرار */}
          <div style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <h3 style={{
                fontSize: "24px",
                color: "#333",
                margin: 0
              }}>
                Total: ${totalPrice.toFixed(2)}
              </h3>
            </div>

            <div style={{
              display: "flex",
              gap: "15px"
            }}>
              <button
                onClick={() => dispatch(clearCart())}
                style={{
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  transition: "background 0.2s",
                  ":hover": {
                    background: "#c82333"
                  }
                }}
              >
                Clear Cart
              </button>
              
              <button
                onClick={() => navigate("/checkout")}
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  transition: "background 0.2s",
                  ":hover": {
                    background: "#218838"
                  }
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}