 
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalButton from "./PayPalButton.jsx"; 

export default function Checkout() {
  const cart = useSelector((state) => state.cart) || [];
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // إضافة الـ Client ID الحقيقي هنا
   const initialOptions = {
  "client-id":  "AThvW8JkDKiuXXXlZgxGKqzc-inexSc-paN-1kFaDWl_GafWA-sYJs8MAV33ScPXiIuAVzcQDB90wnBJ",
  currency: "USD",
  intent: "capture",
  components: "buttons",
   
};

  const handleCreditCardSubmit = (e) => {
    e.preventDefault();
    alert("Credit card payment would be processed here!");
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        <h2>Checkout</h2>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {/* قسم معلومات الطلب */}
          <div style={{ flex: "1", minWidth: "300px" }}>
            <h3>Order Summary</h3>
            <div style={{ border: "1px solid #ddd", borderRadius: "5px", padding: "15px" }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <div>
                    <strong>{item.title}</strong> x {item.quantity}
                  </div>
                  <div>${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
              <hr style={{ margin: "15px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <div>Total:</div>
                <div>${totalPrice.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* قسم اختيار طريقة الدفع */}
          <div style={{ flex: "1", minWidth: "300px" }}>
            <h3>Payment Method</h3>
            <div style={{ border: "1px solid #ddd", borderRadius: "5px", padding: "15px" }}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "10px" }}>
                  <input
                    type="radio"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                    style={{ marginRight: "10px" }}
                  />
                  PayPal
                </label>
                
                <label style={{ display: "block", marginBottom: "10px" }}>
                  <input
                    type="radio"
                    value="creditcard"
                    checked={paymentMethod === "creditcard"}
                    onChange={() => setPaymentMethod("creditcard")}
                    style={{ marginRight: "10px" }}
                  />
                  Credit Card
                </label>
              </div>

              {paymentMethod === "creditcard" ? (
                <form onSubmit={handleCreditCardSubmit}>
                  <div style={{ marginBottom: "10px" }}>
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                      required
                    />
                  </div>
                  
                  <div style={{ marginBottom: "10px" }}>
                    <input
                      type="text"
                      placeholder="Name on Card"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                      required
                    />
                  </div>
                  
                  <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      style={{ flex: "1", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                      required
                    />
                    
                    <input
                      type="text"
                      placeholder="CVV"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      style={{ width: "80px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: "#0070ba",
                      color: "white",
                      border: "none",
                      padding: "10px 15px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      width: "100%",
                      fontWeight: "bold",
                    }}
                  >
                    Pay with Credit Card
                  </button>
                </form>
              ) : (
                <PayPalButton totalPrice={totalPrice} />
              )}
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}




















