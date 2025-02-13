import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated } from 'react-spring';
import {
  FiShoppingCart, FiUser, FiSearch, FiMenu, FiHeart,
  FiChevronDown, FiPhone, FiMail, FiTruck, FiGift
} from "react-icons/fi";
import { Link } from "react-router-dom";
import "./header.scss";
import Nav from "../Nav";


const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const springProps = useSpring({
    transform: isScrolled ? 'translateY(-42px)' : 'translateY(0)',
    config: { tension: 280, friction: 20 }
  });

  return (
    <animated.header style={springProps} className="header">
      {/* Enhanced Announcement Bar */}
      <div className="announcement-bar">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="announcement-content"
          >
            <div className="announcement-item">
              <FiTruck className="icon" />
              <span>Miễn phí vận chuyển đơn hàng trên 500K</span>
            </div>
            <div className="announcement-item">
              <FiGift className="icon" />
              <span>Ưu đãi 20% cho thành viên mới</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Header Top */}
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="contact-info">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                href="tel:19001234"
                className="contact-item"
              >
                <FiPhone className="icon" />
                <span>1900 1234</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="mailto:nhdinhpc03@gmail.com"
                className="contact-item"
              >
                <FiMail className="icon" />
                <span>nhdinhpc03@gmail.com</span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Header */}
      <div className="header-main">
        <div className="container">
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/">
              <h1 className="logo-text">SPORT SHOP</h1>
            </Link>
          </motion.div>

          <div className="search-bar-wrapper">
            <motion.div 
              className="search-bar"
            >
              <input 
                type="text" 
                placeholder="Tìm kiếm sản phẩm..."
                className="search-input" 
              />
              <motion.button
                className="search-button"
              >
                <FiSearch />
              </motion.button>
            </motion.div>
          </div>

          <div className="header-actions">
            <HeaderAction icon={<FiHeart />} label="Yêu thích" badge={2} />
            <HeaderAction icon={<FiShoppingCart />} label="Giỏ hàng" badge={3} />
            <HeaderAction icon={<FiUser />} label="Tài khoản" />
          </div>
        </div>
      </div>

      <Nav />
    </animated.header>
  );
};

// Helper Components
const HeaderAction = ({ icon, label, badge }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="action-item"
  >
    {icon}
    {badge && (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="badge"
      >
        {badge}
      </motion.span>
    )}
    <span className="label">{label}</span>
  </motion.div>
);

export default Header;