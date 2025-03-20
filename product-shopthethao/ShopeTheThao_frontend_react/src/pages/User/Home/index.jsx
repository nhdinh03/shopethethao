import React, { useState, useEffect, Suspense, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaRegPaperPlane } from "react-icons/fa";
import "./Home.scss";
import { BrandSection, Slideshow, CategorySection } from "components/User";
import Loading from "pages/Loading/loading";
import { mockProducts } from "data/mockData";
import { noibatdata } from "data/noibatdata";

const HomeIndex = () => {
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    brand: [],
    priceRange: 2000000,
  });

  const [products, setProducts] = useState([]);

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

  // Handle price range changes
  const handlePriceRangeChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [0, parseInt(value)],
    }));
  };

  // Apply filters
  const applyFilters = useCallback(() => {
    let result = [...products];

    // Category filter
    if (filters.categories.length) {
      result = result.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    // Brand filter
    if (filters.brands.length) {
      result = result.filter((product) =>
        filters.brands.includes(product.brand)
      );
    }

    // Price range
    result = result.filter((product) => {
      const finalPrice = product.discountPercentage
        ? product.price * (1 - product.discountPercentage / 100)
        : product.price;
      return (
        finalPrice >= filters.priceRange[0] &&
        finalPrice <= filters.priceRange[1]
      );
    });

    // Sorting
    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [filters, products]);

  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  // Handle filter changes

  // Separate data loading for products and featured products
  useEffect(() => {
    // Load regular products - limit to 5 products
    const topProducts = mockProducts.slice(0, 5);
    setProducts(mockProducts); // Keep full list for filtering
    setFilteredProducts(topProducts);
    setDisplayedProducts(topProducts);
    setLoading(false);

    // Load featured products - limit to 5 products
    if (noibatdata && noibatdata.length > 0) {
      setFeaturedProducts(noibatdata.slice(0, 5));
    } else {
      const featured = mockProducts
        .filter((product) => product.isBestSeller || product.isNew)
        .slice(0, 5);
      setFeaturedProducts(featured);
    }
    setLoading(false);
  }, []);

  const renderProductCard = (product) => (
    <div className="product-card" key={product.id}>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {product.discountPercentage > 0 && (
          <span className="discount-badge">-{product.discountPercentage}%</span>
        )}
        <div className="product-actions">
          <button className="action-btn wishlist">
            <i className="far fa-heart"></i>
          </button>
          <button className="action-btn add-to-cart">
            <i className="fas fa-shopping-cart"></i>
          </button>
        </div>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          {[...Array(5)].map((_, index) => (
            <i
              key={index}
              className={`fas fa-star ${
                index < product.rating ? "filled" : ""
              }`}
            ></i>
          ))}
          <span>({product.reviews} đánh giá)</span>
        </div>
        <div className="product-price">
          {product.discountPercentage > 0 ? (
            <>
              <span className="discounted-price">
                {formatPrice(
                  product.price * (1 - product.discountPercentage / 100)
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
    </div>
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
          <div className="section-header">
            <h2>Sản Phẩm Nổi Bật</h2>
            <Link to="/products" className="view-all">
              Xem tất cả <FaArrowRight />
            </Link>
          </div>
          <div className="products-grid five-products">
            {featuredProducts.map(renderProductCard)}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-content">
            <h2>Khuyến Mãi Đặc Biệt</h2>
            <p>Giảm giá lên đến 50% cho các sản phẩm thể thao cao cấp</p>
            <Link to="/products" className="shop-now-btn">
              Mua Ngay
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2>Sản Phẩm Mới</h2>
          </div>
          <div className="products-grid five-products">
            {displayedProducts.map(renderProductCard)}
          </div>
          <div className="view-all-container">
            <Link to="/products" className="view-all-link">
              Xem tất cả sản phẩm <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <h2>Đăng Ký Nhận Tin</h2>
          <p>Nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt</p>
          <form className="email-form">
            <input
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
              required
            />
            <button type="submit">
              <FaRegPaperPlane /> Đăng Ký
            </button>
          </form>
        </div>
      </section>

      <Suspense fallback={<Loading />}>
        <BrandSection />
      </Suspense>
    </div>
  );
};

export default HomeIndex;
