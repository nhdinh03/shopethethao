import React, { useState, useEffect, Suspense, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaRegPaperPlane, FaStar, FaRegStar, FaHeart, FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
import "./Home.scss";
import { BrandSection, Slideshow, CategorySection } from "components/User";
import Loading from "pages/Loading/loading";
import { mockProducts } from "data/mockData";
import { noibatdata } from "data/noibatdata";

const HomeIndex = () => {
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [0, 5000000],
    sort: "popular",
  });

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

  // Data loading for products and featured products
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API loading with a small delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Load featured products from noibatdata
        if (noibatdata && noibatdata.length > 0) {
          setFeaturedProducts(noibatdata.slice(0, 5));
        } else {
          const featured = mockProducts
            .filter((product) => product.isBestSeller || product.isNew)
            .slice(0, 5);
          setFeaturedProducts(featured);
        }
        
        // Load new arrivals (display the latest products)
        const newArrivals = [...mockProducts]
          .sort((a, b) => b.id - a.id)
          .slice(0, 5);
        setDisplayedProducts(newArrivals);
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading product data:", error);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

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

  const renderProductCard = (product) => (
    <motion.div 
      className="product-card" 
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
    <div className="home-page">
      <Slideshow />

      <Suspense fallback={<Loading />}>
        <CategorySection />
      </Suspense>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2>SẢN PHẨM NỔI BẬT</h2>
            <p>Khám phá các sản phẩm thể thao bán chạy và được yêu thích nhất</p>
          </motion.div>
          
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Đang tải sản phẩm...</p>
            </div>
          ) : (
            <motion.div 
              className="products-grid five-products"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {featuredProducts.map(renderProductCard)}
            </motion.div>
          )}
          
          <div className="view-all-container">
            <Link to="/products" className="view-all-link">
              Xem tất cả sản phẩm <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <motion.section 
        className="promo-banner"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <motion.div 
            className="promo-content"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2>Khuyến Mãi Đặc Biệt</h2>
            <p>Giảm giá lên đến 50% cho các sản phẩm thể thao cao cấp. Thời gian có hạn!</p>
            <Link to="/products" className="shop-now-btn">
              Mua Ngay
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* New Arrivals Section */}
      <section className="featured-products">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2>SẢN PHẨM MỚI</h2>
            <p>Cập nhật xu hướng thể thao mới nhất với các sản phẩm vừa ra mắt</p>
          </motion.div>
          
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Đang tải sản phẩm...</p>
            </div>
          ) : (
            <motion.div 
              className="products-grid five-products"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {displayedProducts.map(renderProductCard)}
            </motion.div>
          )}
          
          <div className="view-all-container">
            <Link to="/products?sort=newest" className="view-all-link">
              Xem tất cả sản phẩm mới <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <motion.section 
        className="newsletter-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Đăng Ký Nhận Tin
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Nhận thông tin về sản phẩm mới, khuyến mãi độc quyền và lời khuyên từ chuyên gia thể thao
          </motion.p>
          <motion.form 
            className="email-form"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <input
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
              required
            />
            <button type="submit">
              <FaRegPaperPlane /> Đăng Ký
            </button>
          </motion.form>
        </div>
      </motion.section>

      <Suspense fallback={<Loading />}>
        <BrandSection />
      </Suspense>
    </div>
  );
};

export default HomeIndex;
