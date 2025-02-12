import React, { useState } from "react";
import { ShoppingCart, User, Search, Menu as MenuIcon, ChevronDown } from "lucide-react";
import './header.scss';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  const handleScroll = () => {
    setScrolling(window.scrollY > 80);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSubMenu = () => setIsSubMenuOpen(!isSubMenuOpen);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`header ${scrolling ? 'header-sticky' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <span className="logo-text">SPORT SHOP</span>
        </div>

        {/* Main Navigation */}
        <nav className="nav-desktop">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">Marketplace</a>
          <div className="dropdown">
            <button onClick={toggleSubMenu} className="dropdown-btn">
              Company <ChevronDown size={16} />
            </button>
            {isSubMenuOpen && (
              <ul className="dropdown-menu">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            )}
          </div>
          <a href="#">Team</a>
          <a href="#">Contact</a>
        </nav>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={20} className="search-icon" />
        </div>

        {/* Cart and User */}
        <div className="header-actions">
          <div className="cart">
            <ShoppingCart size={24} />
            <span className="cart-badge">3</span>
          </div>
          <User size={24} />
          <button className="login-btn">Login</button>
          <button className="signup-btn">Sign Up</button>
        </div>

        {/* Mobile Menu */}
        <div className="menu-mobile">
          <MenuIcon size={24} onClick={toggleMenu} />
          {isMenuOpen && (
            <div className="mobile-menu">
              <a href="#">Home</a>
              <a href="#">Features</a>
              <a href="#">Marketplace</a>
              <a href="#">Team</a>
              <a href="#">Contact</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
