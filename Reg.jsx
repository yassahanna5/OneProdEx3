 

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import regphoto from "./assets/reg-img.jpg";

export default function Reg() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.email === email)) {
      alert("Email already exists");
      return;
    }

    const newUser = { name, email, password };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    try {
      await axios.post("https://oneprodex10.up.railway.app/api/auth/register", newUser);
    } catch (err) {
      console.log("MongoDB API error:", err);
    }

    alert("Registration successful");
    navigate("/log");
  };

  // ---- BACKGROUND SPLIT DESIGN ----
  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff6f6",
    }}>
      <div style={{
        display: "flex",
        width: "720px",
        maxWidth: "98vw",
        minHeight: "60vh",
        background: "white",
        borderRadius: "18px",
        boxShadow: "0 8px 32px rgba(255,107,107,0.13)",
        overflow: "hidden",
      }}>
        {/* Image Side */}
        <div style={{
          flex: 1,
          background: "#fff0f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "36px 12px"
        }}>
          <img
            src= {regphoto}   
            alt="Register Art"
            style={{
              width: "85%",
              maxWidth: "340px",
              borderRadius: "25px",
              boxShadow: "0 2px 16px rgba(255,107,107,0.10)",
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
            color: "#ff6b6b",
            fontWeight: 800,
            fontSize: "2rem",
            letterSpacing: "2px"
          }}>
            Register
          </h2>
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "18px", width: "100%" }}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1.5px solid #f8bbd0",
                fontSize: "1rem",
                background: "#fff0f6",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              required
              onFocus={e => e.target.style.borderColor = "#ff6b6b"}
              onBlur={e => e.target.style.borderColor = "#f8bbd0"}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1.5px solid #f8bbd0",
                fontSize: "1rem",
                background: "#fff0f6",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              required
              onFocus={e => e.target.style.borderColor = "#ff6b6b"}
              onBlur={e => e.target.style.borderColor = "#f8bbd0"}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1.5px solid #f8bbd0",
                fontSize: "1rem",
                background: "#fff0f6",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              required
              onFocus={e => e.target.style.borderColor = "#ff6b6b"}
              onBlur={e => e.target.style.borderColor = "#f8bbd0"}
            />
            <button
              type="submit"
              style={{
                padding: "13px",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(90deg,#ff6b6b 0%, #ff000d 100%)",
                color: "white",
                fontWeight: 700,
                fontSize: "1.05rem",
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(255,107,107,0.10)",
                transition: "background 0.2s"
              }}>
              Register
            </button>
          </form>
          <p style={{ marginTop: "20px", fontSize: "1rem", color: "#ff6b6b" }}>
            Already have an account?{" "}
            <Link to="/log" style={{ color: "#ff000d", fontWeight: 700, textDecoration: "underline" }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}










 
