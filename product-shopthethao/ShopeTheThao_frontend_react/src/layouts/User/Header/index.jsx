import React, { useState, useEffect } from 'react';

import './header.scss';

const Header = () => {

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="top-bar">
        <p className="brand-desc">
          Nhdinh shope - Nhà sưu tầm và phân phối chính hãng các thương hiệu thời trang quốc tế hàng đầu Việt Nam
        </p>
        <div className="auth-buttons">
          <button className="btn-login">Đăng nhập</button>
          <button className="btn-register">Đăng ký</button>
        </div>
      </div>
      
    
    </header>
  );
};

export default Header;
