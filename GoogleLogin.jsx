import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCart } from "./RTK/Slices/cartSlice";

export default function GoogleLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const id = searchParams.get("id");

  useEffect(() => {
    if (token && email) {
      const user = { id, name, email };
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      const savedCart =
        JSON.parse(localStorage.getItem("cart_" + email)) || [];
      dispatch(setCart(savedCart));

      window.dispatchEvent(new Event("storage"));
      navigate("/");
    }
  }, [token, email, id, name, navigate, dispatch]);

  return <div>Logging in with Google... Please wait.</div>;
}
