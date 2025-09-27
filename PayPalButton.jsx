 

 import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "./RTK/Slices/cartSlice";
import { useNavigate } from "react-router-dom";

const PayPalButton = ({ totalPrice }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart) || [];
  const [{ options, isPending }] = usePayPalScriptReducer();

  const createOrder = (data, actions) => {
    return actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: new Date().getTime().toString(),
          description: "Purchase from our store",
          amount: {
            currency_code: "USD",
            value: totalPrice.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: totalPrice.toFixed(2)
              }
            }
          },
          items: cart.map(item => ({
            name: item.title,
            description: item.description || "Product description",
            sku: item.id.toString(),
            unit_amount: {
              currency_code: "USD",
              value: item.price.toFixed(2)
            },
            quantity: item.quantity.toString(),
            category: "PHYSICAL_GOODS"
          }))
        }
      ]
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture(data.orderID).then((details) => {
      console.log("Payment details:", details);
      
      // التحقق من حالة الدفع
      const status = details.status;
      const transaction = details.purchase_units[0].payments.captures[0];
      
      if (status === "COMPLETED" && transaction.status === "COMPLETED") {
        alert(`Payment completed successfully! Transaction ID: ${transaction.id}`);
        dispatch(clearCart());
        navigate("/thank-you", { 
          state: { 
            orderId: data.orderID, 
            transactionId: transaction.id,
            status: "completed"
          } 
        });
      } else {
        throw new Error(`Payment not completed. Status: ${status}`);
      }
    });
  };

  const onError = (err) => {
    console.error("PayPal error:", err);
    
    // تحليل الخطأ وتقديم رسالة مناسبة
    let errorMessage = "An error occurred with your payment. Please try again.";
    
    if (err.message) {
      if (err.message.includes('popup')) {
        errorMessage = "You closed the PayPal window before completing the payment.";
      } else if (err.message.includes('TOKEN')) {
        errorMessage = "Your payment session has expired. Please try again.";
      } else if (err.message.includes('DECLINED')) {
        errorMessage = "Your payment was declined. Please try a different payment method.";
      } else if (err.message.includes('DUPLICATE')) {
        errorMessage = "This appears to be a duplicate transaction. Please check if you were already charged.";
      }
    }
    
    alert(errorMessage);
  };

  const onCancel = (data) => {
    console.log("Payment cancelled:", data);
    alert("You have cancelled the payment. You can return to complete your purchase later.");
  };

  if (isPending) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <div style={{ marginRight: '10px' }}>
          <div className="spinner"></div>
        </div>
        <span>Loading PayPal...</span>
        <style jsx>{`
          .spinner {
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 3px solid #3498db;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "paypal",
          height: 48
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        onCancel={onCancel}
        options={{
          disableFunding: "card,credit,venmo",
          currency: "USD"
        }}
      />
    </div>
  );
};

export default PayPalButton;
