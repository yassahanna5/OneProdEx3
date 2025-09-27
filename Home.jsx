 import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "./RTK/Slices/cartSlice";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [currentProductPage, setCurrentProductPage] = useState(0);
  const [imageError, setImageError] = useState({});
  const [stockMessage, setStockMessage] = useState({ show: false, message: "" });
  
  const [mongoProducts, setMongoProducts] = useState([]);
  const [mongoCategories, setMongoCategories] = useState([]);
  const [loadingMongoData, setLoadingMongoData] = useState(true);
  const [mongoError, setMongoError] = useState(null);
  
  // States جديدة لعرض تفاصيل المنتج
  const [selectedMongoProduct, setSelectedMongoProduct] = useState(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cartItems = useSelector((state) => state.cart?.items || []);

  const PRODUCTS_PER_PAGE = 5;

  const productPagesCount = Math.ceil(topRatedProducts.length / PRODUCTS_PER_PAGE);

  const categoryProductsCache = useRef({});

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

  // Fetch data from dummyjson
  useEffect(() => {
    const fetchDummyData = async () => {
      try {
        const productsResponse = await axios.get(
          "https://dummyjson.com/products?limit=200"
        );
        const allProducts = productsResponse.data.products;
        setProducts(allProducts);

        const sortedByRating = [...allProducts]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 20);
        setTopRatedProducts(sortedByRating);

        const categoriesResponse = await axios.get(
          "https://dummyjson.com/products/categories"
        );
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching dummy data:", error);
      }
    };

    fetchDummyData();
  }, []);

  // Fetch MongoDB data مع التحديث التلقائي
  useEffect(() => {
    let intervalId;
    
    const fetchMongoData = async () => {
      try {
        setMongoError(null);
        
        const productsResponse = await axios.get("https://oneprodex3.up.railway.app/api/products");
        let productsData = [];
        
        if (Array.isArray(productsResponse.data)) {
          productsData = productsResponse.data;
        } else if (productsResponse.data.products && Array.isArray(productsResponse.data.products)) {
          productsData = productsResponse.data.products;
        } else if (productsResponse.data.data && Array.isArray(productsResponse.data.data)) {
          productsData = productsResponse.data.data;
        } else {
          console.warn("هيكل بيانات المنتجات غير متوقع:", productsResponse.data);
          productsData = [];
        }
        
        // تحديث البيانات فقط إذا تغيرت
        if (JSON.stringify(productsData) !== JSON.stringify(mongoProducts)) {
          setMongoProducts(productsData);
        }
        
        const categoriesResponse = await axios.get("https://oneprodex3.up.railway.app/api/categories");
        let categoriesData = [];
        
        if (Array.isArray(categoriesResponse.data)) {
          categoriesData = categoriesResponse.data;
        } else if (categoriesResponse.data.categories && Array.isArray(categoriesResponse.data.categories)) {
          categoriesData = categoriesResponse.data.categories;
        } else if (categoriesResponse.data.data && Array.isArray(categoriesResponse.data.data)) {
          categoriesData = categoriesResponse.data.data;
        } else {
          console.warn("هيكل بيانات الفئات غير متوقع:", categoriesResponse.data);
          categoriesData = [];
        }
        
        // تحديث البيانات فقط إذا تغيرت
        if (JSON.stringify(categoriesData) !== JSON.stringify(mongoCategories)) {
          setMongoCategories(categoriesData);
        }
        
      } catch (error) {
        console.error("Error fetching MongoDB data:", error);
        setMongoError("فشل في جلب البيانات من MongoDB. تأكد من تشغيل الخادم المحلي.");
      } finally {
        setLoadingMongoData(false);
      }
    };

    // جلب البيانات أول مرة
    fetchMongoData();
    
    // إعداد التحديث التلقائي كل 5 ثواني
    intervalId = setInterval(fetchMongoData, 5000);
    
    // تنظيف عند إلغاء المكون
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [mongoProducts, mongoCategories]);

  // Slider auto move
  useEffect(() => {
    if (products.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) =>
          prev === products.length - 1 ? 0 : prev + 1
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [products]);

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update suggestions on search query change
  useEffect(() => {
    if (searchQuery.length > 1) {
      const filteredCategories = categories
        .filter(
          (category) =>
            category.name &&
            category.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
        .map((category) => ({ ...category, type: "category" }));

      const filteredProducts = products
        .filter((product) => {
          const title = product.title || "";
          const description = product.description || "";
          const brand = product.brand || "";
          const query = searchQuery.toLowerCase();

          return (
            title.toLowerCase().includes(query) ||
            description.toLowerCase().includes(query) ||
            brand.toLowerCase().includes(query)
          );
        })
        .map((product) => ({ ...product, type: "product" }));

      const allSuggestions = [
        ...filteredCategories,
        ...filteredProducts,
      ];
      setSuggestions(allSuggestions.slice(0, 10));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, categories, products]);

  const getCategoryProducts = useCallback((categorySlug) => {
    if (categoryProductsCache.current[categorySlug]) {
      return categoryProductsCache.current[categorySlug];
    }

    const filteredProducts = products.filter(
      (p) => p.category === categorySlug
    );
    categoryProductsCache.current[categorySlug] = filteredProducts;
    return filteredProducts;
  }, [products]);

  // دالة للحصول على منتجات فئة معينة من MongoDB
  const getMongoCategoryProducts = (categoryId) => {
    return mongoProducts.filter(product => {
      const productCategory = product.category;
      if (!productCategory) return false;
      
      if (typeof productCategory === 'string') {
        return productCategory === categoryId;
      } else if (productCategory._id) {
        return productCategory._id === categoryId;
      } else if (productCategory.id) {
        return productCategory.id === categoryId;
      }
      return false;
    });
  };

  const getCurrentProducts = () => {
    const startIndex = currentProductPage * PRODUCTS_PER_PAGE;
    return topRatedProducts.slice(
      startIndex,
      startIndex + PRODUCTS_PER_PAGE
    );
  };

  const getProductQuantityInCart = (productId) => {
    if (!Array.isArray(cartItems)) {
      return 0;
    }
    
    const cartItem = cartItems.find(item => item.id === productId || item._id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    
    const productId = product.id || product._id;
    const currentQuantityInCart = getProductQuantityInCart(productId);
    const productStock = product.stock || 0;
    
    if (currentQuantityInCart >= productStock) {
      setStockMessage({
        show: true,
        message: `Cannot add more. Only ${productStock} items available in stock.`,
        productId: productId,
        isError: true
      });
      
      setTimeout(() => {
        setStockMessage({ show: false, message: "" });
      }, 3000);
      
      return;
    }
    
    dispatch(addToCart(product));
    
    setStockMessage({
      show: true,
      message: "Product added to cart successfully!",
      productId: productId,
      isSuccess: true
    });
    
    setTimeout(() => {
      setStockMessage({ show: false, message: "" });
    }, 3000);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && suggestions.length > 0) {
      const firstSuggestion = suggestions[0];
      if (firstSuggestion.type === "category") {
        navigate(`/shop/${firstSuggestion.slug}`);
      } else {
        navigate(`/product/${firstSuggestion.id}`);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === "category") {
      navigate(`/shop/${suggestion.slug}`);
    } else {
      navigate(`/product/${suggestion.id}`);
    }
    setShowSuggestions(false);
    setSearchQuery(
      suggestion.type === "category"
        ? suggestion.name
        : suggestion.title
    );
  };

  const navigateToProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleImageError = (imageId) => {
    setImageError((prev) => ({ ...prev, [imageId]: true }));
  };

  // دالة محسنة للحصول على صورة المنتج
  const getImageUrl = (product, imageIndex = 0) => {
    const productId = product.id || product._id;
    if (imageError[`${productId}-${imageIndex}`]) {
      return "https://via.placeholder.com/200x150?text=Image+Not+Found";
    }
    
    // معالجة الصور من MongoDB
    if (product.images && Array.isArray(product.images)) {
      if (product.images[imageIndex]) {
        if (typeof product.images[imageIndex] === 'string') {
          return product.images[imageIndex];
        } else if (product.images[imageIndex].url) {
          return product.images[imageIndex].url;
        }
      }
    }
    
    // معالجة الصور من dummyjson
    if (product.images && product.images[imageIndex]) {
      return product.images[imageIndex];
    }
    
    return product.image || product.thumbnail || "https://via.placeholder.com/200x150";
  };

  // دالة للحصول على جميع صور المنتج
  const getAllProductImages = (product) => {
    const images = [];
    
    // إضافة الصورة الرئيسية أولاً
    if (product.thumbnail) {
      images.push(product.thumbnail);
    } else if (product.image) {
      images.push(product.image);
    }
    
    // إضافة الصور الأخرى
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
        if (typeof img === 'string' && !images.includes(img)) {
          images.push(img);
        } else if (img.url && !images.includes(img.url)) {
          images.push(img.url);
        }
      });
    }
    
    // إذا لم يكن هناك صور، نضيف صورة افتراضية
    if (images.length === 0) {
      images.push("https://via.placeholder.com/200x150");
    }
    
    return images;
  };

  const getProductTitle = (product) => {
    return product.title || product.name || "No Title";
  };

  const getCategoryName = (category) => {
    return category.name || "Unnamed Category";
  };

  const getCategoryId = (category) => {
    return category._id || category.id || Math.random().toString();
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Stock Message */}
      {stockMessage.show && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "15px 25px",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            zIndex: 1000,
            backgroundColor: stockMessage.isSuccess ? "#28a745" : "#dc3545",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          {stockMessage.message}
        </div>
      )}

      {/* نافذة تفاصيل المنتج */}
      {showProductDetails && selectedMongoProduct && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
          onClick={closeProductDetails}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "1000px",
              maxHeight: "90vh",
              overflow: "auto",
              padding: "20px",
              position: "relative",
            }}
            onClick={handleDetailsClick}
          >
            <button
              onClick={closeProductDetails}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#666",
                zIndex: 10,
              }}
            >
              &times;
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h2 style={{ margin: 0, color: "#333", textAlign: "center" }}>
                {getProductTitle(selectedMongoProduct)}
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
                <div>
                  <img
                    src={getImageUrl(selectedMongoProduct, selectedImageIndex)}
                    alt={getProductTitle(selectedMongoProduct)}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "15px",
                    }}
                    onError={() => handleImageError(`${selectedMongoProduct._id || selectedMongoProduct.id}-${selectedImageIndex}`)}
                  />
                  
                  {/* عرض الصور المصغرة */}
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {getAllProductImages(selectedMongoProduct).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${getProductTitle(selectedMongoProduct)} ${index + 1}`}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          cursor: "pointer",
                          border: selectedImageIndex === index ? "2px solid #007bff" : "1px solid #ddd",
                          opacity: selectedImageIndex === index ? 1 : 0.7,
                        }}
                        onClick={() => changeImage(index)}
                        onError={() => handleImageError(`${selectedMongoProduct._id || selectedMongoProduct.id}-${index}`)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "20px" }}>
                    {selectedMongoProduct.description || "No description available."}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                    <div>
                      <strong style={{ color: "#333" }}>Price:</strong>
                      <div style={{ color: "#007bff", fontSize: "24px", fontWeight: "bold" }}>
                        ${selectedMongoProduct.price}
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: "#333" }}>Category:</strong>
                      <div style={{ color: "#666" }}>
                        {selectedMongoProduct.category?.name || 
                         selectedMongoProduct.category || 
                         "Uncategorized"}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                    <div>
                      <strong style={{ color: "#333" }}>Stock:</strong>
                      <div style={{ color: "#666" }}>{selectedMongoProduct.stock || 0}</div>
                    </div>
                    <div>
                      <strong style={{ color: "#333" }}>Brand:</strong>
                      <div style={{ color: "#666" }}>{selectedMongoProduct.brand || "No brand"}</div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                    <div>
                      <strong style={{ color: "#333" }}>Discount:</strong>
                      <div style={{ color: "#666" }}>
                        {selectedMongoProduct.discountPercentage || selectedMongoProduct.discount || 0}%
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: "#333" }}>Rating:</strong>
                      <div style={{ color: "#666", display: "flex", alignItems: "center" }}>
                        <span style={{ marginRight: "5px" }}>{selectedMongoProduct.rating || "N/A"}</span>
                        <span style={{ color: "#ffc107" }}>★</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      style={{
                        padding: "12px 20px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        flex: 1,
                        fontWeight: "bold",
                      }}
                      onClick={(e) => {
                        handleAddToCart(selectedMongoProduct, e);
                        closeProductDetails();
                      }}
                    >
                      Add to Cart
                    </button>
                    <button
                      style={{
                        padding: "12px 20px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        flex: 1,
                      }}
                    >
                      Add to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "30px 0",
        }}
      >
        <div
          ref={searchRef}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <form
            onSubmit={handleSearchSubmit}
            style={{ position: "relative" }}
          >
            <input
              type="text"
              placeholder="ابحث عن فئة أو منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() =>
                searchQuery.length > 1 && setShowSuggestions(true)
              }
              style={{
                width: "100%",
                padding: "15px 20px",
                borderRadius: "30px",
                border: "1px solid #dfe1e5",
                fontSize: "16px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                outline: "none",
                transition: "box-shadow 0.3s ease",
              }}
            />
            <button
              type="submit"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4285f4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line
                  x1="21"
                  y1="21"
                  x2="16.65"
                  y2="16.65"
                ></line>
              </svg>
            </button>
          </form>
          {showSuggestions && suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "white",
                border: "1px solid #dfe1e5",
                borderRadius: "0 0 10px 10px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                zIndex: 1000,
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {suggestions.map((item) => (
                <div
                  key={
                    item.type === "category"
                      ? item.slug
                      : item.id
                  }
                  onClick={() => handleSuggestionClick(item)}
                  style={{
                    padding: "12px 20px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "1px solid #f1f1f1",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#f8f9fa";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white";
                  }}
                >
                  {item.type === "category" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#5f6368"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginRight: "10px" }}
                    >
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#5f6368"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginRight: "10px" }}
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line
                        x1="3"
                        y1="9"
                        x2="21"
                        y2="9"
                      ></line>
                    </svg>
                  )}
                  <div>
                    <div style={{ fontWeight: "bold" }}>
                      {item.type === "category"
                        ? item.name
                        : item.title}
                    </div>
                    {item.type === "product" && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#5f6368",
                        }}
                      >
                        {item.brand || "No Brand"} - ${item.price}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#5f6368",
                      }}
                    >
                      {item.type === "category"
                        ? "فئة"
                        : "منتج"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Slider */}
      <h1>Slider Products</h1>
      <div
        style={{
          display: "flex",
          gap: "10px",
          scrollBehavior: "smooth",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            transform: `translateX(-${currentIndex * 210}px)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                minWidth: "200px",
                marginRight: "10px",
                cursor: "pointer",
              }}
              onClick={() => navigateToProductDetails(p.id)}
            >
              <img
                src={getImageUrl(p)}
                alt={p.title}
                onError={() => handleImageError(p.id)}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
              <p>{p.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Best Rated Products */}
      <div style={{ marginTop: "40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Best Rated Products</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() =>
                setCurrentProductPage((prev) =>
                  Math.max(prev - 1, 0)
                )
              }
              disabled={currentProductPage === 0}
              style={{
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor:
                  currentProductPage === 0
                    ? "#f5f5f5"
                    : "white",
                color:
                  currentProductPage === 0 ? "#999" : "#333",
                cursor:
                  currentProductPage === 0
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              السابق
            </button>
            <button
              onClick={() =>
                setCurrentProductPage((prev) =>
                  Math.min(
                    prev + 1,
                    productPagesCount - 1
                  )
                )
              }
              disabled={
                currentProductPage === productPagesCount - 1
              }
              style={{
                padding: "8px 12px",
               border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor:
                  currentProductPage === productPagesCount - 1
                    ? "#f5f5f5"
                    : "white",
                color:
                  currentProductPage ===
                  productPagesCount - 1
                    ? "#999"
                    : "#333",
                cursor:
                  currentProductPage ===
                  productPagesCount - 1
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              التالي
            </button>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {getCurrentProducts().map((p) => {
            const quantityInCart = getProductQuantityInCart(p.id);
            const canAddToCart = quantityInCart < p.stock;
            
            return (
              <div
                key={p.id}
                style={{
                 border: "1px solid #eee",
                  borderRadius: "8px",
                  padding: "15px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: "150px",
                    marginBottom: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigateToProductDetails(p.id)}
                >
                  <img
                    src={getImageUrl(p)}
                    alt={p.title}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                    onError={() => handleImageError(p.id)}
                  />
                </div>
                <h4 style={{ margin: "10px 0", fontSize: "16px" }}>
                  {p.title}
                </h4>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#007bff",
                    margin: "10px 0",
                  }}
                >
                  ${p.price}
                </p>
                <div style={{ margin: "10px 0", fontSize: "14px", color: "#666" }}>
                  In cart: {quantityInCart} | Available: {p.stock}
                </div>
                <button
                  style={{
                    padding: "8px 15px",
                    backgroundColor: canAddToCart ? "#007bff" : "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: canAddToCart ? "pointer" : "not-allowed",
                    opacity: canAddToCart ? 1 : 0.7,
                  }}
                  onClick={(e) => handleAddToCart(p, e)}
                  disabled={!canAddToCart}
                >
                  {canAddToCart ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Categories and Products */}
      <div style={{ marginTop: "40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>جميع الفئات والمنتجات</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {categories.map((category) => (
            <div key={category.slug} style={{ marginBottom: "30px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onClick={() => navigate(`/shop/${category.slug}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e9ecef";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                }}
              >
                <h3 style={{ margin: 0, color: "#007bff" }}>
                  {category.name}
                </h3>
                <span style={{ marginLeft: "10px", color: "#666" }}>
                  ({getCategoryProducts(category.slug).length} منتج)
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "20px",
                }}
              >
                {getCategoryProducts(category.slug).map((product) => {
                  const quantityInCart = getProductQuantityInCart(product.id);
                  const canAddToCart = quantityInCart < product.stock;
                  
                  return (
                    <div
                      key={product.id}
                      style={{
                        border: "1px solid #eee",
                        borderRadius: "8px",
                        padding: "15px",
                        textAlign: "center",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        cursor: "pointer",
                      }}
                      onClick={() => navigateToProductDetails(product.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{ position: "relative", height: "200px", marginBottom: "15px" }}>
                        <img
                          src={getImageUrl(product)}
                          alt={product.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                          onError={() => handleImageError(product.id)}
                        />
                        {product.discountPercentage > 0 && (
                          <div
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "10px",
                              backgroundColor: "#ff4757",
                              color: "white",
                              padding: "5px 10px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            -{Math.round(product.discountPercentage)}%
                          </div>
                        )}
                        {!canAddToCart && (
                          <div
                            style={{
                              position: "absolute",
                              top: "10px",
                              left: "10px",
                              backgroundColor: "#6c757d",
                              color: "white",
                              padding: "5px 10px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            {quantityInCart >= product.stock ? "Max quantity reached" : "Out of Stock"}
                          </div>
                        )}
                      </div>
                      <h4 style={{ margin: "10px 0", fontSize: "16px", minHeight: "48px" }}>
                        {product.title}
                      </h4>
                      <p style={{ color: "#666", fontSize: "14px", margin: "5px 0" }}>
                        {product.brand}
                      </p>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "10px 0" }}>
                        <span style={{ fontWeight: "bold", color: "#007bff", fontSize: "18px" }}>
                          ${product.price}
                        </span>
                        {product.discountPercentage > 0 && (
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#999",
                              marginLeft: "10px",
                              fontSize: "14px",
                            }}
                          >
                            ${Math.round(product.price / (1 - product.discountPercentage / 100))}
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "10px 0" }}>
                        <div style={{ display: "flex", alignItems: "center", marginRight: "10px" }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="#ffc107"
                            stroke="#ffc107"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                          <span style={{ marginLeft: "5px", fontSize: "14px" }}>
                            {product.rating}
                          </span>
                        </div>
                        <span style={{ fontSize: "14px", color: product.stock > 10 ? "#666" : product.stock > 0 ? "#ffc107" : "#dc3545" }}>
                          ({product.stock} {product.stock > 0 ? "متوفر" : "غير متوفر"})
                        </span>
                      </div>
                      <div style={{ margin: "10px 0", fontSize: "14px", color: "#666" }}>
                        In cart: {quantityInCart}
                      </div>
                      <button
                        style={{
                          padding: "10px 15px",
                          backgroundColor: canAddToCart ? "#007bff" : "#6c757d",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: canAddToCart ? "pointer" : "not-allowed",
                          opacity: canAddToCart ? 1 : 0.7,
                          width: "100%",
                        }}
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={!canAddToCart}
                      >
                        {canAddToCart ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MongoDB Categories and Products */}
      <div style={{ marginTop: "40px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ color: "#333", margin: 0 }}>فئات ومنتجات MongoDB</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ 
              width: "10px", 
              height: "10px", 
              borderRadius: "50%", 
              backgroundColor: loadingMongoData ? "#ffc107" : "#28a745",
              animation: loadingMongoData ? "pulse 1s infinite" : "none"
            }}></div>
            <small style={{ color: "#666" }}>
              {loadingMongoData ? "جاري التحديث..." : "محدث تلقائياً"}
            </small>
          </div>
          {mongoError && (
            <div style={{ color: "#dc3545", fontSize: "14px", padding: "10px", backgroundColor: "#f8d7da", borderRadius: "5px" }}>
              {mongoError}
            </div>
          )}
        </div>

        {loadingMongoData && mongoCategories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "18px", color: "#666" }}>جاري تحميل بيانات MongoDB...</div>
          </div>
        ) : mongoCategories.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            {mongoCategories.map((category) => {
              const categoryProducts = getMongoCategoryProducts(getCategoryId(category));
              
              return (
                <div key={getCategoryId(category)} style={{ marginBottom: "30px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "15px",
                      padding: "10px",
                      backgroundColor: "#e3f2fd",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#bbdefb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#e3f2fd";
                    }}
                  >
                    <h3 style={{ margin: 0, color: "#1565c0" }}>
                      {getCategoryName(category)}
                    </h3>
                    <span style={{ marginLeft: "10px", color: "#666" }}>
                      ({categoryProducts.length} منتج)
                    </span>
                  </div>

                  {categoryProducts.length > 0 ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                        gap: "20px",
                      }}
                    >
                      {categoryProducts.map((product) => {
                        const quantityInCart = getProductQuantityInCart(product._id || product.id);
                        const canAddToCart = quantityInCart < (product.stock || 0);
                        
                        return (
                          <div
                            key={product._id || product.id}
                            style={{
                              border: "1px solid #ddd",
                              borderRadius: "8px",
                              padding: "15px",
                              backgroundColor: "white",
                              textAlign: "center",
                              transition: "transform 0.3s, box-shadow 0.3s",
                              cursor: "pointer",
                            }}
                            onClick={() => openMongoProductDetails(product)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-5px)";
                              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <div style={{ position: "relative", height: "200px", marginBottom: "15px" }}>
                              <img
                                src={getImageUrl(product)}
                                alt={getProductTitle(product)}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                }}
                                onError={() => handleImageError(product._id || product.id)}
                              />
                              {(product.discountPercentage || product.discount) > 0 && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    backgroundColor: "#ff4757",
                                    color: "white",
                                    padding: "5px 10px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  -{Math.round(product.discountPercentage || product.discount)}%
                                </div>
                              )}
                              {!canAddToCart && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "10px",
                                    left: "10px",
                                    backgroundColor: "#6c757d",
                                    color: "white",
                                    padding: "5px 10px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {quantityInCart >= (product.stock || 0) ? "الكمية القصوى" : "غير متوفر"}
                                </div>
                              )}
                            </div>
                            <h4 style={{ margin: "10px 0", fontSize: "16px", minHeight: "48px" }}>
                              {getProductTitle(product)}
                            </h4>
                            <p style={{ color: "#666", fontSize: "14px", margin: "5px 0" }}>
                              {product.brand || "لا يوجد ماركة"}
                            </p>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "10px 0" }}>
                              <span style={{ fontWeight: "bold", color: "#007bff", fontSize: "18px" }}>
                                ${product.price}
                              </span>
                              {(product.discountPercentage || product.discount) > 0 && (
                                <span
                                  style={{
                                    textDecoration: "line-through",
                                    color: "#999",
                                    marginLeft: "10px",
                                    fontSize: "14px",
                                  }}
                                >
                                  ${Math.round(product.price / (1 - (product.discountPercentage || product.discount) / 100))}
                                </span>
                              )}
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "10px 0" }}>
                              <div style={{ display: "flex", alignItems: "center", marginRight: "10px" }}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="#ffc107"
                                  stroke="#ffc107"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                                <span style={{ marginLeft: "5px", fontSize: "14px" }}>
                                  {product.rating || "N/A"}
                                </span>
                              </div>
                              <span style={{ fontSize: "14px", color: (product.stock || 0) > 10 ? "#666" : (product.stock || 0) > 0 ? "#ffc107" : "#dc3545" }}>
                                ({product.stock || 0} {(product.stock || 0) > 0 ? "متوفر" : "غير متوفر"})
                              </span>
                            </div>
                            <div style={{ margin: "10px 0", fontSize: "14px", color: "#666" }}>
                              في السلة: {quantityInCart}
                            </div>
                            <button
                              style={{
                                padding: "10px 15px",
                                backgroundColor: canAddToCart ? "#28a745" : "#6c757d",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: canAddToCart ? "pointer" : "not-allowed",
                                opacity: canAddToCart ? 1 : 0.7,
                                width: "100%",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product, e);
                              }}
                              disabled={!canAddToCart}
                            >
                              {canAddToCart ? "إضافة إلى السلة" : "غير متوفر"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "20px", color: "#666", backgroundColor: "white", borderRadius: "8px" }}>
                      لا توجد منتجات في هذه الفئة
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            <div style={{ fontSize: "18px", marginBottom: "10px" }}>لا توجد فئات في MongoDB</div>
            <div style={{ fontSize: "14px" }}>تأكد من أن الخادم يعمل وأن هناك فئات في قاعدة البيانات</div>
          </div>
        )}
      </div>

      {/* إضافة أنيميشن للتحديث التلقائي */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );

}
