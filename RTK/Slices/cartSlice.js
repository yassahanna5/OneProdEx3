/* 

 import { createSlice } from "@reduxjs/toolkit";

// دالة مساعدة للحفظ مع مراعاة المستخدم
const saveCart = (cart, userEmail = 'guest') => {
  try {
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
  } catch (e) {
    console.error("Could not save cart", e);
  }
};

// دالة مساعدة لتحميل السلة بناءً على المستخدم
export const loadCart = (userEmail = 'guest') => {
  try {
    const serializedCart = localStorage.getItem(`cart_${userEmail}`);
    if (serializedCart === null) {
      return [];
    }
    return JSON.parse(serializedCart);
  } catch (e) {
    console.error("Could not load cart", e);
    return [];
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const item = state.find((p) => p.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      return state.filter((p) => p.id !== action.payload);
    },
    clearCart: () => {
      return [];
    },
    increaseQuantity: (state, action) => {
      const item = state.find((p) => p.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.find((p) => p.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    setCart: (state, action) => {
      return action.payload;
    }
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  setCart
} = cartSlice.actions;
export default cartSlice.reducer; */
 






































































/*import { createSlice } from "@reduxjs/toolkit";

// دالة مساعدة للحفظ مع مراعاة المستخدم
const saveCart = (cart, userEmail = 'guest') => {
  try {
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
  } catch (e) {
    console.error("Could not save cart", e);
  }
};

// دالة مساعدة لتحميل السلة بناءً على المستخدم
export const loadCart = (userEmail = 'guest') => {
  try {
    const serializedCart = localStorage.getItem(`cart_${userEmail}`);
    if (serializedCart === null) {
      return [];
    }
    return JSON.parse(serializedCart);
  } catch (e) {
    console.error("Could not load cart", e);
    return [];
  }
};

// دالة مساعدة للتحقق من توفر المخزون
const checkStockAvailability = (product, currentQuantity = 0, requestedIncrease = 1) => {
  const availableStock = product.stock || product.quantity || 0;
  const newTotalQuantity = currentQuantity + requestedIncrease;
  
  if (availableStock <= 0) {
    return { 
      canProceed: false, 
      message: "This product is out of stock" 
    };
  }
  
  if (newTotalQuantity > availableStock) {
    return { 
      canProceed: false, 
      message: `Only ${availableStock} items available in stock. You already have ${currentQuantity} in cart.` 
    };
  }
  
  return { 
    canProceed: true, 
    message: null 
  };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: {
      reducer: (state, action) => {
        const { product, quantity = 1 } = action.payload;
        const item = state.find((p) => p.id === product.id);
        
        const currentQuantity = item ? item.quantity : 0;
        const stockCheck = checkStockAvailability(product, currentQuantity, quantity);
        
        if (!stockCheck.canProceed) {
          // نرمي خطأ يمكن معالجته في المكون
          throw new Error(stockCheck.message);
        }
        
        if (item) {
          item.quantity += quantity;
        } else {
          state.push({ ...product, quantity });
        }
      },
      prepare: (product, quantity = 1) => {
        return { payload: { product, quantity } };
      }
    },
    
    removeFromCart: (state, action) => {
      return state.filter((p) => p.id !== action.payload);
    },
    
    clearCart: () => {
      return [];
    },
    
    increaseQuantity: (state, action) => {
      const { productId, increaseBy = 1 } = action.payload;
      const item = state.find((p) => p.id === productId);
      
      if (item) {
        const stockCheck = checkStockAvailability(item, item.quantity, increaseBy);
        
        if (!stockCheck.canProceed) {
          throw new Error(stockCheck.message);
        }
        
        item.quantity += increaseBy;
      }
    },
    
    decreaseQuantity: (state, action) => {
      const item = state.find((p) => p.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    
    setQuantity: (state, action) => {
      const { productId, newQuantity } = action.payload;
      const item = state.find((p) => p.id === productId);
      
      if (item) {
        const stockCheck = checkStockAvailability(item, 0, newQuantity);
        
        if (!stockCheck.canProceed) {
          throw new Error(stockCheck.message);
        }
        
        item.quantity = newQuantity;
      }
    },
    
    setCart: (state, action) => {
      return action.payload;
    }
  },
});

// إنشاء thunk للتعامل مع الأخطاء بشكل أنيق
export const addToCartWithStockCheck = (product, quantity = 1) => {
  return (dispatch, getState) => {
    try {
      dispatch(addToCart({ product, quantity }));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
};

export const increaseQuantityWithStockCheck = (productId, increaseBy = 1) => {
  return (dispatch, getState) => {
    try {
      dispatch(increaseQuantity({ productId, increaseBy }));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
};

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  setQuantity,
  setCart
} = cartSlice.actions;

export default cartSlice.reducer;*/



















































