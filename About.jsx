 import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

export default function About() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const dispatch = useDispatch();

  // Handle video looping - الإصلاح النهائي
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // إعداد الفيديو للتكرار
      video.loop = true; // استخدام خاصية loop المدمجة بدلاً من الحدث
      
      // محاولة تشغيل الفيديو عند التحميل
      const playVideo = async () => {
        try {
          await video.play();
          console.log("Video started successfully");
        } catch (error) {
          console.error("Video autoplay failed:", error);
          
          // إضافة زر تشغيل يدوي إذا فشل التشغيل التلقائي
          const playButton = document.createElement('button');
          playButton.innerHTML = '▶ تشغيل الفيديو';
          playButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            z-index: 1000;
            font-weight: bold;
          `;
          playButton.onclick = () => {
            video.play();
            playButton.remove();
          };
          document.body.appendChild(playButton);
        }
      };

      // انتظار حتى يكون الفيديو جاهزاً
      video.addEventListener('loadeddata', playVideo);
      video.addEventListener('canplay', playVideo);
      
      // بدء التشغيل فوراً إذا كان الفيديو جاهزاً بالفعل
      if (video.readyState >= 3) {
        playVideo();
      }

      return () => {
        video.removeEventListener('loadeddata', playVideo);
        video.removeEventListener('canplay', playVideo);
      };
    }
  }, []);

  // إضافة styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Montserrat', sans-serif;
      }
      
      .about-container {
        position: relative;
        min-height: 100vh;
        overflow: hidden;
        background: #000;
      }
      
      .video-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -2;
        object-fit: cover;
      }
      
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(25,25,40,0.7) 100%);
        z-index: -1;
      }
      
      .content {
        position: relative;
        z-index: 1;
        padding: 2rem;
        color: white;
      }
      
      .hero-section {
        text-align: center;
        padding: 6rem 1rem;
        max-width: 1200px;
        margin: 0 auto;
        animation: fadeIn 1.5s ease-out;
      }
      
      .hero-badge {
        display: inline-block;
        padding: 8px 20px;
        background: rgba(102, 126, 234, 0.2);
        border: 1px solid rgba(102, 126, 234, 0.5);
        border-radius: 30px;
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 1px;
        margin-bottom: 1.5rem;
        color: #a5b4fc;
        text-transform: uppercase;
      }
      
      .hero-title {
        font-size: clamp(2.5rem, 8vw, 5rem);
        font-weight: 800;
        line-height: 1.1;
        margin-bottom: 1.5rem;
        background: linear-gradient(90deg, #fff, #a5b4fc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 5px 30px rgba(102, 126, 234, 0.3);
      }
      
      .hero-subtitle {
        font-size: clamp(1.1rem, 3vw, 1.5rem);
        font-weight: 300;
        max-width: 700px;
        margin: 0 auto 2.5rem;
        opacity: 0.9;
        line-height: 1.6;
      }
      
      .cta-buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
      }
      
      .cta-button {
        display: inline-block;
        padding: 14px 32px;
        border-radius: 50px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        z-index: 1;
      }
      
      .cta-primary {
        background: linear-gradient(90deg, #667eea, #764ba2);
        color: white;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }
      
      .cta-primary:hover {
        transform: translateY(-3px);
        box-shadow: 0 7px 20px rgba(102, 126, 234, 0.6);
      }
      
      .cta-secondary {
        background: transparent;
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
      }
      
      .cta-secondary:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.5);
      }
      
      .features-section {
        padding: 5rem 0;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .section-header {
        text-align: center;
        margin-bottom: 4rem;
      }
      
      .section-subtitle {
        color: #a5b4fc;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
      }
      
      .section-title {
        font-size: clamp(2rem, 5vw, 3rem);
        font-weight: 700;
        margin-bottom: 1rem;
        position: relative;
        display: inline-block;
      }
      
      .section-title::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 70px;
        height: 4px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 2px;
      }
      
      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }
      
      .feature-card {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        padding: 2.5rem;
        text-align: center;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);
        height: 100%;
      }
      
      .feature-card:hover {
        transform: translateY(-10px);
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(102, 126, 234, 0.3);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      }
      
      .feature-icon {
        font-size: 3.5rem;
        margin-bottom: 1.5rem;
        display: block;
      }
      
      .feature-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }
      
      .feature-description {
        opacity: 0.8;
        line-height: 1.6;
      }
      
      .products-section {
        padding: 5rem 0;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
      }
      
      .product-card {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .product-card:hover {
        transform: translateY(-10px);
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(102, 126, 234, 0.3);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      }
      
      .product-image-container {
        position: relative;
        height: 220px;
        overflow: hidden;
      }
      
      .product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
      
      .product-card:hover .product-image {
        transform: scale(1.05);
      }
      
      .product-badge {
        position: absolute;
        top: 15px;
        right: 15px;
        background: rgba(102, 126, 234, 0.8);
        color: white;
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
      }
      
      .product-info {
        padding: 1.5rem;
      }
      
      .product-category {
        color: #a5b4fc;
        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 0.5rem;
      }
      
      .product-title {
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        line-height: 1.4;
      }
      
      .product-price {
        font-size: 1.5rem;
        font-weight: 700;
        color: #a5b4fc;
        margin-bottom: 1.5rem;
      }
      
      .add-to-cart-btn {
        width: 100%;
        padding: 12px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .add-to-cart-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
      }
      
      .add-to-cart-btn:disabled {
        background: #444;
        cursor: not-allowed;
        transform: none;
      }
      
      .stats-section {
        padding: 5rem 0;
        background: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(5px);
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        max-width: 1000px;
        margin: 0 auto;
      }
      
      .stat-card {
        text-align: center;
        padding: 1.5rem;
      }
      
      .stat-number {
        font-size: 3rem;
        font-weight: 800;
        background: linear-gradient(90deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.5rem;
      }
      
      .stat-label {
        font-size: 1rem;
        opacity: 0.8;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .testimonial-section {
        padding: 5rem 0;
        max-width: 1000px;
        margin: 0 auto;
      }
      
      .testimonial-card {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        padding: 2.5rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 2rem;
      }
      
      .testimonial-text {
        font-size: 1.2rem;
        font-style: italic;
        margin-bottom: 2rem;
        line-height: 1.7;
      }
      
      .testimonial-author {
        display: flex;
        align-items: center;
      }
      
      .author-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-right: 1rem;
      }
      
      .author-info {
        flex: 1;
      }
      
      .author-name {
        font-weight: 600;
        margin-bottom: 0.2rem;
      }
      
      .author-title {
        font-size: 0.9rem;
        opacity: 0.7;
      }
      
      .footer {
        text-align: center;
        padding: 3rem 1rem;
        margin-top: 4rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .footer-links {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
      }
      
      .footer-link {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        transition: color 0.3s ease;
      }
      
      .footer-link:hover {
        color: #a5b4fc;
      }
      
      .social-links {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;
      }
      
      .social-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        text-decoration: none;
        transition: all 0.3s ease;
      }
      
      .social-link:hover {
        background: rgba(102, 126, 234, 0.3);
        transform: translateY(-3px);
      }
      
      .copyright {
        font-size: 0.9rem;
        opacity: 0.7;
      }
      
      .video-fallback {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -2;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes countUp {
        from {
          opacity: 0;
          transform: scale(0.5);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @media (max-width: 768px) {
        .hero-section {
          padding: 4rem 1rem;
        }
        
        .features-section,
        .products-section,
        .stats-section,
        .testimonial-section {
          padding: 3rem 0;
        }
        
        .cta-buttons {
          flex-direction: column;
          align-items: center;
        }
        
        .cta-button {
          width: 100%;
          max-width: 300px;
        }
      }
    `;
    document.head.appendChild(style);
    
    // تنظيف الـ style عند إلغاء التحميل
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="about-container">
      {/* Background Video */}
      <video 
        ref={videoRef}
        className="video-background"
        autoPlay
        muted
        playsInline
        loop // استخدام خاصية loop المدمجة
        preload="auto" // تحميل الفيديو مسبقاً
        poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" // صورة بديلة أثناء التحميل
      >
        {/* استخدام رابط فيديو مجاني متاح للجميع */}
        <source src= "https://www.pexels.com/video/man-using-credit-card-to-purchase-6994840"  type="video/mp4" />
         Your browser does not support the video tag.
      </video>
      
      {/* Fallback في حالة عدم تحميل الفيديو */}
      <div className="video-fallback" style={{display: 'none'}}>
        <div>فيديو الخلفية غير متوفر</div>
      </div>
      
      {/* Overlay */}
      <div className="overlay"></div>
      
      <div className="content">
        {/* Hero Section */}
        <section className="hero-section">
          <span className="hero-badge">Welcome to Our Store</span>
          <h1 className="hero-title">Discover Amazing Products</h1>
          <p className="hero-subtitle">
            We bring you the finest selection of products with unbeatable prices and exceptional quality. 
            Your shopping experience redefined.
          </p>
          <div className="cta-buttons">
            <Link to="/shop" className="cta-button cta-primary">Shop Now</Link>
            <Link to="/contact" className="cta-button cta-secondary">Contact Us</Link>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <p className="section-subtitle">Why Choose Us</p>
            <h2 className="section-title">We Provide The Best Service</h2>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🚚</span>
              <h3 className="feature-title">Fast Delivery</h3>
              <p className="feature-description">
                Get your orders delivered quickly and efficiently to your doorstep anywhere in the country.
              </p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">💎</span>
              <h3 className="feature-title">Premium Quality</h3>
              <p className="feature-description">
                All our products are carefully selected to ensure the highest quality standards and durability.
              </p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">🎁</span>
              <h3 className="feature-title">Exclusive Offers</h3>
              <p className="feature-description">
                Enjoy special discounts and exclusive offers on our latest products and collections.
              </p>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number" data-target="10000">10000</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number" data-target="5000">4000</div>
              <div className="stat-label">Products Available</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number" data-target="50">5000</div>
              <div className="stat-label">Categories</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number" data-target="99">70000</div>
              <div className="stat-label">% Satisfaction</div>
            </div>
          </div>
        </section>
        
        {/* Testimonial Section */}
        <section className="testimonial-section">
          <div className="section-header">
            <p className="section-subtitle">Testimonials</p>
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
          
          <div className="testimonial-card">
            <p className="testimonial-text">
              "I've been shopping with this store for over a year now, and I'm always impressed with the quality of products and the speed of delivery. The customer service is exceptional!"
            </p>
            <div className="testimonial-author">
              <img 
                src="https://randomuser.me/api/portraits/women/44.jpg" 
                alt="Customer" 
                className="author-avatar"
              />
              <div className="author-info">
                <div className="author-name">Sarah Johnson</div>
                <div className="author-title">Regular Customer</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="footer">
          <div className="footer-links">
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/shop" className="footer-link">Shop</Link>
            <Link to="/about" className="footer-link">About</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
          </div>
          
          <div className="social-links">
            <a href="#" className="social-link">
              <span>f</span>
            </a>
            <a href="#" className="social-link">
              <span>t</span>
            </a>
            <a href="#" className="social-link">
              <span>in</span>
            </a>
            <a href="#" className="social-link">
              <span>ig</span>
            </a>
          </div>
          
         </footer>
      </div>
    </div>
  );
}