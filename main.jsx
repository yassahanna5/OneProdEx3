  
import React from "react";
import ReactDOM from "react-dom/client";
import {  createBrowserRouter , RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./RTK/store";

import App from "./App";
import Home from "./Home";
import Shop from "./Shop";
import Category from "./Category";
import ProductDetails from "./ProductDetails";
import Cart from "./Cart";
import Log from "./Log";
import Reg from "./Reg";
import Checkout from "./Checkout.jsx";
import ThankYou from "./ThankYou.jsx";
import GoogleLogin from "./GoogleLogin";
import AdminDashboard from "./AdminDashboard";
import About from "./About.jsx";

const router =  createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "shop",
        element: <Shop />,
        children: [
          { index: true, element: <Category category="all" /> },
          { path: ":category", element: <Category /> },
        ],
      },
      { path: "product/:id", element: <ProductDetails /> },
      { path: "cart", element: <Cart /> },
      { path: "log", element: <Log /> },
      { path: "reg", element: <Reg /> },
      { path: "google-login", element: <GoogleLogin /> },
      { path: "checkout", element: <Checkout /> },
      { path: "AdminDashboard", element: <AdminDashboard /> },
      { path: "thank-you", element: <ThankYou /> },
      {path:"about",element: <About />}, 
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>

);
