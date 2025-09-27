 
/* import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./Slices/cartSlice";
import productsReducer from "./Slices/productsSlice";
import { loadCart } from "./Slices/cartSlice";

// تحميل المستخدم من localStorage
const getCurrentUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.email : 'guest';
  } catch (e) {
    return 'guest';
  }
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
  },
  preloadedState: {
    cart: loadCart(getCurrentUser()),
  },
});

// اشترك في تغييرات الحالة لحفظ السلة تلقائياً
store.subscribe(() => {
  const state = store.getState();
  const userEmail = getCurrentUser();
  localStorage.setItem(`cart_${userEmail}`, JSON.stringify(state.cart));
});

export default store; */
 



































import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./Slices/cartSlice";
import productsReducer from "./Slices/productsSlice";
import { loadCart } from "./Slices/cartSlice";

// تحميل المستخدم من localStorage
const getCurrentUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.email : 'guest';
  } catch (e) {
    return 'guest';
  }
};

// تحميل الحالة الأولية للسلة
const preloadedState = {
  cart: loadCart(getCurrentUser())
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
  },
  preloadedState: preloadedState,
});

// اشترك في تغييرات الحالة لحفظ السلة تلقائياً
store.subscribe(() => {
  const state = store.getState();
  const userEmail = getCurrentUser();
  
  try {
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(state.cart));
  } catch (e) {
    console.error("Error saving cart to localStorage:", e);
  }
});

export default store;