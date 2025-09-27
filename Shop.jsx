  

  import React, { useEffect, useState, useCallback } from "react";
import { Link, Outlet, useParams, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "./RTK/Slices/cartSlice";

export default function Shop() {
  const [categories, setCategories] = useState([]);
  const [mongoCategories, setMongoCategories] = useState([]);
  const [mongoProducts, setMongoProducts] = useState([]);
  const { category } = useParams();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("dummyjson");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);
  
  // حالة لعرض تفاصيل المنتج
  const [selectedMongoProduct, setSelectedMongoProduct] = useState(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // دالة التحقق من اتصال الخادم
  const checkServerConnection = useCallback(async () => {
    try {
      await axios.get("https://oneprodex.up.railway.app/api/health", { timeout: 5000 });
      setIsOnline(true);
      return true;
    } catch (error) {
      console.error("Server connection error:", error);
      setIsOnline(false);
      return false;
    }
  }, []);

  // دالة إضافة منتج إلى عربة التسوق باستخدام Redux
  const handleAddToCart = (product, event) => {
    if (event) event.stopPropagation();
    
    // التحقق من المخزون قبل الإضافة
    if (product.stock <= 0) {
      alert("هذا المنتج غير متوفر في المخزون");
      return;
    }
    
    dispatch(addToCart(product));
    alert("تمت إضافة المنتج إلى عربة التسوق بنجاح!");
  };

  // دالة لفتح تفاصيل منتج MongoDB
  const openMongoProductDetails = (product) => {
    setSelectedMongoProduct(product);
    setShowProductDetails(true);
    setSelectedImageIndex(0);
  };

  // دالة لإغلاق تفاصيل المنتج
  const closeProductDetails = () => {
    setShowProductDetails(false);
    setSelectedMongoProduct(null);
    setSelectedImageIndex(0);
  };

  // تغيير الصورة المعروضة في نافذة التفاصيل
  const changeImage = (index) => {
    setSelectedImageIndex(index);
  };

  // منع انتشار الحدث عند النقر داخل نافذة التفاصيل
  const handleDetailsClick = (e) => {
    e.stopPropagation();
  };

  // دالة التوجيه إلى صفحة تفاصيل المنتج
  const goToProductDetails = (product) => {
    const productId = product.id || product._id;
    navigate(`/productDetails/${productId}`, { 
      state: { 
        product, 
        source: activeTab,
        category: category || 'all'
      } 
    });
  };

  // دالة محدثة لجلب الفئات من MongoDB
  const fetchMongoCategories = useCallback(async () => {
    try {
      const isConnected = await checkServerConnection();
      if (!isConnected) return [];

      const response = await axios.get("https://oneprodex.up.railway.app/api/categories", { 
        timeout: 10000 
      });
      
      let processedCategories = [];
      if (Array.isArray(response.data)) {
        processedCategories = response.data;
      } else if (response.data.categories && Array.isArray(response.data.categories)) {
        processedCategories = response.data.categories;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        processedCategories = response.data.data;
      }
      
      // تحديث الفئات فقط إذا تغيرت
      setMongoCategories(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(processedCategories)) {
          return processedCategories;
        }
        return prev;
      });
      
      return processedCategories;
    } catch (err) {
      console.error("Error fetching MongoDB categories:", err);
      if (err.code !== 'ECONNABORTED') {
        setError("فشل في تحميل فئات MongoDB. تأكد من تشغيل الخادم المحلي على المنفذ 7000");
      }
      return [];
    }
  }, [checkServerConnection]);

  // دالة محدثة لجلب المنتجات من MongoDB
  const fetchMongoProducts = useCallback(async () => {
    try {
      setLoading(true);
      const isConnected = await checkServerConnection();
      if (!isConnected) {
        setLoading(false);
        return;
      }

      const response = await axios.get("https://oneprodex.up.railway.app/api/products", { 
        timeout: 10000 
      });
      
      let processedProducts = [];
      if (Array.isArray(response.data)) {
        processedProducts = response.data;
      } else if (response.data.products && Array.isArray(response.data.products)) {
        processedProducts = response.data.products;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        processedProducts = response.data.data;
      }

      // تحديث المنتجات فقط إذا تغيرت
      setMongoProducts(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(processedProducts)) {
          setLastUpdate(new Date());
          return processedProducts;
        }
        return prev;
      });
      
    } catch (error) {
      console.error("Error fetching MongoDB products:", error);
      if (error.code !== 'ECONNABORTED') {
        setError("فشل في تحميل منتجات MongoDB. تأكد من تشغيل الخادم المحلي على المنفذ 7000");
      }
    } finally {
      setLoading(false);
    }
  }, [checkServerConnection]);

  // دالة محدثة لتحسين تصفية المنتجات حسب الفئة
  const getFilteredMongoProducts = useCallback(() => {
    if (category === 'all' || !category) {
      return mongoProducts;
    }

    return mongoProducts.filter(product => {
      if (!product) return false;

      // البحث في مختلف حقول الفئة المحتملة
      const productCategory = product.category || product.categoryId || product.categoryName;
      
      if (!productCategory) return false;

      // إذا كانت الفئة نصياً
      if (typeof productCategory === 'string') {
        return productCategory.toLowerCase() === category.toLowerCase();
      }

      // إذا كانت الفئة كائناً
      if (typeof productCategory === 'object') {
        return (
          productCategory._id === category ||
          productCategory.name?.toLowerCase() === category.toLowerCase() ||
          productCategory.slug?.toLowerCase() === category.toLowerCase() ||
          productCategory.title?.toLowerCase() === category.toLowerCase()
        );
      }

      return false;
    });
  }, [category, mongoProducts]);

  // دالة لجلب جميع البيانات من MongoDB
  const fetchAllMongoData = useCallback(async () => {
    await fetchMongoCategories();
    await fetchMongoProducts();
  }, [fetchMongoCategories, fetchMongoProducts]);

  // استخدام تأثير للتحديث التلقائي مثل Home.jsx
  useEffect(() => {
    let intervalId;
    
    const fetchMongoData = async () => {
      try {
        setError(null);
        
        const productsResponse = await axios.get("https://oneprodex.up.railway.app/api/products", { timeout: 10000 });
        let productsData = [];
        
        if (Array.isArray(productsResponse.data)) {
          productsData = productsResponse.data;
        } else if (productsResponse.data.products && Array.isArray(productsResponse.data.products)) {
          productsData = productsResponse.data.products;
        } else if (productsResponse.data.data && Array.isArray(productsResponse.data.data)) {
          productsData = productsResponse.data.data;
        }
        
        // تحديث البيانات فقط إذا تغيرت
        if (JSON.stringify(productsData) !== JSON.stringify(mongoProducts)) {
          setMongoProducts(productsData);
          setLastUpdate(new Date());
        }
        
        const categoriesResponse = await axios.get("https://oneprodex.up.railway.app/api/categories", { timeout: 10000 });
        let categoriesData = [];
        
        if (Array.isArray(categoriesResponse.data)) {
          categoriesData = categoriesResponse.data;
        } else if (categoriesResponse.data.categories && Array.isArray(categoriesResponse.data.categories)) {
          categoriesData = categoriesResponse.data.categories;
        } else if (categoriesResponse.data.data && Array.isArray(categoriesResponse.data.data)) {
          categoriesData = categoriesResponse.data.data;
        }
        
        // تحديث البيانات فقط إذا تغيرت
        if (JSON.stringify(categoriesData) !== JSON.stringify(mongoCategories)) {
          setMongoCategories(categoriesData);
        }
        
        setIsOnline(true);
      } catch (error) {
        console.error("Error fetching MongoDB data:", error);
        if (error.code !== 'ECONNABORTED') {
          setError("فشل في جلب البيانات من MongoDB. تأكد من تشغيل الخادم المحلي.");
          setIsOnline(false);
        }
      }
    };

    // جلب البيانات أول مرة
    if (activeTab === "mongodb") {
      fetchMongoData();
    }
    
    // إعداد التحديث التلقائي كل 3 ثواني فقط لـ MongoDB
    if (activeTab === "mongodb") {
      intervalId = setInterval(fetchMongoData, 3000);
    }
    
    // تنظيف عند إلغاء المكون
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTab, mongoProducts, mongoCategories]);

  useEffect(() => {
    // جلب الفئات من DummyJSON
    const fetchDummyJsonCategories = async () => {
      try {
        let { data } = await axios.get("https://dummyjson.com/products/categories");
        setCategories(data);
      } catch (err) {
        console.error("Error fetching dummyjson categories:", err);
      }
    };

    fetchDummyJsonCategories();
  }, []);

  // تحديث الفئة النشطة عند تغيير الـ URL
  useEffect(() => {
    if (category && mongoCategories.length > 0) {
      const isMongoCategory = mongoCategories.some(cat => {
        const catIdentifier = cat.slug || cat.name?.toLowerCase() || cat._id;
        return catIdentifier === category.toLowerCase() || cat._id === category;
      });
      
      if (isMongoCategory && activeTab !== "mongodb") {
        setActiveTab("mongodb");
      }
    }
  }, [category, mongoCategories, activeTab]);

  // الحصول على اسم الفئة الحالية مع تحسينات
  const getCurrentCategoryName = () => {
    if (category === 'all' || !category) return 'All Products';
    
    // البحث في فئات MongoDB أولاً
    const mongoCat = mongoCategories.find(cat => {
      if (!cat) return false;
      return (
        cat._id === category ||
        cat.slug?.toLowerCase() === category.toLowerCase() ||
        cat.name?.toLowerCase() === category.toLowerCase() ||
        cat.title?.toLowerCase() === category.toLowerCase()
      );
    });
    
    if (mongoCat) {
      return mongoCat.name || mongoCat.title || category;
    }
    
    // البحث في فئات DummyJSON
    const dummyCat = categories.find(c => {
      const catSlug = c.slug || c;
      return catSlug.toLowerCase() === category.toLowerCase();
    });
    
    if (dummyCat) return dummyCat.name || dummyCat;
    
    return category;
  };

  // الحصول على عدد المنتجات في الفئة الحالية
  const getProductCount = () => {
    if (activeTab === "mongodb") {
      return getFilteredMongoProducts().length;
    }
    return 0;
  };

  // دالة لتحديث جميع البيانات يدوياً
  const refreshAllData = () => {
    if (activeTab === "mongodb") {
      fetchAllMongoData();
      alert("جاري تحديث البيانات...");
    }
  };

  const filteredMongoProducts = getFilteredMongoProducts();

  // إضافة أنيميشن CSS
  const addStyles = () => {
    if (!document.getElementById('shop-styles')) {
      const style = document.createElement('style');
      style.id = 'shop-styles';
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        .product-card {
          transition: all 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .product-details-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .product-details-content {
          background-color: white;
          border-radius: 12px;
          max-width: 900px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 30px;
          position: relative;
        }
        .close-button {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }
        .product-images {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .main-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 8px;
        }
        .thumbnail-images {
          display: flex;
          gap: 10px;
          overflow-x: auto;
        }
        .thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.3s;
        }
        .thumbnail.active {
          opacity: 1;
          border: 2px solid #667eea;
        }
        .product-info {
          padding: 20px 0;
        }
        .product-title {
          font-size: 24px;
          margin-bottom: 10px;
          color: #333;
        }
        .product-price {
          font-size: 22px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 15px;
        }
        .product-description {
          color: #666;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        .product-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        .product-rating {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .product-stock {
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 14px;
        }
        .in-stock {
          background-color: #d4edda;
          color: #155724;
        }
        .out-of-stock {
          background-color: #f8d7da;
          color: #721c24;
        }
        .add-to-cart-button {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s;
          width: 100%;
        }
        .add-to-cart-button:hover {
          background-color: #218838;
        }
        .add-to-cart-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
      `;
      document.head.appendChild(style);
    }
  };

  useEffect(() => {
    addStyles();
  }, []);

  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh",
      backgroundColor: "#f5f7fa",
      position: "relative"
    }}>
      <aside
        style={{
          width: "280px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "30px 20px",
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{
          position: "absolute",
          top: "-50%",
          right: "-50%",
          width: "200%",
          height: "200%",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
          transform: "rotate(45deg)"
        }} />
        
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          position: "relative",
          zIndex: 1
        }}>
          <h2 style={{
            fontSize: "24px",
            margin: 0,
            paddingBottom: "15px",
            borderBottom: "2px solid rgba(255,255,255,0.2)",
          }}>
            Categories
          </h2>
          <button
            onClick={refreshAllData}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px"
            }}
            title="Refresh all data"
          >
            🔄
          </button>
        </div>
        
        <ul style={{ 
          listStyle: "none", 
          padding: 0,
          position: "relative",
          zIndex: 1
        }}>
          <li style={{ marginBottom: "8px" }}>
            <Link
              to={`/shop/all`}
              style={{
                color: "white",
                textDecoration: "none",
                display: "block",
                padding: "12px 15px",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                background: category === 'all' ? "rgba(255,255,255,0.2)" : "transparent",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255,255,255,0.15)";
                e.target.style.transform = "translateX(5px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = category === 'all' ? "rgba(255,255,255,0.2)" : "transparent";
                e.target.style.transform = "translateX(0)";
              }}
            >
              All Products
              <span style={{ 
                float: "right",
                fontSize: "12px",
                opacity: 0.7
              }}>
                {mongoProducts.length}
              </span>
            </Link>
          </li>

          
          <li style={{ 
            margin: "15px 0 10px 0", 
            padding: "10px 0",
            borderTop: "1px solid rgba(255,255,255,0.2)"
          }}>
            <span style={{ 
              fontSize: "12px", 
              opacity: 0.7,
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>
              DummyJSON Categories
            </span>
          </li>

          {categories.map((cat) => (
            <li key={cat.slug || cat} style={{ marginBottom: "8px" }}>
              <Link
                to={`/shop/${cat.slug || cat}`}
                style={{
                  color: "white",
                  textDecoration: "none",
                  display: "block",
                  padding: "12px 15px",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  background: (category === (cat.slug || cat)) ? "rgba(255,255,255,0.2)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.15)";
                  e.target.style.transform = "translateX(5px)";
                  setHoveredCategory(cat.slug || cat);
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = (category === (cat.slug || cat)) ? "rgba(255,255,255,0.2)" : "transparent";
                  e.target.style.transform = "translateX(0)";
                  setHoveredCategory(null);
                }}
                onClick={() => setActiveTab("dummyjson")}
              >
                {cat.name || cat}
                {hoveredCategory === (cat.slug || cat) && (
                  <span style={{ float: "right" }}>→</span>
                )}
              </Link>
            </li>
          ))}

           
          <li style={{ 
            margin: "20px 0 10px 0", 
            padding: "10px 0",
            borderTop: "1px solid rgba(255,255,255,0.2)"
          }}>
            <span style={{ 
              fontSize: "12px", 
              opacity: 0.7,
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>
              MongoDB Categories ({mongoCategories.length})
              <span style={{ 
                marginLeft: "5px",
                fontSize: "10px",
                background: isOnline ? "rgba(255,255,255,0.3)" : "rgba(255,0,0,0.3)",
                padding: "2px 5px",
                borderRadius: "3px"
              }}>
                {isOnline ? "Live" : "Offline"}
              </span>
            </span>
          </li>

          {mongoCategories.map((cat) => {
            if (!cat) return null;
            
            // حساب عدد المنتجات في هذه الفئة
            const productCount = mongoProducts.filter(product => {
              if (!product) return false;
              const productCategory = product.category || product.categoryId || product.categoryName;
              
              if (typeof productCategory === 'string') {
                return productCategory.toLowerCase() === (cat.name?.toLowerCase() || cat.slug?.toLowerCase() || cat._id);
              }
              
              if (typeof productCategory === 'object') {
                return (
                  productCategory._id === cat._id ||
                  productCategory.name?.toLowerCase() === cat.name?.toLowerCase() ||
                  productCategory.slug?.toLowerCase() === cat.slug?.toLowerCase()
                );
              }
              
              return false;
            }).length;

            const categorySlug = cat.slug || cat.name?.toLowerCase() || cat._id;
            
            return (
              <li key={cat._id} style={{ marginBottom: "8px" }}>
                <Link
                  to={`/shop/${categorySlug}`}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    display: "block",
                    padding: "12px 15px",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    background: category === categorySlug ? "rgba(255,255,255,0.2)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.15)";
                    e.target.style.transform = "translateX(5px)";
                    setHoveredCategory(categorySlug);
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = category === categorySlug ? "rgba(255,255,255,0.2)" : "transparent";
                    e.target.style.transform = "translateX(0)";
                    setHoveredCategory(null);
                  }}
                  onClick={() => setActiveTab("mongodb")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{cat.name || cat.title || "Unnamed Category"}</span>
                    <span style={{ 
                      fontSize: "11px",
                      background: productCount > 0 ? "rgba(255,255,255,0.3)" : "rgba(255,0,0,0.3)",
                      padding: "2px 6px",
                      borderRadius: "10px",
                      minWidth: "20px",
                      textAlign: "center"
                    }}>
                      {productCount}
                    </span>
                  </div>
                  {hoveredCategory === categorySlug && (
                    <span style={{ float: "right" }}>→</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      <main style={{ 
        flex: 1, 
        padding: "30px",
        background: "#f5f7fa"
      }}>
        {!category && <Navigate to="/shop/all" replace />}
        
         <div style={{ 
          marginBottom: "20px", 
          display: "flex", 
          borderBottom: "1px solid #ddd",
          background: "white",
          borderRadius: "8px",
          overflow: "hidden"
        }}>
          <button
            onClick={() => setActiveTab("dummyjson")}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              background: activeTab === "dummyjson" ? "#667eea" : "transparent",
              color: activeTab === "dummyjson" ? "white" : "#333",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            DummyJSON Products
          </button>
          <button
            onClick={() => {
              setActiveTab("mongodb");
              refreshAllData();
            }}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              background: activeTab === "mongodb" ? "#667eea" : "transparent",
              color: activeTab === "mongodb" ? "white" : "#333",
              cursor: "pointer",
              transition: "all 0.3s ease",
              position: "relative"
            }}
          >
            MongoDB Products
            <span style={{ 
              fontSize: "12px", 
              marginLeft: "5px",
              background: isOnline ? "#28a745" : "#dc3545",
              color: "white",
              padding: "2px 6px",
              borderRadius: "10px"
            }}>
              {isOnline ? "Live" : "Offline"}
            </span>
            {isOnline && (
              <span style={{
                position: "absolute",
                top: "2px",
                right: "2px",
                width: "8px",
                height: "8px",
                background: "#28a745",
                borderRadius: "50%",
                animation: "pulse 2s infinite"
              }}></span>
            )}
          </button>
        </div>
        
        {activeTab === "dummyjson" ? (
          <Outlet context={{ addToCart: handleAddToCart, goToProductDetails }} />
        ) : (
          <div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "10px"
            }}>
              <h2 style={{ 
                margin: 0,
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                {getCurrentCategoryName()}
                <span style={{ 
                  fontSize: "14px", 
                  color: "#666",
                  background: "#e9ecef",
                  padding: "2px 8px",
                  borderRadius: "12px"
                }}>
                  {getProductCount()} products
                </span>
              </h2>
              
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ 
                  fontSize: "12px", 
                  color: "#666",
                  background: "#f8f9fa",
                  padding: "4px 8px",
                  borderRadius: "4px"
                }}>
                  آخر تحديث: {lastUpdate.toLocaleTimeString()}
                </span>
                <button 
                  onClick={refreshAllData}
                  style={{
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "8px 15px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}
                >
                  🔄 تحديث
                </button>
              </div>
            </div>
            
            {!isOnline && (
              <div style={{
                background: "#fff3cd",
                color: "#856404",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #ffeaa7"
              }}>
                <strong>تنبيه:</strong> الخادم غير متصل. تأكد من تشغيل الخادم المحلي على المنفذ 7000
              </div>
            )}
            
            {error && (
              <div style={{
                background: "#f8d7da",
                color: "#721c24",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #f5c6cb"
              }}>
                <strong>خطأ:</strong> {error}
                <div style={{ marginTop: "10px" }}>
                  <button 
                    onClick={refreshAllData}
                    style={{
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "8px 15px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    إعادة المحاولة
                  </button>
                </div>
              </div>
            )}
            
            {loading ? (
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: "200px",
                flexDirection: "column",
                gap: "10px"
              }}>
                <div>جاري تحميل منتجات MongoDB...</div>
                <div style={{ 
                  width: "40px", 
                  height: "40px", 
                  border: "4px solid #f3f3f3",
                  borderTop: "4px solid #667eea",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }}></div>
              </div>
            ) : (
              <>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "25px"
                }}>
                  {filteredMongoProducts.map(product => {
                    if (!product) return null;
                    
                    return (
                      <div 
                        key={product._id || product.id} 
                        className="product-card"
                        style={{
                          background: "white",
                          borderRadius: "12px",
                          overflow: "hidden",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          position: "relative"
                        }}
                      >
                        {(product.discountPercentage > 0) && (
                          <div style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "#ff4757",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            zIndex: 2
                          }}>
                            -{product.discountPercentage}%
                          </div>
                        )}
                        
                        <div 
                          onClick={() => openMongoProductDetails(product)}
                          style={{
                            height: "220px",
                            background: `url(${product.image || product.images?.[0] || '/placeholder-image.jpg'}) center/cover no-repeat`,
                            backgroundColor: "#f8f9fa",
                            transition: "transform 0.3s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)";
                          }}
                        />
                        
                        <div style={{ padding: "20px" }}>
                          <h3 
                            onClick={() => openMongoProductDetails(product)}
                            style={{ 
                              margin: "0 0 10px 0", 
                              fontSize: "18px",
                              color: "#333",
                              cursor: "pointer",
                              transition: "color 0.3s ease"
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.color = "#667eea";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = "#333";
                            }}
                          >
                            {product.title || product.name}
                          </h3>
                          
                          <p style={{ 
                            margin: "0 0 15px 0", 
                            color: "#666",
                            fontSize: "14px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            height: "40px"
                          }}>
                            {product.description || "No description available"}
                          </p>
                          
                          <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "15px"
                          }}>
                            <div>
                              <span style={{ 
                                fontSize: "20px", 
                                fontWeight: "bold",
                                color: "#667eea"
                              }}>
                                ${product.price || "N/A"}
                              </span>
                              {(product.discountPercentage > 0) && (
                                <span style={{
                                  fontSize: "14px",
                                  color: "#999",
                                  textDecoration: "line-through",
                                  marginLeft: "8px"
                                }}>
                                  ${Math.round((product.price / (1 - product.discountPercentage/100)) * 100) / 100}
                                </span>
                              )}
                            </div>
                            
                            <span style={{
                              fontSize: "12px",
                              background: (product.stock > 0 || product.inStock) ? "#d4edda" : "#f8d7da",
                              color: (product.stock > 0 || product.inStock) ? "#155724" : "#721c24",
                              padding: "4px 8px",
                              borderRadius: "10px"
                            }}>
                              {(product.stock > 0 || product.inStock) 
                                ? `In Stock (${product.stock || "Available"})` 
                                : "Out of Stock"}
                            </span>
                          </div>
                          
                          <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}>
                            {(product.rating || product.rating === 0) && (
                              <div style={{ 
                                display: "flex", 
                                alignItems: "center"
                              }}>
                                <span style={{ 
                                  color: "#ffc107",
                                  marginRight: "5px"
                                }}>
                                  ★
                                </span>
                                <span style={{ fontSize: "14px" }}>
                                  {product.rating}
                                </span>
                              </div>
                            )}
                            
                            <button
                              onClick={(e) => handleAddToCart(product, e)}
                              disabled={!(product.stock > 0 || product.inStock)}
                              style={{
                                background: (product.stock > 0 || product.inStock) ? "#28a745" : "#ccc",
                                color: "white",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "6px",
                                cursor: (product.stock > 0 || product.inStock) ? "pointer" : "not-allowed",
                                fontSize: "14px",
                                fontWeight: "bold",
                                transition: "all 0.3s ease"
                              }}
                              onMouseEnter={(e) => {
                                if (product.stock > 0 || product.inStock) {
                                  e.target.style.background = "#218838";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (product.stock > 0 || product.inStock) {
                                  e.target.style.background = "#28a745";
                                }
                              }}
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {filteredMongoProducts.length === 0 && !loading && (
                  <div style={{ 
                    textAlign: "center", 
                    padding: "60px 40px",
                    color: "#666",
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                  }}>
                    <h3 style={{ marginBottom: "10px" }}>No products found</h3>
                    <p style={{ marginBottom: "20px" }}>
                      {category && category !== 'all' 
                        ? `There are no products in the "${getCurrentCategoryName()}" category.` 
                        : "There are no products available."}
                    </p>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                      <button 
                        onClick={refreshAllData}
                        style={{
                          background: "#667eea",
                          color: "white",
                          border: "none",
                          padding: "10px 20px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "bold"
                        }}
                      >
                        Refresh Products
                      </button>
                      <Link 
                        to="/shop/all"
                        style={{
                          background: "#28a745",
                          color: "white",
                          border: "none",
                          padding: "10px 20px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "bold",
                          textDecoration: "none",
                          display: "inline-block"
                        }}
                      >
                        View All Products
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        
         {showProductDetails && selectedMongoProduct && (
          <div 
            className="product-details-modal"
            onClick={closeProductDetails}
          >
            <div 
              className="product-details-content"
              onClick={handleDetailsClick}
            >
              <button 
                className="close-button"
                onClick={closeProductDetails}
              >
                ×
              </button>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                <div className="product-images">
                  <img 
                    src={selectedMongoProduct.images?.[selectedImageIndex] || selectedMongoProduct.image || '/placeholder-image.jpg'} 
                    alt={selectedMongoProduct.title || selectedMongoProduct.name}
                    className="main-image"
                  />
                  
                  {selectedMongoProduct.images && selectedMongoProduct.images.length > 1 && (
                    <div className="thumbnail-images">
                      {selectedMongoProduct.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedMongoProduct.title || selectedMongoProduct.name} ${index + 1}`}
                          className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                          onClick={() => changeImage(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="product-info">
                  <h2 className="product-title">
                    {selectedMongoProduct.title || selectedMongoProduct.name}
                  </h2>
                  
                  <div className="product-price">
                    ${selectedMongoProduct.price || "N/A"}
                    {selectedMongoProduct.discountPercentage > 0 && (
                      <span style={{
                        fontSize: "16px",
                        color: "#999",
                        textDecoration: "line-through",
                        marginLeft: "10px"
                      }}>
                        ${Math.round((selectedMongoProduct.price / (1 - selectedMongoProduct.discountPercentage/100)) * 100) / 100}
                      </span>
                    )}
                  </div>
                  
                  <div className="product-meta">
                    <div className="product-rating">
                      <span style={{ color: "#ffc107" }}>★</span>
                      <span>{selectedMongoProduct.rating || "N/A"}</span>
                    </div>
                    
                    <div className={`product-stock ${selectedMongoProduct.stock > 0 || selectedMongoProduct.inStock ? 'in-stock' : 'out-of-stock'}`}>
                      {(selectedMongoProduct.stock > 0 || selectedMongoProduct.inStock) 
                        ? `In Stock (${selectedMongoProduct.stock || "Available"})` 
                        : "Out of Stock"}
                    </div>
                  </div>
                  
                  <p className="product-description">
                    {selectedMongoProduct.description || "No description available"}
                  </p>
                  
                  <button
                    className="add-to-cart-button"
                    onClick={(e) => handleAddToCart(selectedMongoProduct, e)}
                    disabled={!(selectedMongoProduct.stock > 0 || selectedMongoProduct.inStock)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 











































  












