/*import { createSlice } from "@reduxjs/toolkit";

// دالة مساعدة للحفظ مع مراعاة المستخدم
const saveCart = (cart, userEmail = 'guest') => {
  try {
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
  } catch (e) {
    console.error("Could not save cart", e);
  }
};

// دالة مساعدة لتحميل السلة بناءً على المستخدم
export const loadCart = (userEmail = 'guest') => {
  try {
    const serializedCart = localStorage.getItem(`cart_${userEmail}`);
    if (serializedCart === null) {
      return []; // إرجاع array فارغة وليس object
    }
    return JSON.parse(serializedCart);
  } catch (e) {
    console.error("Could not load cart", e);
    return []; // إرجاع array فارغة وليس object
  }
};

// دالة مساعدة للتحقق من توفر المخزون
const checkStockAvailability = (product, currentQuantity = 0, requestedIncrease = 1) => {
  const availableStock = product.stock || product.quantity || 0;
  const newTotalQuantity = currentQuantity + requestedIncrease;
  
  if (availableStock <= 0) {
    return { 
      canProceed: false, 
      message: "This product is out of stock"
    };
  }
  
  if (newTotalQuantity > availableStock) {
    return { 
      canProceed: false, 
      message: `Only ${availableStock} items available in stock. You already have ${currentQuantity} in cart.`
    };
  }
  
  return { 
    canProceed: true, 
    message: null 
  };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: [], // الحفاظ على array وليس object
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const item = state.find((p) => p.id === product.id);
      
      const currentQuantity = item ? item.quantity : 0;
      const stockCheck = checkStockAvailability(product, currentQuantity, quantity);
      
      if (!stockCheck.canProceed) {
        // عرض إشعار بسيط
        if (typeof window !== 'undefined') {
          alert(stockCheck.message);
        }
        return; // نمنع الإضافة
      }
      
      if (item) {
        item.quantity += quantity;
      } else {
        state.push({ ...product, quantity });
      }
      
      // حفظ تلقائي
      const user = JSON.parse(localStorage.getItem("user"));
      const userEmail = user ? user.email : 'guest';
      saveCart(state, userEmail);
    },
    
    removeFromCart: (state, action) => {
      const newState = state.filter((p) => p.id !== action.payload);
      
      // حفظ تلقائي
      const user = JSON.parse(localStorage.getItem("user"));
      const userEmail = user ? user.email : 'guest';
      saveCart(newState, userEmail);
      
      return newState;
    },
    
    clearCart: () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const userEmail = user ? user.email : 'guest';
      saveCart([], userEmail);
      return [];
    },
    
    increaseQuantity: (state, action) => {
      const { productId, increaseBy = 1 } = action.payload;
      const item = state.find((p) => p.id === productId);
      
      if (item) {
        const stockCheck = checkStockAvailability(item, item.quantity, increaseBy);
        
        if (!stockCheck.canProceed) {
          if (typeof window !== 'undefined') {
            alert(stockCheck.message);
          }
          return; // نمنع الزيادة
        }
        
        item.quantity += increaseBy;
        
        // حفظ تلقائي
        const user = JSON.parse(localStorage.getItem("user"));
        const userEmail = user ? user.email : 'guest';
        saveCart(state, userEmail);
      }
    },
    
    decreaseQuantity: (state, action) => {
      const item = state.find((p) => p.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        
        // حفظ تلقائي
        const user = JSON.parse(localStorage.getItem("user"));
        const userEmail = user ? user.email : 'guest';
        saveCart(state, userEmail);
      }
    },
    
    setQuantity: (state, action) => {
      const { productId, newQuantity } = action.payload;
      const item = state.find((p) => p.id === productId);
      
      if (item) {
        const stockCheck = checkStockAvailability(item, 0, newQuantity);
        
        if (!stockCheck.canProceed) {
          if (typeof window !== 'undefined') {
            alert(stockCheck.message);
          }
          return;
        }
        
        item.quantity = newQuantity;
        
        // حفظ تلقائي
        const user = JSON.parse(localStorage.getItem("user"));
        const userEmail = user ? user.email : 'guest';
        saveCart(state, userEmail);
      }
    },
    
    setCart: (state, action) => {
      // التأكد من أن action.payload هو array
      if (Array.isArray(action.payload)) {
        return action.payload;
      }
      // إذا كان object، نحوله إلى array
      if (action.payload && action.payload.items && Array.isArray(action.payload.items)) {
        return action.payload.items;
      }
      // إذا فشل كل شيء، نرجع array فارغة
      return [];
    }
  },
});

// إصدارات مبسطة للإستخدام
export const addToCartWithCheck = (product, quantity = 1) => {
  return (dispatch) => {
    dispatch({ type: 'cart/addToCart', payload: { product, quantity } });
  };
};

export const increaseQuantityWithCheck = (productId, increaseBy = 1) => {
  return (dispatch) => {
    dispatch({ type: 'cart/increaseQuantity', payload: { productId, increaseBy } });
  };
};

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  setQuantity,
  setCart
} = cartSlice.actions;

export default cartSlice.reducer;*/








































































 /*import { createSlice } from "@reduxjs/toolkit";

// دالة مساعدة للحفظ مع مراعاة المستخدم
const saveCart = (cart, userEmail = 'guest') => {
  try {
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
  } catch (e) {
    console.error("Could not save cart", e);
  }
};

// دالة مساعدة لتحميل السلة بناءً على المستخدم
export const loadCart = (userEmail = 'guest') => {
  try {
    const serializedCart = localStorage.getItem(`cart_${userEmail}`);
    if (serializedCart === null) {
      return []; // إرجاع array فارغة وليس object
    }
    return JSON.parse(serializedCart);
  } catch (e) {
    console.error("Could not load cart", e);
    return []; // إرجاع array فارغة وليس object
  }
};

// دالة مساعدة للتحقق من توفر المخزون (محدثة)
const checkStockAvailability = (product, currentQuantity = 0, requestedIncrease = 1) => {
  const availableStock = product.stock || product.quantity || 0;
  const newTotalQuantity = currentQuantity + requestedIncrease;
  
  if (availableStock <= 0) {
    return { 
      canProceed: false, 
      message: "This product is out of stock"
    };
  }
  
  if (newTotalQuantity > availableStock) {
    return { 
      canProceed: false, 
      message: `Only ${availableStock} items available in stock. You already have ${currentQuantity} in cart.`
    };
  }
  
  return { 
    canProceed: true, 
    message: null 
  };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: [], // الحفاظ على array وليس object
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const item = state.find((p) => p.id === product.id);
      
      const currentQuantity = item ? item.quantity : 0;
      const stockCheck = checkStockAvailability(product, currentQuantity, quantity);
      
      if (!stockCheck.canProceed) {
        // عرض إشعار بسيط
        if (typeof window !== 'undefined') {
          alert(stockCheck.message);
        }
        return; // نمنع الإضافة
      }
      
      if (item) {
        item.quantity += quantity;
      } else {
        state.push({ ...product, quantity });
      }
      
      // حفظ تلقائي
      const user = JSON.parse(localStorage.getItem("user"));
      const userEmail = user ? user.email : 'guest';
      saveCart(state, userEmail);
    },
    
    removeFromCart: (state, action) => {
      const newState = state.filter((p) => p.id !== action.payload);
      
      // حفظ تلقائي
      const user = JSON.parse(localStorage.getItem("user"));
      const userEmail = user ? user.email : 'guest';
      saveCart(newState, userEmail);
      
      return newState;
    },
    
    clearCart: () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const userEmail = user ? user.email : 'guest';
      saveCart([], userEmail);
      return [];
    },
    
    increaseQuantity: (state, action) => {
      const { productId, increaseBy = 1 } = action.payload;
      const item = state.find((p) => p.id === productId);
      
      if (item) {
        const stockCheck = checkStockAvailability(item, item.quantity, increaseBy);
        
        if (!stockCheck.canProceed) {
          if (typeof window !== 'undefined') {
            alert(stockCheck.message);
          }
          return; // نمنع الزيادة
        }
        
        item.quantity += increaseBy;
        
        // حفظ تلقائي
        const user = JSON.parse(localStorage.getItem("user"));
        const userEmail = user ? user.email : 'guest';
        saveCart(state, userEmail);
      }
    },
    
    decreaseQuantity: (state, action) => {
      const item = state.find((p) => p.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        
        // حفظ تلقائي
        const user = JSON.parse(localStorage.getItem("user"));
        const userEmail = user ? user.email : 'guest';
        saveCart(state, userEmail);
      }
    },
    
    setQuantity: (state, action) => {
      const { productId, newQuantity } = action.payload;
      const item = state.find((p) => p.id === productId);
      
      if (item) {
        const stockCheck = checkStockAvailability(item, 0, newQuantity);
        
        if (!stockCheck.canProceed) {
          if (typeof window !== 'undefined') {
            alert(stockCheck.message);
          }
          return;
        }
        
        item.quantity = newQuantity;
        
        // حفظ تلقائي
        const user = JSON.parse(localStorage.getItem("user"));
        const userEmail = user ? user.email : 'guest';
        saveCart(state, userEmail);
      }
    },
    
    setCart: (state, action) => {
      // التأكد من أن action.payload هو array
      if (Array.isArray(action.payload)) {
        return action.payload;
      }
      // إذا كان object، نحوله إلى array
      if (action.payload && action.payload.items && Array.isArray(action.payload.items)) {
        return action.payload.items;
      }
      // إذا فشل كل شيء، نرجع array فارغة
      return [];
    }
  },
});

// إصدارات مبسطة للإستخدام
export const addToCartWithCheck = (product, quantity = 1) => {
  return (dispatch) => {
    dispatch({ type: 'cart/addToCart', payload: { product, quantity } });
  };
};

export const increaseQuantityWithCheck = (productId, increaseBy = 1) => {
  return (dispatch) => {
    dispatch({ type: 'cart/increaseQuantity', payload: { productId, increaseBy } });
  };
};

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  setQuantity,
  setCart
} = cartSlice.actions;

export default cartSlice.reducer; */


















