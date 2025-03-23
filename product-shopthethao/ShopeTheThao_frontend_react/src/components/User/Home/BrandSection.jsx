import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const BrandSection = () => {
  // Simplified brand data with additional items for slider functionality
  const brands = [
    {
      name: "Adidas",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
      description: "Performance, passion, integrity",
      bestsellers: ["Ultraboost", "Stan Smith", "Superstar"],
      link: "/brands/adidas",
      bgColor: "#000000",
      textColor: "#ffffff"
    },
    {
      name: "Nike",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
      description: "Just do it",
      bestsellers: ["Air Max", "Air Jordan", "Air Force 1"],
      link: "/brands/nike",
      bgColor: "#f5f5f5",
      textColor: "#333333"
    },
    {
      name: "Puma",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Puma-logo-%28text%29.svg",
      description: "Forever faster",
      bestsellers: ["Suede Classic", "RS-X", "Future Rider"],
      link: "/brands/puma",
      bgColor: "#f5f5f5",
      textColor: "#333333"
    },
    {
      name: "Under Armour",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Under_armour_logo.svg",
      description: "Under Armour makes you better",
      bestsellers: ["HOVR", "Curry Collection", "Project Rock"],
      link: "/brands/under-armour",
      bgColor: "#f5f5f5",
      textColor: "#333333"
    },
    {
      name: "New Balance",
      logo: "https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg",
      description: "Always in beta",
      bestsellers: ["990 Series", "574", "Fresh Foam"],
      link: "/brands/new-balance",
      bgColor: "#f5f5f5",
      textColor: "#333333"
    },
    {
      name: "Asics",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Asics_Logo.svg",
      description: "Sound Mind, Sound Body",
      bestsellers: ["Gel-Kayano", "Gel-Nimbus", "Metarun"],
      link: "/brands/asics",
      bgColor: "#f5f5f5",
      textColor: "#333333"
    }
  ];

  const [hoveredBrand, setHoveredBrand] = useState(null);
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Scroll handling
  const checkScrollPosition = () => {
    if (!sliderRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    
    // Show/hide left arrow based on scroll position
    setShowLeftArrow(scrollLeft > 0);
    
    // Show/hide right arrow based on whether we can scroll further right
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
  };

  // Scroll the slider left or right
  const scroll = (direction) => {
    if (!sliderRef.current) return;
    
    const scrollAmount = direction === 'left' ? -280 : 280;
    sliderRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
    
    // Check scroll position after scrolling
    setTimeout(checkScrollPosition, 300);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      },
    },
  };

  return (
    <section className="brands-section slider-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="title-highlight">THƯƠNG HIỆU NỔI BẬT</h2>
          <p className="subtitle-text">
            Đối tác chính thức với các thương hiệu thể thao hàng đầu thế giới
          </p>
        </motion.div>

        <div className="brands-slider-container">
          {showLeftArrow && (
            <button 
              className="slider-arrow arrow-left" 
              onClick={() => scroll('left')}
              aria-label="Scroll left"
            >
              <FaChevronLeft />
            </button>
          )}
          
          <motion.div
            className="brands-slider"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            ref={sliderRef}
            onScroll={checkScrollPosition}
          >
            {brands.map((brand, index) => (
              <motion.div
                key={index}
                className="brand-slide-card"
                variants={childVariants}
                onMouseEnter={() => setHoveredBrand(index)}
                onMouseLeave={() => setHoveredBrand(null)}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <Link to={brand.link} className="brand-card-link">
                  <div className="logo-container">
                    <img 
                      src={brand.logo} 
                      alt={brand.name} 
                      className={hoveredBrand === index ? 'logo-hover' : ''}
                    />
                  </div>
                  
                  <div className="brand-info">
                    <h3>{brand.name}</h3>
                    <p>{brand.description}</p>
                    
                    <div className="brand-popular-products">
                      <span className="product-tag">{brand.bestsellers[0]}</span>
                      <span className="product-tag">{brand.bestsellers[1]}</span>
                    </div>
                    
                    <div className="view-brand">
                      <span>Xem thêm</span>
                      <FaChevronRight className="icon-arrow" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          {showRightArrow && (
            <button 
              className="slider-arrow arrow-right" 
              onClick={() => scroll('right')}
              aria-label="Scroll right"
            >
              <FaChevronRight />
            </button>
          )}
        </div>
        
        {/* <div className="slider-indicator">
          {brands.map((_, index) => (
            <span 
              key={index} 
              className={`indicator-dot ${index < 3 ? 'active' : ''}`}
            />
          ))}
        </div> */}
        
        <div className="view-all-brands">
          <Link to="/brands" className="view-all-link">
            Xem tất cả thương hiệu <FaChevronRight className="arrow-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BrandSection;
