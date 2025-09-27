 
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function ThankYou() {
  const [orderId, setOrderId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setOrderId(searchParams.get('orderId') || '');
    setIsProcessing(location.state?.processing || false);
  }, [location]); 

  return (
    <div style={{ textAlign: "center", padding: "50px 20px" }}>
      {isProcessing ? (
        <>
          <div style={{ fontSize: "60px", color: "#ff9800", marginBottom: "20px" }}>⏳</div>
          <h2>Payment Processing...</h2>
          <p>Your payment is being processed. This may take a few moments.</p>
          <p>You will receive an email confirmation once processing is complete.</p>
        </>
      ) : (
        <>
          <div style={{ fontSize: "80px", color: "#28a745", marginBottom: "20px" }}>✓</div>
          <h2>Thank You for Your Purchase!</h2>
        </>
      )}
      
      {orderId && (
        <p style={{ background: '#f8f9fa', padding: '10px', borderRadius: '5px', margin: '20px 0' }}>
          Order ID: <strong>{orderId}</strong>
        </p>
      )}
      
      <p>Your order has been confirmed and will be processed shortly.</p>
      <p>You will receive an email confirmation with your order details.</p>
      
      <Link 
        to="/" 
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "10px 20px",
          background: "#0070ba",
          color: "white",
          textDecoration: "none",
          borderRadius: "5px"
        }}
      >
        Continue Shopping
      </Link>
    </div>
  );
}