import { createSlice } from "@reduxjs/toolkit";

// دالة مساعدة للحفظ مع مراعاة المستخدم
const saveCart = (cart, userEmail = 'guest') => {
  try {
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
  } catch (e) {
    console.error("Could not save cart", e);
  }
};

// دالة مساعدة لتحميل السلة بناءً على المستخدم
export const loadCart = (userEmail = 'guest') => {
  try {
    const serializedCart = localStorage.getItem(`cart_${userEmail}`);
    if (serializedCart === null) {
      return [];
    }
    return JSON.parse(serializedCart);
  } catch (e) {
    console.error("Could not load cart", e);
    return [];
  }
};

// دالة مساعدة للتحقق من توفر المخزون
const checkStockAvailability = (product, currentQuantity = 0, requestedIncrease = 1) => {
  const availableStock = product.stock || 0;
  const newTotalQuantity = currentQuantity + requestedIncrease;
  
  if (availableStock <= 0) {
    return { 
      canProceed: false, 
      message: "This product is out of stock"
    };
  }
  
  if (newTotalQuantity > availableStock) {
    return { 
      canProceed: false, 
      message: `Only ${availableStock} items available in stock. You already have ${currentQuantity} in cart.`
    };
  }
  
  return { 
    canProceed: true, 
    message: null 
  };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    // إصدار مبسط لـ addToCart
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.find((item) => item.id === product.id);
      
      if (existingItem) {
        // إذا المنتج موجود، نزيد الكمية مع التحقق من المخزون
        const stockCheck = checkStockAvailability(product, existingItem.quantity, 1);
        
        if (!stockCheck.canProceed) {
          if (typeof window !== 'undefined') {
            alert(stockCheck.message);
          }
          return;
        }
        
        existingItem.quantity += 1;
      } else {
        // إذا المنتج جديد، نتحقق من المخزون قبل الإضافة
        const stockCheck = checkStockAvailability(product, 0, 1);
        
        if (!stockCheck.canProceed) {
          if (typeof window !== 'undefined') {
            alert(stockCheck.message);
          }
          return;
        }
        
        state.push({ 
          ...product, 
          quantity: 1 
        });
      }
      
      // حفظ في localStorage
      const user = JSON.parse(localStorage.getItem("user") || 'null');
      const userEmail = user ? user.email : 'guest';
      saveCart(state, userEmail);
    },
    
    // إصدار متوافق مع CartCard (بدون payload معقد)
    increaseQuantity: (state, action) => {
      const productId = action.payload; // الآن يأخذ id مباشرة
      const item = state.find((item) => item.id === productId);
      
      if (item) {
        const stockCheck = checkStockAvailability(item, item.quantity, 1);
        
        if (!stockCheck.canProceed) {
          if (typeof window !== 'undefined') {
            alert(stockCheck.message);
          }
          return;
        }
        
        item.quantity += 1;
        
        const user = JSON.parse(localStorage.getItem("user") || 'null');
        const userEmail = user ? user.email : 'guest';
        saveCart(state, userEmail);
      }
    },
    
    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.find((item) => item.id === productId);
      
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // إذا كانت الكمية 1، نزيل المنتج من السلة
          return state.filter((item) => item.id !== productId);
        }
        
        const user = JSON.parse(localStorage.getItem("user") || 'null');
        const userEmail = user ? user.email : 'guest';
        saveCart(state, userEmail);
      }
    },
    
    removeFromCart: (state, action) => {
      const newState = state.filter((item) => item.id !== action.payload);
      
      const user = JSON.parse(localStorage.getItem("user") || 'null');
      const userEmail = user ? user.email : 'guest';
      saveCart(newState, userEmail);
      
      return newState;
    },
    
    clearCart: () => {
      const user = JSON.parse(localStorage.getItem("user") || 'null');
      const userEmail = user ? user.email : 'guest';
      saveCart([], userEmail);
      return [];
    },
    
    setQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.find((item) => item.id === productId);
      
      if (item && quantity > 0) {
        const stockCheck = checkStockAvailability(item, 0, quantity);
        
        if (!stockCheck.canProceed) {
          if (typeof window !== 'undefined') {
            alert(stockCheck.message);
          }
          return;
        }
        
        item.quantity = quantity;
        
        const user = JSON.parse(localStorage.getItem("user") || 'null');
        const userEmail = user ? user.email : 'guest';
        saveCart(state, userEmail);
      }
    },
    
    setCart: (state, action) => {
      if (Array.isArray(action.payload)) {
        return action.payload;
      }
      return [];
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  setQuantity,
  setCart
} = cartSlice.actions;

