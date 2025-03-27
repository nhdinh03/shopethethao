import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const BrandSection = () => {
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
  const [isVisible, setIsVisible] = useState(false);

  const checkScrollPosition = useCallback(() => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
  }, []);

  const scroll = useCallback((direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = direction === "left" ? -280 : 280;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    setTimeout(checkScrollPosition, 300);
  }, [checkScrollPosition]);

  useEffect(() => {
    const handleIntersection = (entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });
    
    if (sliderRef.current) {
      observer.observe(sliderRef.current);
      checkScrollPosition();
      sliderRef.current.addEventListener("scroll", checkScrollPosition);
    }
    
    return () => {
      if (sliderRef.current) {
        observer.unobserve(sliderRef.current);
        sliderRef.current.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, [checkScrollPosition]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.1,
      } 
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      }
    },
  };

  return (
    <section className="brands-section slider-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15 
          }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="title-highlight">THƯƠNG HIỆU NỔI BẬT</h2>
          <p className="subtitle-text">Đối tác chính thức với các thương hiệu thể thao hàng đầu thế giới</p>
        </motion.div>

        <div className="brands-slider-container">
          <AnimatePresence>
            {showLeftArrow && (
              <motion.button 
                className="slider-arrow arrow-left" 
                onClick={() => scroll("left")} 
                aria-label="Scroll left"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronLeft />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.div
            className="brands-slider"
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            ref={sliderRef}
          >
            {brands.map((brand, index) => (
              <motion.div
                key={index}
                className="brand-slide-card"
                variants={childVariants}
                onMouseEnter={() => setHoveredBrand(index)}
                onMouseLeave={() => setHoveredBrand(null)}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" 
                }}
              >
                <Link to={brand.link} className="brand-card-link">
                  <motion.div 
                    className="logo-container"
                    animate={hoveredBrand === index ? {
                      scale: 1.1,
                      transition: { duration: 0.3 }
                    } : {}}
                  >
                    <img 
                      src={brand.logo} 
                      alt={brand.name} 
                      className={hoveredBrand === index ? "logo-hover" : ""} 
                      loading="lazy"
                    />
                  </motion.div>
                  <div className="brand-info">
                    <h3>{brand.name}</h3>
                    <p>{brand.description}</p>
                    <div className="brand-popular-products">
                      {brand.bestsellers.slice(0, 2).map((item, i) => (
                        <span key={i} className="product-tag">{item}</span>
                      ))}
                    </div>
                    <motion.div 
                      className="view-brand"
                      animate={hoveredBrand === index ? {
                        x: 5,
                        transition: { duration: 0.3 }
                      } : {}}
                    >
                      <span>Xem thêm</span>
                      <FaChevronRight className="icon-arrow" />
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <AnimatePresence>
            {showRightArrow && (
              <motion.button 
                className="slider-arrow arrow-right" 
                onClick={() => scroll("right")} 
                aria-label="Scroll right"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronRight />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <motion.div 
          className="view-all-brands"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Link to="/brands" className="view-all-link">
            Xem tất cả thương hiệu <FaChevronRight className="arrow-icon" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandSection;
