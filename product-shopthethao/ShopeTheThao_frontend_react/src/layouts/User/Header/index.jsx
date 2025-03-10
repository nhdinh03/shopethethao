import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiMenu,
  FiX,
  FiChevronDown,
  FiPhone,
  FiMail,
  FiUser,
  FiShoppingBag,
} from "react-icons/fi";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import "./header.scss";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount] = useState(3); // Sample cart count
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Main navigation categories
  const mainCategories = [
    { id: "giay", name: "GIÀY", path: "/category/giay" },
    { id: "nam", name: "NAM", path: "/category/nam" },
    { id: "nu", name: "NỮ", path: "/category/nu" },
    { id: "tre-em", name: "TRẺ EM", path: "/category/tre-em" },
    { id: "the-thao", name: "THỂ THAO", path: "/category/the-thao" },
    { id: "nhan-hieu", name: "CÁC NHÃN HIỆU", path: "/category/nhan-hieu" },
    { id: "outlet", name: "OUTLET", path: "/category/outlet" },
  ];

  // Detailed category structure for dropdowns
  const categoryDetails = {
    nam: {
      title: "Nam",
      path: "/category/nam",
      groups: [
        {
          title: "Nổi bật",
          items: [
            { name: "Hàng mới về", path: "/category/nam/hang-moi-ve" },
            { name: "Bộ sưu tập mới", path: "/category/nam/bo-suu-tap-moi" },
            { name: "Xu hướng", path: "/category/nam/xu-huong" },
            { name: "Bestsellers", path: "/category/nam/bestsellers" },
            { name: "Giảm giá", path: "/category/nam/giam-gia" },
          ],
        },
        {
          title: "Giày",
          items: [
            { name: "Tất cả giày", path: "/category/nam/giay" },
            { name: "Giày thể thao", path: "/category/nam/giay-the-thao" },
            { name: "Giày chạy bộ", path: "/category/nam/giay-chay-bo" },
            { name: "Giày bóng đá", path: "/category/nam/giay-bong-da" },
            { name: "Giày bóng rổ", path: "/category/nam/giay-bong-ro" },
            { name: "Giày tập luyện", path: "/category/nam/giay-tap-luyen" },
            { name: "Dép & Sandals", path: "/category/nam/dep-sandals" },
          ],
        },
        {
          title: "Quần áo",
          items: [
            { name: "Tất cả quần áo", path: "/category/nam/quan-ao" },
            { name: "Áo thun & Polo", path: "/category/nam/ao-thun-polo" },
            { name: "Áo khoác", path: "/category/nam/ao-khoac" },
            { name: "Áo nỉ & Hoodie", path: "/category/nam/ao-ni-hoodie" },
            {
              name: "Quần dài & Legging",
              path: "/category/nam/quan-dai-legging",
            },
            { name: "Quần shorts", path: "/category/nam/quan-shorts" },
            { name: "Đồ bộ thể thao", path: "/category/nam/do-bo-the-thao" },
          ],
        },
        {
          title: "Phụ kiện",
          items: [
            { name: "Tất cả phụ kiện", path: "/category/nam/phu-kien" },
            { name: "Balo & Túi", path: "/category/nam/balo-tui" },
            { name: "Tất", path: "/category/nam/tat" },
            { name: "Mũ & Nón", path: "/category/nam/mu-non" },
            { name: "Băng bảo vệ", path: "/category/nam/bang-bao-ve" },
            { name: "Găng tay", path: "/category/nam/gang-tay" },
            { name: "Bình nước", path: "/category/nam/binh-nuoc" },
          ],
        },
        {
          title: "Thể thao",
          items: [
            { name: "Bóng đá", path: "/category/nam/the-thao/bong-da" },
            { name: "Chạy bộ", path: "/category/nam/the-thao/chay-bo" },
            { name: "Tập gym", path: "/category/nam/the-thao/tap-gym" },
            { name: "Tennis", path: "/category/nam/the-thao/tennis" },
            { name: "Golf", path: "/category/nam/the-thao/golf" },
            { name: "Bơi lội", path: "/category/nam/the-thao/boi-loi" },
            {
              name: "Thể thao điện tử",
              path: "/category/nam/the-thao/the-thao-dien-tu",
            },
          ],
        },
      ],
      featuredImage: {
        src: "https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/viVN/Images/football-ss22-predator-education-navigation-dropdown-d_tcm337-865864.jpg",
        alt: "Bộ sưu tập Motorsport",
        title: "BỘ SƯU TẬP MOTORSPORT",
        description: "Khám phá trang phục thể thao phong cách đua xe",
        link: "/category/nam/motorsport",
      },
      quickLinks: [
        { name: "Tất cả sản phẩm dành cho Nam", path: "/category/nam" },
        { name: "Tất cả giày Nam", path: "/category/nam/giay" },
        {
          name: "Tất cả phụ kiện dành cho Nam",
          path: "/category/nam/phu-kien",
        },
      ],
    },
    // Similar structures would exist for other categories
  };

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Mock search results
    if (query) {
      setSearchResults([
        { id: 1, name: "Product 1", price: "$20" },
        { id: 2, name: "Product 2", price: "$30" },
      ]);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const mobileMenu = document.getElementById("mobile-menu");
      if (mobileMenuOpen && mobileMenu && !mobileMenu.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Animation variants
  const mobileMenuVariants = {
    closed: { opacity: 0, x: "100%" },
    open: { opacity: 1, x: 0 },
  };

  const searchBarVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="contact-info">
          <span>
            <FiPhone /> <a href="tel:+84123456789">+84 123 456 789</a>
          </span>
          <span>
            <FiMail />{" "}
            <a href="mailto:info@shopethethao.com">info@shopethethao.com</a>
          </span>
        </div>

        <p className="brand-desc">
          ShopTheThao - Chuyên phân phối chính hãng các thương hiệu thể thao
          quốc tế hàng đầu Việt Nam
        </p>

        <div className="auth-buttons">
          {isAuthenticated ? (
            <Link to="/account" className="btn-login">
              Tài khoản
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-login">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn-register">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="main-nav">
        <div className="container">
          <div className="nav-wrapper">
            {/* Logo */}
            <Link to="/" className="logo">
              <h1>
                Shop<span>TheThao</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="desktop-nav">
              <ul>
                {mainCategories.map((category) => (
                  <li
                    key={category.id}
                    className={
                      categoryDetails[category.id] ? "has-mega-menu" : ""
                    }
                    onMouseEnter={() => setActiveCategory(category.id)}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                    <Link 
                      to={category.path} 
                      className={activeCategory === category.id ? "active-menu-item" : ""}
                    >
                      {category.name}
                    </Link>

                    {categoryDetails[category.id] && (
                      <div className="mega-menu-wrapper">
                        <div
                          className={`mega-menu ${
                            activeCategory === category.id ? "active" : ""
                          } ${isScrolled ? "scrolled" : ""}`}
                        >
                          <div className="mega-menu-inner">
                            <div className="mega-menu-categories">
                              {categoryDetails[category.id].groups.map(
                                (group, groupIndex) => (
                                  <div
                                    key={groupIndex}
                                    className="category-column"
                                  >
                                    <h4>{group.title}</h4>
                                    <ul>
                                      {group.items.map((item, itemIndex) => (
                                        <li key={itemIndex}>
                                          <Link to={item.path}>
                                            {item.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )
                              )}

                              <div className="featured-column">
                                <div className="featured-image">
                                  <img
                                    src={
                                      categoryDetails[category.id].featuredImage
                                        .src
                                    }
                                    alt={
                                      categoryDetails[category.id].featuredImage
                                        .alt
                                    }
                                  />
                                  <div className="featured-content">
                                    <h3>
                                      {
                                        categoryDetails[category.id]
                                          .featuredImage.title
                                      }
                                    </h3>
                                    <p>
                                      {
                                        categoryDetails[category.id]
                                          .featuredImage.description
                                      }
                                    </p>
                                    <Link
                                      to={
                                        categoryDetails[category.id]
                                          .featuredImage.link
                                      }
                                      className="btn-featured"
                                    >
                                      Khám phá ngay
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="quick-links">
                              {categoryDetails[category.id].quickLinks.map(
                                (link, linkIndex) => (
                                  <Link
                                    key={linkIndex}
                                    to={link.path}
                                    className="quick-link"
                                  >
                                    {link.name}
                                  </Link>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            {/* User Actions */}
            <div className="user-actions">
              <button
                className="action-icon search-icon"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <FiSearch />
              </button>

              <Link to="/account" className="action-icon">
                <FiUser />
              </Link>

              <Link to="/cart" className="action-icon cart-icon">
                <FiShoppingBag />
                {cartCount > 0 && (
                  <span className="count-badge">{cartCount}</span>
                )}
              </Link>

              <button
                className="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                <FiMenu />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="search-bar"
            variants={searchBarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.3 }}
          >
            <div className="container">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  autoFocus
                />
                <button type="submit" aria-label="Search">
                  <FiSearch />
                </button>
              </form>
              {searchQuery && searchResults.length > 0 && (
                <div className="search-suggestions">
                  <div className="suggestion-header">
                    <h4>Sản phẩm gợi ý</h4>
                    <button onClick={clearSearch}>Xóa</button>
                  </div>
                  <div className="suggested-products">
                    {searchResults.map((product) => (
                      <Link
                        to={`/product/${product.id}`}
                        key={product.id}
                        className="product-item"
                      >
                        <div className="product-info">
                          <h5>{product.name}</h5>
                          <span className="price">{product.price}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
          >
            <div className="mobile-menu-header">
              <button
                className="close-menu"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <FiX />
              </button>
            </div>

            <nav>
              <ul>
                {mainCategories.map((category) => (
                  <li key={category.id}>
                    {categoryDetails[category.id] ? (
                      <>
                        <input
                          type="checkbox"
                          id={`mobile-${category.id}`}
                          className="submenu-toggle"
                        />
                        <label
                          htmlFor={`mobile-${category.id}`}
                          className="submenu-label"
                        >
                          {category.name} <FiChevronDown />
                        </label>
                        <div className="submenu">
                          {categoryDetails[category.id].groups.map(
                            (group, groupIndex) => (
                              <div key={groupIndex} className="submenu-group">
                                <input
                                  type="checkbox"
                                  id={`mobile-${category.id}-group-${groupIndex}`}
                                  className="group-toggle"
                                />
                                <label
                                  htmlFor={`mobile-${category.id}-group-${groupIndex}`}
                                  className="group-label"
                                >
                                  {group.title} <FiChevronDown />
                                </label>
                                <ul className="group-items">
                                  {group.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>
                                      <Link
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                      >
                                        {item.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )
                          )}
                          {/* Quick links for mobile */}
                          <div className="mobile-quick-links">
                            {categoryDetails[category.id].quickLinks.map(
                              (link, linkIndex) => (
                                <Link
                                  key={linkIndex}
                                  to={link.path}
                                  className="mobile-quick-link"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {link.name}
                                </Link>
                              )
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        to={category.path}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mobile-menu-footer">
              {isAuthenticated ? (
                <Link
                  to="/account"
                  className="mobile-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiUser /> Tài khoản
                </Link>
              ) : (
                <div className="mobile-auth-buttons">
                  <Link
                    to="/login"
                    className="mobile-btn"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="mobile-btn accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
              <div className="social-links">
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
                <a
                  href="https://tiktok.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TikTok
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
