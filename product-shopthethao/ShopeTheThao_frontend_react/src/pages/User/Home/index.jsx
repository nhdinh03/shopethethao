import React, {
  useState,
  useEffect,
  Suspense,
  useCallback,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaRegPaperPlane,
  FaStar,
  FaRegStar,
  FaHeart,
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import "./Home.scss";
import {
  BrandSection,
  Slideshow,
  CategorySection,
  ProductShowcase,
} from "components/User";

import Loading from "pages/Loading/loading";
import { mockProducts } from "data/mockData";
import { noibatdata } from "data/noibatdata";
import RelatedProducts from "components/User/RelatedProducts";
import { ROUTES } from "router";

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
  const [featuredScrollIndex, setFeaturedScrollIndex] = useState(0);
  const [newScrollIndex, setNewScrollIndex] = useState(0);
  const featuredScrollRef = useRef(null);
  const newScrollRef = useRef(null);
  const [showLeftArrows, setShowLeftArrows] = useState({
    featured: false,
    new: false,
  });
  const [showRightArrows, setShowRightArrows] = useState({
    featured: true,
    new: true,
  });

  const handleScroll = useCallback((ref, setIndex) => {
    if (ref.current) {
      const scrollLeft = ref.current.scrollLeft;
      const itemWidth = ref.current.offsetWidth / 3; // Adjusted for visible items
      const newIndex = Math.round(scrollLeft / itemWidth);
      setIndex(newIndex);
    }
  }, []);

  const checkScrollPosition = (ref, section) => {
    if (!ref.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = ref.current;

    setShowLeftArrows((prev) => ({
      ...prev,
      [section]: scrollLeft > 0,
    }));

    setShowRightArrows((prev) => ({
      ...prev,
      [section]: scrollLeft < scrollWidth - clientWidth - 5,
    }));
  };

  const scroll = (direction, ref, section) => {
    if (!ref.current) return;

    const scrollAmount = direction === "left" ? -280 : 280;
    ref.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });

    setTimeout(() => checkScrollPosition(ref, section), 300);
  };

  useEffect(() => {
    const featuredContainer = featuredScrollRef.current;
    const newContainer = newScrollRef.current;

    const handleFeaturedScroll = () => {
      handleScroll(featuredScrollRef, setFeaturedScrollIndex);
      checkScrollPosition(featuredScrollRef, "featured");
    };

    const handleNewScroll = () => {
      handleScroll(newScrollRef, setNewScrollIndex);
      checkScrollPosition(newScrollRef, "new");
    };

    if (featuredContainer) {
      featuredContainer.addEventListener("scroll", handleFeaturedScroll);
    }
    if (newContainer) {
      newContainer.addEventListener("scroll", handleNewScroll);
    }

    return () => {
      if (featuredContainer) {
        featuredContainer.removeEventListener("scroll", handleFeaturedScroll);
      }
      if (newContainer) {
        newContainer.removeEventListener("scroll", handleNewScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    // Initial check for scroll buttons
    setTimeout(() => {
      checkScrollPosition(featuredScrollRef, "featured");
      checkScrollPosition(newScrollRef, "new");
    }, 100);
  }, [featuredProducts, displayedProducts]);

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
        await new Promise((resolve) => setTimeout(resolve, 800));

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
                  Math.round(
                    product.price * (1 - product.discountPercentage / 100)
                  )
                )}
                đ
              </span>
              <span className="original-price">
                {formatPrice(product.price)}đ
              </span>
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
      <section className="featured-products compact">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="header-content">
              <h2>SẢN PHẨM NỔI BẬT</h2>
              <p>Top 5 sản phẩm bán chạy nhất</p>
            </div>
            <Link to={ROUTES.SHOP.PRODUCTS} className="view-more">
              Xem thêm <FaArrowRight />
            </Link>
          </motion.div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="products-slider-container">
              {showLeftArrows.featured && (
                <button
                  className="slider-arrow arrow-left"
                  onClick={() => scroll("left", featuredScrollRef, "featured")}
                  aria-label="Previous products"
                >
                  <FaChevronLeft />
                </button>
              )}

              <motion.div
                className="products-grid top-five"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                ref={featuredScrollRef}
              >
                {featuredProducts.map(renderProductCard)}
              </motion.div>

              {showRightArrows.featured && (
                <button
                  className="slider-arrow arrow-right"
                  onClick={() => scroll("right", featuredScrollRef, "featured")}
                  aria-label="Next products"
                >
                  <FaChevronRight />
                </button>
              )}
            </div>
          )}
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
            <p>
              Giảm giá lên đến 50% cho các sản phẩm thể thao cao cấp. Thời gian
              có hạn!
            </p>
            <Link to="/products" className="shop-now-btn">
              Mua Ngay
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Product Showcase Section with Category Tabs */}
      <Suspense fallback={<Loading />}>
        <ProductShowcase />
      </Suspense>

      {/* New Arrivals Section */}
      <section className="featured-products compact new-products">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="header-content">
              <h2>SẢN PHẨM MỚI</h2>
              <p>Top 5 sản phẩm mới nhất</p>
            </div>
            <Link to="/products?sort=newest" className="view-more">
              Xem thêm <FaArrowRight />
            </Link>
          </motion.div>

          {loading ? (
            <div className="loading-spinner">
              <div class="spinner"></div>
            </div>
          ) : (
            <div className="products-slider-container">
              {showLeftArrows.new && (
                <button
                  className="slider-arrow arrow-left"
                  onClick={() => scroll("left", newScrollRef, "new")}
                  aria-label="Previous products"
                >
                  <FaChevronLeft />
                </button>
              )}

              <motion.div
                className="products-grid top-five"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                ref={newScrollRef}
              >
                {displayedProducts.map(renderProductCard)}
              </motion.div>

              {showRightArrows.new && (
                <button
                  className="slider-arrow arrow-right"
                  onClick={() => scroll("right", newScrollRef, "new")}
                  aria-label="Next products"
                >
                  <FaChevronRight />
                </button>
              )}
            </div>
          )}
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
            Nhận thông tin về sản phẩm mới, khuyến mãi độc quyền và lời khuyên
            từ chuyên gia thể thao
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
