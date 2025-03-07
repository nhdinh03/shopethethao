import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiShoppingBag, 
  FiHeart, 
  FiUser, 
  FiMenu, 
  FiX,
  FiChevronDown,
  FiPhone,
  FiMail
} from 'react-icons/fi';
import './header.scss';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount] = useState(3); // Sample cart count
  const [wishlistCount] = useState(5); // Sample wishlist count
  const navigate = useNavigate();

  // Categories for dropdown
  const categories = [
    { name: 'Áo thun', path: '/category/ao-thun' },
    { name: 'Áo khoác', path: '/category/ao-khoac' },
    { name: 'Quần jeans', path: '/category/quan-jeans' },
    { name: 'Quần shorts', path: '/category/quan-shorts' },
    { name: 'Giày dép', path: '/category/giay-dep' },
    { name: 'Phụ kiện', path: '/category/phu-kien' },
  ];

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenuOpen && mobileMenu && !mobileMenu.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="contact-info">
          <span><FiPhone /> <a href="tel:+84123456789">+84 123 456 789</a></span>
          <span><FiMail /> <a href="mailto:info@nhdinh-shop.com">info@nhdinh-shop.com</a></span>
        </div>
        
        <p className="brand-desc">
          Nhdinh shope - Nhà sưu tầm và phân phối chính hãng các thương hiệu thời trang quốc tế hàng đầu Việt Nam
        </p>
        
        <div className="auth-buttons">
          <Link to="/login" className="btn-login">Đăng nhập</Link>
          <Link to="/register" className="btn-register">Đăng ký</Link>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="main-nav">
        <div className="container">
          <div className="nav-wrapper">
            {/* Logo */}
            <Link to="/" className="logo">
              <h1>Nhdinh<span>Shop</span></h1>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="desktop-nav">
              <ul>
                <li><Link to="/">Trang chủ</Link></li>
                <li className="dropdown">
                  <Link to="/products" className="dropdown-toggle">
                    Sản phẩm <FiChevronDown />
                  </Link>
                  <div className="dropdown-menu">
                    <ul>
                      {categories.map((category, index) => (
                        <li key={index}><Link to={category.path}>{category.name}</Link></li>
                      ))}
                      <li className="view-all"><Link to="/products">Xem tất cả sản phẩm</Link></li>
                    </ul>
                  </div>
                </li>
                <li><Link to="/new-arrivals">Hàng mới về</Link></li>
                <li><Link to="/sale">Khuyến mãi</Link></li>
                <li><Link to="/about">Về chúng tôi</Link></li>
                <li><Link to="/contact">Liên hệ</Link></li>
              </ul>
            </nav>
            
            {/* User Actions */}
            <div className="user-actions">
              <button 
                className="action-icon search-icon" 
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                {searchOpen ? <FiX /> : <FiSearch />}
              </button>
              
              <Link to="/wishlist" className="action-icon">
                <FiHeart />
                {wishlistCount > 0 && <span className="count-badge">{wishlistCount}</span>}
              </Link>
              
              <Link to="/cart" className="action-icon">
                <FiShoppingBag />
                {cartCount > 0 && <span className="count-badge">{cartCount}</span>}
              </Link>
              
              <Link to="/account" className="action-icon user-icon">
                <FiUser />
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" aria-label="Search">
                  <FiSearch />
                </button>
              </form>
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
                <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Trang chủ</Link></li>
                <li>
                  <input type="checkbox" id="products-submenu" className="submenu-toggle" />
                  <label htmlFor="products-submenu" className="submenu-label">
                    Sản phẩm <FiChevronDown />
                  </label>
                  <ul className="submenu">
                    {categories.map((category, index) => (
                      <li key={index}>
                        <Link 
                          to={category.path} 
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link 
                        to="/products" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="view-all"
                      >
                        Xem tất cả sản phẩm
                      </Link>
                    </li>
                  </ul>
                </li>
                <li><Link to="/new-arrivals" onClick={() => setMobileMenuOpen(false)}>Hàng mới về</Link></li>
                <li><Link to="/sale" onClick={() => setMobileMenuOpen(false)}>Khuyến mãi</Link></li>
                <li><Link to="/about" onClick={() => setMobileMenuOpen(false)}>Về chúng tôi</Link></li>
                <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Liên hệ</Link></li>
              </ul>
            </nav>
            
            <div className="mobile-menu-footer">
              <Link to="/login" className="mobile-btn" onClick={() => setMobileMenuOpen(false)}>
                <FiUser /> Đăng nhập / Đăng ký
              </Link>
              <div className="social-links">
                <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a>
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer">TikTok</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
