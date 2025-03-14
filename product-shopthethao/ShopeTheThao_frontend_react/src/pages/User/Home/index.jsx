import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiStar,
  FiHeart,
  FiShoppingBag,
  FiFilter,
  FiGrid,
  FiList,
  FiChevronDown,
} from "react-icons/fi";

import "./Home.scss";
import { mockProducts } from "data/mockData";
import { breadcrumbDataUser } from "layouts/User/BreadcrumbUser/BreadcrumbUserConfig";
import { ProductCard } from "components/User";

const HomeIndex = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [breadcrumbData, setBreadcrumbData] = useState(breadcrumbDataUser);

  // Mock data for categories
  const categories = [
    {
      id: 1,
      name: "Áo thun",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 2,
      name: "Áo khoác",
      image:
        "https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 3,
      name: "Quần jeans",
      image:
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 4,
      name: "Giày",
      image:
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
  ];

  // Mock data for brands
  const brands = [
    "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    "https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Puma_AG.svg/1200px-Puma_AG.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Under_Armour_logo.svg/1200px-Under_Armour_logo.svg.png",
  ];

  const banners = [
    {
      title: "Bộ Sưu Tập Mùa Hè 2023",
      subtitle: "Giảm giá đến 30% cho các sản phẩm mới",
      buttonText: "Mua ngay",
      image:
        "https://images.unsplash.com/photo-1536766820879-059fec98ec0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      title: "Giày Thể Thao Mới Nhất",
      subtitle: "Thiết kế đặc biệt cho hiệu suất vượt trội",
      buttonText: "Khám phá",
      image:
        "https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      title: "Phong Cách Thể Thao Hiện Đại",
      subtitle: "Thời trang thể thao cho cuộc sống năng động",
      buttonText: "Xem ngay",
      image:
        "https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
  ];

  // Auto rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  // Load products
  useEffect(() => {
    // Simulate API loading
    console.log("Loading products from mock data:", mockProducts);
    setTimeout(() => {
      if (mockProducts && mockProducts.length) {
        setDisplayedProducts(mockProducts.slice(0, 8)); // Show first 8 products
        console.log("Displayed products set:", mockProducts.slice(0, 8));
      } else {
        console.error("Mock products data is empty or undefined");
      }
      setLoading(false);
    }, 500);
  }, []);

  // Load products for the home page
  useEffect(() => {
    // Simulate an API call
    setTimeout(() => {
      // Get 4 products for the featured section
      if (mockProducts && mockProducts.length > 0) {
        // Get products marked as bestsellers or new, or just take the first 4
        const featured = mockProducts
          .filter((p) => p.isBestSeller || p.isNew)
          .slice(0, 4);

        setFeaturedProducts(
          featured.length > 0 ? featured : mockProducts.slice(0, 4)
        );
        console.log(
          "Featured products set:",
          featured.length > 0 ? featured : mockProducts.slice(0, 4)
        );
      } else {
        console.error("Unable to set featured products: mockProducts is empty");
      }
      setIsLoading(false);
    }, 300);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
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

  // Format price with VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price * (1 - discount / 100);
  };

  return (
    <div className="home-page">
      {/* Hero Banner Section */}
      <section className="hero-banner">
        <div
          className="banner-slide"
          style={{
            backgroundImage: `url(${banners[currentBannerIndex].image})`,
          }}
        >
          <div className="banner-content">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {banners[currentBannerIndex].title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {banners[currentBannerIndex].subtitle}
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="cta-button"
            >
              {banners[currentBannerIndex].buttonText}
              <FiArrowRight />
            </motion.button>
          </div>
        </div>
        <div className="banner-indicators">
          {banners.map((_, index) => (
            <span
              key={index}
              className={`indicator ${
                currentBannerIndex === index ? "active" : ""
              }`}
              onClick={() => setCurrentBannerIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>Danh Mục Sản Phẩm</h2>
            <p>Khám phá các danh mục sản phẩm thể thao hàng đầu</p>
          </motion.div>

          <motion.div
            className="categories-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categories.map((category) => (
              <motion.div
                key={category.id}
                className="category-card"
                variants={childVariants}
              >
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                </div>
                <h3>{category.name}</h3>
                <Link to={`/category/${category.id}`} className="category-link">
                  Xem sản phẩm <FiArrowRight />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Section - New Addition */}
      <section className="products-section">
        <div className="container">
          {/* <motion.div 
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>Sản Phẩm Thể Thao</h2>
            <p>Khám phá bộ sưu tập quần áo và phụ kiện thể thao cao cấp</p>
          </motion.div> */}

          {/* Products Toolbar */}
          <div className="products-toolbar">
            <button
              className="filter-toggle"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FiFilter /> {filterOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
            </button>

            <div className="view-options">
              <span className="product-count">
                Hiển thị {displayedProducts ? displayedProducts.length : 0} sản
                phẩm
              </span>

              <div className="view-buttons">
                <button
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <FiGrid />
                </button>
                <button
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <FiList />
                </button>
              </div>

              <div className="sort-dropdown">
                <select aria-label="Sort products">
                  <option>Phổ biến nhất</option>
                  <option>Giá: Thấp đến cao</option>
                  <option>Giá: Cao đến thấp</option>
                  <option>Mới nhất</option>
                </select>
                <FiChevronDown className="dropdown-icon" />
              </div>
            </div>
          </div>

          {/* Products Container */}
          <div
            className={`products-container ${filterOpen ? "with-filters" : ""}`}
          >
            {/* Filters Sidebar */}
            {filterOpen && (
              <div className="filters-sidebar">
                <h3>Bộ lọc sản phẩm</h3>

                <div className="filter-section">
                  <h4>Danh mục</h4>
                  <div className="filter-options">
                    <label className="checkbox-label">
                      <input type="checkbox" /> Áo thun thể thao
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Áo khoác
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Quần thể thao
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Giày
                    </label>
                  </div>
                </div>

                <div className="filter-section">
                  <h4>Thương hiệu</h4>
                  <div className="filter-options">
                    <label className="checkbox-label">
                      <input type="checkbox" /> Nike
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Adidas
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Puma
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Under Armour
                    </label>
                  </div>
                </div>

                <button className="reset-filters">Xóa bộ lọc</button>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Đang tải sản phẩm...</p>
              </div>
            ) : displayedProducts && displayedProducts.length > 0 ? (
              <motion.div
                className={`products-grid view-${viewMode}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {displayedProducts.map((product, index) => (
                  <motion.div
                    key={product.id || index}
                    className="product-item"
                    variants={itemVariants}
                  >
                    <ProductCard product={product} index={index} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="no-products">
                <p>Không tìm thấy sản phẩm nào.</p>
              </div>
            )}
          </div>

          {/* All Products Link */}
          <div className="view-all-container">
            <Link to="/v1/shop/products" className="view-all-link">
              Xem tất cả sản phẩm <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>Sản Phẩm Nổi Bật</h2>
            <p>
              Khám phá các sản phẩm thể thao được yêu thích nhất của chúng tôi
            </p>
          </motion.div>

          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Đang tải sản phẩm...</p>
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map((product, index) => (
                <div key={product.id || index} className="product-item">
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>Không tìm thấy sản phẩm nổi bật nào.</p>
            </div>
          )}

          <div className="view-all-container">
            <Link to="/v1/shop/products" className="view-all-link">
              Xem tất cả sản phẩm <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-content">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              GIẢM GIÁ CUỐI MÙA
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Giảm giá đến 50% cho tất cả các sản phẩm mùa hè
            </motion.p>
            <motion.button
              className="shop-now-btn"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Mua ngay
            </motion.button>
          </div>
        </div>
      </section>

      {/* Brand Section */}
      <section className="brands-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>Thương Hiệu Nổi Bật</h2>
            <p>
              Chúng tôi hợp tác với các thương hiệu thể thao hàng đầu thế giới
            </p>
          </motion.div>

          <motion.div
            className="brands-list"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {brands.map((brand, index) => (
              <motion.div
                key={index}
                className="brand-logo"
                variants={childVariants}
              >
                <img src={brand} alt={`Brand ${index + 1}`} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomeIndex;
