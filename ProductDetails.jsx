 import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "./RTK/Slices/cartSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState("description");
  const sliderRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        let { data } = await axios.get(`https://dummyjson.com/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // تحريك تلقائي للسلايدر كل 3 ثواني
  useEffect(() => {
    if (product && product.images.length > 1) {
      const interval = setInterval(() => {
        goToSlide((currentIndex + 1) % product.images.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [product, currentIndex]);

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product && product.images.length > 0) {
      goToSlide((currentIndex - 1 + product.images.length) % product.images.length);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product && product.images.length > 0) {
      goToSlide((currentIndex + 1) % product.images.length);
    }
  };

  const handleAddToCart = () => {
    const productToAdd = { ...product, quantity };
    dispatch(addToCart(productToAdd));
  };

  const increaseQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, product.stock));
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star full">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">★</span>);
      }
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        flexDirection: "column"
      }}>
        <div className="loader"></div>
        <p style={{ marginTop: "20px" }}>جاري تحميل المنتج...</p>
        <style jsx>{`
          .loader {
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
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

  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-details-container">
      <div className="product-header">
        <h1 className="product-title">{product.title}</h1>
        <div className="product-rating">
          {renderStars(product.rating)}
          <span className="rating-value">({product.rating})</span>
        </div>
      </div>

      <div className="product-content">
        {/* صور المنتج كسلايدر محسن */}
        <div className="product-image-slider">
          <div 
            className="slider-container"
            ref={sliderRef}
          >
            <div 
              className="slider-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: isTransitioning ? "transform 0.5s ease-in-out" : "none"
              }}
            >
              {product.images.map((img, idx) => (
                <div key={idx} className="slide">
                  <img
                    src={img}
                    alt={`${product.title} - Image ${idx + 1}`}
                    className="product-image"
                  />
                </div>
              ))}
            </div>
            
            {product.images.length > 1 && (
              <>
                <button className="slider-btn prev" onClick={handlePrev}>
                  ‹
                </button>
                <button className="slider-btn next" onClick={handleNext}>
                  ›
                </button>
                
                <div className="slider-dots">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      className={`dot ${idx === currentIndex ? "active" : ""}`}
                      onClick={() => goToSlide(idx)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* تفاصيل المنتج */}
        <div className="product-info">
          <div className="product-tabs">
            <button 
              className={`tab-btn ${selectedTab === "description" ? "active" : ""}`}
              onClick={() => setSelectedTab("description")}
            >
              الوصف
            </button>
            <button 
              className={`tab-btn ${selectedTab === "details" ? "active" : ""}`}
              onClick={() => setSelectedTab("details")}
            >
              التفاصيل
            </button>
            <button 
              className={`tab-btn ${selectedTab === "reviews" ? "active" : ""}`}
              onClick={() => setSelectedTab("reviews")}
            >
              المراجعات ({product.reviews ? product.reviews.length : 0})
            </button>
          </div>

          <div className="tab-content">
            {selectedTab === "description" && (
              <div className="description-tab">
                <p>{product.description}</p>
              </div>
            )}
            
            {selectedTab === "details" && (
              <div className="details-tab">
                <div className="detail-item">
                  <span className="detail-label">العلامة التجارية:</span>
                  <span className="detail-value">{product.brand}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">الفئة:</span>
                  <span className="detail-value">{product.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">السعر:</span>
                  <span className="detail-value price">${product.price}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">المتوفر:</span>
                  <span className={`detail-value stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                    {product.stock > 0 ? `متوفر (${product.stock} قطعة)` : "غير متوفر"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">التقييم:</span>
                  <span className="detail-value rating">
                    {renderStars(product.rating)}
                    <span className="rating-text">({product.rating}/5)</span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">الخصم:</span>
                  <span className="detail-value discount">
                    {product.discountPercentage ? `${product.discountPercentage}%` : "لا يوجد"}
                  </span>
                </div>
              </div>
            )}
            
            {selectedTab === "reviews" && (
              <div className="reviews-tab">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review, idx) => (
                    <div key={idx} className="review-item">
                      <div className="review-header">
                        <span className="reviewer-name">{review.reviewerName}</span>
                        <span className="review-rating">
                          {renderStars(review.rating)}
                        </span>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      <span className="review-date">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="no-reviews">لا توجد مراجعات لهذا المنتج بعد</p>
                )}
              </div>
            )}
          </div>

          <div className="purchase-section">
            <div className="quantity-selector">
              <button 
                className="quantity-btn"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="quantity-value">{quantity}</span>
              <button 
                className="quantity-btn"
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            
            <div className="price-section">
              <span className="current-price">${(product.price * quantity).toFixed(2)}</span>
              {product.discountPercentage && (
                <span className="original-price">
                  ${(product.price * quantity * (1 + product.discountPercentage / 100)).toFixed(2)}
                </span>
              )}
            </div>
            
            <button
              className={`add-to-cart-btn ${product.stock > 0 ? "" : "disabled"}`}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? "أضف إلى السلة" : "غير متوفر"}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-details-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .product-header {
          margin-bottom: 30px;
          text-align: center;
        }
        
        .product-title {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 10px;
        }
        
        .product-rating {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .star {
          font-size: 1.5rem;
          color: #ddd;
        }
        
        .star.full {
          color: #ffc107;
        }
        
        .star.half {
          background: linear-gradient(90deg, #ffc107 50%, #ddd 50%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .rating-value {
          font-size: 1.2rem;
          color: #666;
        }
        
        .product-content {
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
        }
        
        .product-image-slider {
          flex: 1;
          min-width: 300px;
        }
        
        .slider-container {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .slider-track {
          display: flex;
          transition: transform 0.5s ease-in-out;
        }
        
        .slide {
          min-width: 100%;
        }
        
        .product-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          display: block;
        }
        
        .slider-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.7);
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: all 0.3s ease;
        }
        
        .slider-btn:hover {
          background: rgba(255, 255, 255, 0.9);
        }
        
        .slider-btn.prev {
          left: 10px;
        }
        
        .slider-btn.next {
          right: 10px;
        }
        
        .slider-dots {
          position: absolute;
          bottom: 15px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .dot.active {
          background: white;
          transform: scale(1.2);
        }
        
        .product-info {
          flex: 1;
          min-width: 300px;
        }
        
        .product-tabs {
          display: flex;
          border-bottom: 1px solid #eee;
          margin-bottom: 20px;
        }
        
        .tab-btn {
          padding: 12px 20px;
          background: none;
          border: none;
          font-size: 1rem;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .tab-btn.active {
          color: #007bff;
        }
        
        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 3px;
          background: #007bff;
        }
        
        .tab-content {
          margin-bottom: 30px;
        }
        
        .description-tab p {
          line-height: 1.6;
          color: #555;
        }
        
        .details-tab {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .detail-label {
          font-weight: 600;
          color: #333;
          min-width: 120px;
        }
        
        .detail-value {
          color: #555;
        }
        
        .detail-value.price {
          font-size: 1.2rem;
          font-weight: 700;
          color: #007bff;
        }
        
        .detail-value.stock.in-stock {
          color: #28a745;
        }
        
        .detail-value.stock.out-of-stock {
          color: #dc3545;
        }
        
        .detail-value.discount {
          color: #dc3545;
          font-weight: 600;
        }
        
        .reviews-tab {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .review-item {
          padding: 15px;
          border-radius: 8px;
          background: #f9f9f9;
          border: 1px solid #eee;
        }
        
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .reviewer-name {
          font-weight: 600;
          color: #333;
        }
        
        .review-rating {
          display: flex;
          align-items: center;
        }
        
        .review-rating .star {
          font-size: 1rem;
        }
        
        .review-comment {
          margin-bottom: 10px;
          line-height: 1.5;
          color: #555;
        }
        
        .review-date {
          font-size: 0.85rem;
          color: #999;
        }
        
        .no-reviews {
          text-align: center;
          padding: 20px;
          color: #999;
          font-style: italic;
        }
        
        .purchase-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px;
          border-radius: 8px;
          background: #f9f9f9;
          border: 1px solid #eee;
        }
        
        .quantity-selector {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }
        
        .quantity-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #ddd;
          background: white;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .quantity-btn:hover:not(:disabled) {
          background: #f0f0f0;
        }
        
        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .quantity-value {
          font-size: 1.2rem;
          font-weight: 600;
          min-width: 30px;
          text-align: center;
        }
        
        .price-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .current-price {
          font-size: 1.8rem;
          font-weight: 700;
          color: #007bff;
        }
        
        .original-price {
          font-size: 1.2rem;
          color: #999;
          text-decoration: line-through;
        }
        
        .add-to-cart-btn {
          padding: 15px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .add-to-cart-btn:hover:not(.disabled) {
          background: #0069d9;
        }
        
        .add-to-cart-btn.disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .product-content {
            flex-direction: column;
          }
          
          .product-title {
            font-size: 2rem;
          }
          
          .product-image {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
}