export default cartSlice.reducer;















/*import { createSlice } from "@reduxjs/toolkit";

// دالة مساعدة للحفظ مع مراعاة المستخدم
const saveCart = (cart, userEmail = 'guest') => {
  try {
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
  } catch (e) {
    console.error("Could not save cart", e);
  }
};

// دالة مساعدة لتحميل السلة بناءً على المستخدم
export const loadCart = (userEmail = 'guest') => {
  try {
    const serializedCart = localStorage.getItem(`cart_${userEmail}`);
    if (serializedCart === null) {
      return [];
    }
    return JSON.parse(serializedCart);
  } catch (e) {
    console.error("Could not load cart", e);
    return [];
  }
};

// دالة مساعدة للتحقق من توفر المخزون
const checkStockAvailability = (product, currentQuantity = 0, requestedIncrease = 1) => {
  const availableStock = product.stock || 0;
  const newTotalQuantity = currentQuantity + requestedIncrease;
  
  if (availableStock <= 0) {
    return { 
      canProceed: false, 
      message: "This product is out of stock"
    };
  }
  
  if (newTotalQuantity > availableStock) {
    return { 
      canProceed: false, 
      message: `Only ${availableStock} items available in stock. You already have ${currentQuantity} in cart.`
    };
  }
  
  return { 
    canProceed: true, 
    message: null 
  };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    // تصحيح action addToCart - يجب أن يكون payload مباشراً
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.find((item) => item.id === product.id);
      
      if (existingItem) {
        // إذا المنتج موجود بالفعل، نزيد الكمية
        const stockCheck = checkStockAvailability(product, existingItem.quantity, 1);
        
        if (!stockCheck.canProceed) {
          if (typeof window !== 'undefined') {
            alert(stockCheck.message);
          }
          return;
        }
        
        existingItem.quantity += 1;
      } else {
        // إذا المنتج جديد، نتحقق من المخزون قبل الإضافة
        const stockCheck = checkStockAvailability(product, 0, 1);
        
        if (!stockCheck.canProceed) {
          if (typeof window !== 'undefined') {
            alert(stockCheck.message);
          }
          return;
        }
        
        state.push({ 
          ...product, 
          quantity: 1 
        });
      }
      
      // حفظ في localStorage
      const user = JSON.parse(localStorage.getItem("user") || 'null');
      const userEmail = user ? user.email : 'guest';
      saveCart(state, userEmail);
    },
    
    removeFromCart: (state, action) => {
      const newState = state.filter((item) => item.id !== action.payload);
      
      const user = JSON.parse(localStorage.getItem("user") || 'null');
      const userEmail = user ? user.email : 'guest';
      saveCart(newState, userEmail);
      
      return newState;
    },
    
    clearCart: () => {
      const user = JSON.parse(localStorage.getItem("user") || 'null');
      const userEmail = user ? user.email : 'guest';
      saveCart([], userEmail);
      return [];
    },
    
    increaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.find((item) => item.id === productId);
      
      if (item) {
        const stockCheck = checkStockAvailability(item, item.quantity, 1);
        
        if (!stockCheck.canProceed) {
          if (typeof window !== 'undefined') {
            alert(stockCheck.message);
          }
          return;
        }
        
        item.quantity += 1;
        
        const user = JSON.parse(localStorage.getItem("user") || 'null');
        const userEmail = user ? user.email : 'guest';
        saveCart(state, userEmail);
      }
    },
    
    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.find((item) => item.id === productId);
      
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // إذا كانت الكمية 1، نزيل المنتج من السلة
          return state.filter((item) => item.id !== productId);
        }
        
        const user = JSON.parse(localStorage.getItem("user") || 'null');
        const userEmail = user ? user.email : 'guest';
        saveCart(state, userEmail);
      }
    },
    
    setQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.find((item) => item.id === productId);
      
      if (item && quantity > 0) {
        const stockCheck = checkStockAvailability(item, 0, quantity);
        
        if (!stockCheck.canProceed) {
          if (typeof window !== 'undefined') {
            alert(stockCheck.message);
          }
          return;
        }
        
        item.quantity = quantity;
        
        const user = JSON.parse(localStorage.getItem("user") || 'null');
        const userEmail = user ? user.email : 'guest';
        saveCart(state, userEmail);
      }
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  setQuantity
} = cartSlice.actions;

export default cartSlice.reducer;*/