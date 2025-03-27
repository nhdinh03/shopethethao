import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const CategorySection = () => {
  const categories = [
    {
      id: 1,
      name: "Áo thể thao",
      description: "Thoáng mát, năng động",
      image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/49ee2f3f-847c-4bf8-8642-35619de8ce9f/sportswear-club-t-shirt-KBwTCk.png",
      count: "150+ sản phẩm",
      slug: "ao-the-thao"
    },
    {
      id: 2,
      name: "Giày thể thao",
      description: "Êm ái, bền bỉ",
      image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/15f901c90a9549d29104aae700d27efb_9366/Ultraboost_Light_Running_Shoes_Black_HQ6351_01_standard.jpg",
      count: "200+ sản phẩm",
      slug: "giay-the-thao"
    },
    {
      id: 3,
      name: "Quần thể thao",
      description: "Co giãn thoải mái",
      image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/d9e88f18-f275-4966-93c2-6043cbf94460/sportswear-club-fleece-joggers-KflRdQ.png",
      count: "120+ sản phẩm",
      slug: "quan-the-thao"
    },
    {
      id: 4,
      name: "Áo khoác thể thao",
      description: "Chống gió, nhẹ nhàng",
      image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/3f2a3e5e-1bd1-4228-a302-f8ad7d904e83/sportswear-windrunner-jacket-K9c2dt.png",
      count: "80+ sản phẩm",
      slug: "ao-khoac-the-thao"
    },
    {
      id: 5,
      name: "Phụ kiện thể thao",
      description: "Đa dạng, tiện lợi",
      image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fc8430c129234752b9c0acb30127b353_9366/Classic_3-Stripes_Backpack_Black_FT8764_01_standard.jpg",
      count: "300+ sản phẩm",
      slug: "phu-kien-the-thao"
    },
    {
      id: 6,
      name: "Đồ bơi",
      description: "Năng động, thời trang",
      image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/7fa70085-3254-4cc0-a790-437657ebab0a/6-volley-swim-shorts-LJmGnm.png",
      count: "70+ sản phẩm",
      slug: "do-boi"
    },
  ];

  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (scrollContainerRef.current) {
      observer.observe(scrollContainerRef.current);
      
      // Touch event listeners for mobile swipe
      const container = scrollContainerRef.current;
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchmove", handleTouchMove);
      container.addEventListener("touchend", handleTouchEnd);

      return () => {
        observer.disconnect();
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  };

  return (
    <section className="categories-section compact">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          viewport={{ once: true }}
        >
          <div className="header-content">
            <h2>DANH MỤC NỔI BẬT</h2>
            <p>Top danh mục phổ biến</p>
          </div>
          <Link to="/categories" className="view-more">
            Xem thêm <FiArrowRight />
          </Link>
        </motion.div>

        <motion.div
          className="categories-grid compact"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          ref={scrollContainerRef}
        >
          <AnimatePresence>
            {categories.map((category) => (
              <motion.div
                key={category.id}
                className="category-card"
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                layout
              >
                <div className="category-image">
                  <motion.img 
                    src={category.image} 
                    alt={category.name}
                    loading="lazy"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div 
                    className="category-overlay"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="product-count">{category.count}</span>
                  </motion.div>
                </div>
                <motion.div 
                  className="category-content"
                  whileHover={{ y: -5 }}
                >
                  <h3>{category.name}</h3>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to={`/category/${category.slug}`} className="category-link">
                      Khám phá ngay <FiArrowRight />
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;
