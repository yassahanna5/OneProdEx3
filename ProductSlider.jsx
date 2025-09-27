import React, { useState, useEffect } from "react";

export default function ProductSlider({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % products.length);
    }, 2500); // 2.5 ثانية لكل صورة
    return () => clearInterval(interval);
  }, [products.length]);

  if (!products || products.length === 0) return null;

  return (
    <div style={{ width: '100%', overflow: 'hidden', textAlign: 'center', margin: '20px 0' }}>
      <img
        src={products[currentIndex].image || products[currentIndex].id}
        alt={products[currentIndex].title}
        style={{ width: '300px', height: '300px', objectFit: 'contain' }}
      />
    </div>
  );
}
