import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight, FaHeart, FaShoppingCart, FaChevronLeft, FaChevronRight, FaStar, FaRegStar } from "react-icons/fa";
import { mockProducts } from "data/mockData";

const ProductShowcase = () => {
  // Categories for the buttons
  const categories = [
    { id: "featured", name: "Nổi Bật" },
    { id: "new", name: "Mới Nhất" },
    { id: "sale", name: "Giảm Giá" },
    { id: "trending", name: "Xu Hướng" }
  ];

  const [activeCategory, setActiveCategory] = useState("featured");
  const [products, setProducts] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const sliderRef = useRef(null);

  // Pre-filter products for each category - ensure we always have products
  const categoryProducts = useMemo(() => {
    // Default limit of products per category
    const limit = 8;
    
    // Helper function to ensure we have at least N products
    const ensureMinProducts = (productsList, minCount = limit) => {
      if (productsList.length >= minCount) return productsList.slice(0, minCount);
      
      // If not enough products in this category, add some featured products
      const featuredProducts = mockProducts
        .filter(p => p.isBestSeller && !productsList.some(item => item.id === p.id))
        .slice(0, minCount - productsList.length);
      
      return [...productsList, ...featuredProducts].slice(0, minCount);
    };

    // Filter products for each category
    return {
      featured: ensureMinProducts(mockProducts.filter(product => product.isBestSeller)),
      new: ensureMinProducts(mockProducts.filter(product => product.isNew)),
      sale: ensureMinProducts(mockProducts.filter(product => product.discountPercentage > 0)),
      trending: ensureMinProducts(mockProducts.filter(product => product.rating >= 4.5))
    };
  }, []);

  // Format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // Generate star ratings based on rating value
  const renderStarRating = (rating, size = 5) => {
    return [...Array(size)].map((_, index) => {
      const filled = index < Math.floor(rating);
      const half = !filled && index < Math.ceil(rating) && rating % 1 !== 0;
      
      return filled ? (
        <FaStar key={index} className="filled" />
      ) : half ? (
        <FaStar key={index} className="half-filled" />
      ) : (
        <FaRegStar key={index} />
      );
    });
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
      },
    },
  };

  // Check scroll position for arrow visibility
  const checkScrollPosition = () => {
    if (!sliderRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    
    setShowLeftArrow(scrollLeft > 0);
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
    
    setTimeout(checkScrollPosition, 300);
  };

  // Change category with smooth transition
  const handleCategoryChange = (categoryId) => {
    if (categoryId === activeCategory) return;
    
    setIsLoading(true);
    setActiveCategory(categoryId);
    
    // Short timeout to show loading indicator and allow for smooth transition
    setTimeout(() => {
      setProducts(categoryProducts[categoryId]);
      setIsLoading(false);
      
      // Reset scroll position when changing categories
      if (sliderRef.current) {
        sliderRef.current.scrollLeft = 0;
        checkScrollPosition();
      }
    }, 300);
  };

  // Initialize with products from the active category
  useEffect(() => {
    setProducts(categoryProducts[activeCategory]);
    setIsLoading(false);
  }, [activeCategory, categoryProducts]);

  // Add scroll event listener
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollPosition);
      return () => slider.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  const renderProductCard = (product) => (
    <motion.div 
      className={`product-card ${activeCategory}-card`}
      key={product.id}
      variants={childVariants}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
    >
      <div className="product-image">
        <img src={product.image || product.thumbnail} alt={product.name} />
        {product.discountPercentage > 0 && (
          <span className="discount-badge">-{product.discountPercentage}%</span>
        )}
        <div className="product-actions">
          <button className="action-btn wishlist" aria-label="Add to wishlist">
            <FaHeart />
          </button>
          <button className="action-btn add-to-cart" aria-label="Add to cart">
            <FaShoppingCart />
          </button>
        </div>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          {renderStarRating(product.rating)}
          <span>({product.reviews || 0} đánh giá)</span>
        </div>
        <div className="product-price">
          {product.discountPercentage > 0 ? (
            <>
              <span className="discounted-price">
                {formatPrice(
                  Math.round(product.price * (1 - product.discountPercentage / 100))
                )}
                đ
              </span>
              <span className="original-price">{formatPrice(product.price)}đ</span>
            </>
          ) : (
            <span className="current-price">{formatPrice(product.price)}đ</span>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="featured-products compact showcase-products">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="header-content" >
            <h2>SẢN PHẨM TIÊU BIỂU</h2>
            <p>Khám phá các sản phẩm đa dạng của chúng tôi</p>
          </div>
          <Link to="/products" className="view-more">
            Xem tất cả <FaArrowRight />
          </Link>
        </motion.div>

        <div className="showcase-categories">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="products-slider-container">
          {showLeftArrow && (
            <button 
              className="slider-arrow arrow-left" 
              onClick={() => scroll('left')}
              aria-label="Scroll left"
            >
              <FaChevronLeft />
            </button>
          )}
          
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <motion.div 
              className="products-grid top-five showcase-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              ref={sliderRef}
            >
              {products.map(renderProductCard)}
            </motion.div>
          )}

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
      </div>
    </section>
  );
};

export default ProductShowcase;