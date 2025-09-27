 
  import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCart } from "./RTK/Slices/cartSlice";
import { loadCart } from "./RTK/Slices/cartSlice";
import axios from "axios";
import logphoto from "./assets/log-img.jpg";

export default function Log() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const name = searchParams.get("name");
  const emailFromGoogle = searchParams.get("email");
  const id = searchParams.get("id");

  // تعريف بيانات المسؤول
  const adminEmail = "adminEngYassaHanna2030@gmail.com";
  const adminPassword = "adminEngYassaHanna2030";

  useEffect(() => {
    if (token && emailFromGoogle) {
      const user = { 
        id, 
        name, 
        email: emailFromGoogle,
        role: emailFromGoogle === adminEmail ? "admin" : "user"
      };
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      const savedCart = JSON.parse(localStorage.getItem("cart_" + emailFromGoogle)) || [];
      dispatch(setCart(savedCart));

      window.dispatchEvent(new Event("storage"));
      
      // التحقق إذا كان المستخدم مسؤولاً
      if (emailFromGoogle === adminEmail) {
        navigate("/AdminDashboard");
      } else {
        navigate("/");
      }
    }
  }, [token, emailFromGoogle, id, name, navigate, dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // التحقق إذا كان المستخدم يحاول تسجيل الدخول كمسؤول
    if (email === adminEmail && password === adminPassword) {
      const adminUser = {
        id: "admin-001",
        name: "Admin Eng Yassa Hanna",
        email: adminEmail,
        role: "admin"
      };
      
      localStorage.setItem("user", JSON.stringify(adminUser));
      localStorage.setItem("token", "admin-token");
      
      // تحميل عربة التسوق الخاصة للادمن (لو موجودة)
      const savedCart = loadCart(adminEmail);
      dispatch(setCart(savedCart));
      localStorage.removeItem("cart_guest");
      
      navigate("/AdminDashboard");
      window.location.reload();
      return;
    }
    
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    let user = storedUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      try {
        const res = await axios.post("https://oneprodex.up.railway.app/api/auth/login", { email, password });
        user = res.data.user;
      } catch (err) {
        alert("Email or password incorrect");
        return;
      }
    }

    localStorage.setItem("user", JSON.stringify(user));
    const savedCart = loadCart(user.email);
    dispatch(setCart(savedCart));
    localStorage.removeItem("cart_guest");

    // التوجيه حسب الدور
    if (user.role === "admin" || email === adminEmail) {
      navigate("/AdminDashboard");
    } else {
      navigate("/");
    }
    window.location.reload();
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://oneprodex.up.railway.app/api/auth/google";
  };

  // ---- BACKGROUND SPLIT DESIGN ----
  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8f8ff",
    }}>
      <div style={{
        display: "flex",
        width: "720px",
        maxWidth: "98vw",
        minHeight: "60vh",
        background: "white",
        borderRadius: "18px",
        boxShadow: "0 8px 32px rgba(99,102,241,0.15)",
        overflow: "hidden",
      }}>
        {/* Image Side */}
        <div style={{
          flex: 1,
          background: "#fff6fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "36px 12px"
        }}>
          <img
            src={logphoto}
            alt="Login Art"
            style={{
              width: "85%",
              maxWidth: "340px",
              borderRadius: "25px",
              boxShadow: "0 2px 16px rgba(99,102,241,0.10)",
              background: "#fff",
              objectFit: "contain"
            }}
          />
        </div>
        {/* Form Side */}
        <div style={{
          flex: 1,
          padding: "40px 30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff"
        }}>
          <h2 style={{
            marginBottom: "24px",
            color: "#6366f1",
            fontWeight: 800,
            fontSize: "2rem",
            letterSpacing: "2px"
          }}>
            Login
          </h2>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px", width: "100%" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1.5px solid #d1d5db",
                fontSize: "1rem",
                background: "#f3f4f6",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              required
              onFocus={e => e.target.style.borderColor = "#6366f1"}
              onBlur={e => e.target.style.borderColor = "#d1d5db"}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1.5px solid #d1d5db",
                fontSize: "1rem",
                background: "#f3f4f6",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              required
              onFocus={e => e.target.style.borderColor = "#6366f1"}
              onBlur={e => e.target.style.borderColor = "#d1d5db"}
            />
            <button
              type="submit"
              style={{
                padding: "13px",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(90deg, #6366f1 0%, #6b73ff 100%)",
                color: "white",
                fontWeight: 700,
                fontSize: "1.05rem",
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(99,102,241,0.07)",
                transition: "background 0.2s"
              }}>
              Login
            </button>
          </form>
          <button
            onClick={handleGoogleLogin}
            style={{
              marginTop: "18px",
              padding: "12px",
              width: "100%",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(90deg,#ea4335 0%, #ff6b6b 100%)",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              fontWeight: 600,
              fontSize: "1rem",
              boxShadow: "0 2px 10px rgba(234,67,53,0.07)",
              marginBottom: "10px"
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24">
              <path fill="#fff" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
            </svg>
            Login with Google
          </button>
          <p style={{ marginTop: "20px", fontSize: "1rem", color: "#6366f1" }}>
            Don't have an account?{" "}
            <Link to="/reg" style={{ color: "#6B73FF", fontWeight: 700, textDecoration: "underline" }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}




 