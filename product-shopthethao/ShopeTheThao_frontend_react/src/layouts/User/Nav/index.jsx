import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import "./Nav.scss";

const categories = [
  {
    title: "Quần áo thể thao",
    subcategories: ["Áo thể thao", "Quần thể thao", "Bộ đồ thể thao"]
  },
  {
    title: "Giày thể thao",
    subcategories: ["Giày chạy bộ", "Giày đá bóng", "Giày tennis"]
  },
  {
    title: "Phụ kiện",
    subcategories: ["Băng bảo vệ", "Balo thể thao", "Tất thể thao"]
  }
];

const Nav = () => {
  return (
    <nav className="header-nav">
      <div className="container">
        <ul className="nav-list">
          <NavItem to="/" label="Trang chủ" />
          <NavItem 
            to="/products" 
            label="Sản phẩm" 
            hasSubmenu 
            categories={categories}
          />
          <NavItem to="/new-arrivals" label="Hàng mới về" isNew />
          <NavItem to="/sale" label="Khuyến mãi" />
          <NavItem to="/blog" label="Tin tức" />
          <NavItem to="/contact" label="Liên hệ" />
        </ul>
      </div>
    </nav>
  );
};

const NavItem = ({ to, label, hasSubmenu, isNew, categories }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.li
    className="nav-item"
    onMouseEnter={() => setIsOpen(true)}
    onMouseLeave={() => setIsOpen(false)}
  >
    <Link to={to} className="nav-link">
      {label}
      {hasSubmenu && <FiChevronDown className="submenu-icon" />}
      {isNew && <span className="new-badge">Mới</span>}
    </Link>
  
    {hasSubmenu && (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="submenu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {categories.map((category, index) => (
              <div key={index} className="submenu-category">
                <h4>{category.title}</h4>
                <ul>
                  {category.subcategories.map((sub, subIndex) => (
                    <motion.li
                      key={subIndex}
                      whileHover={{ x: 5 }}
                    >
                      <Link to={`/products/${sub.toLowerCase().replace(/ /g, '-')}`}>
                        {sub}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    )}
  </motion.li>
  
  );
};

export default Nav;