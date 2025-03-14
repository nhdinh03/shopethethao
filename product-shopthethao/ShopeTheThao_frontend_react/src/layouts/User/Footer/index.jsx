import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import "./footer.scss";

const Footer = () => {
  const footerLinks = {
    products: [
      { name: "Giày", path: "/products/shoes" },
      { name: "Quần áo", path: "/products/clothing" },
      { name: "Phụ kiện", path: "/products/accessories" },
      { name: "Hàng Mới Về", path: "/products/new-arrivals" },
      { name: "Release Dates", path: "/release-dates" },
      { name: "Top Sellers", path: "/top-sellers" },
      { name: "Member exclusives", path: "/member-exclusives" },
      { name: "Outlet", path: "/outlet" },
    ],
    sports: [
      { name: "Chạy", path: "/sports/running" },
      { name: "Đánh gôn", path: "/sports/golf" },
      { name: "Gym & Training", path: "/sports/gym" },
      { name: "Bóng đá", path: "/sports/football" },
      { name: "Bóng Rổ", path: "/sports/basketball" },
      { name: "Quần vợt", path: "/sports/tennis" },
      { name: "Ngoai troi", path: "/sports/outdoor" },
      { name: "Bơi lội", path: "/sports/swimming" },
      { name: "Motorsport", path: "/sports/motorsport" },
    ],
    collections: [
      { name: "Pharrell Williams", path: "/collections/pharrell" },
      { name: "Ultra Boost", path: "/collections/ultra-boost" },
      { name: "Pureboost", path: "/collections/pureboost" },
      { name: "Predator", path: "/collections/predator" },
      { name: "Superstar", path: "/collections/superstar" },
      { name: "Stan Smith", path: "/collections/stan-smith" },
      { name: "NMD", path: "/collections/nmd" },
      { name: "Adicolor", path: "/collections/adicolor" },
    ],
    company: [
      { name: "Giới Thiệu Về Chúng Tôi", path: "/about-us" },
      { name: "Cơ Hội Nghề Nghiệp", path: "/careers" },
      { name: "Tin tức", path: "/news" },
      { name: "adidas stories", path: "/stories" },
    ],
    support: [
      { name: "Trợ Giúp", path: "/help" },
      { name: "Công cụ tìm kiếm cửa hàng", path: "/store-finder" },
      { name: "Biểu Đồ Kích Cỡ", path: "/size-chart" },
      { name: "Thanh toán", path: "/payment" },
      { name: "Giao hàng", path: "/shipping" },
      { name: "Trả Hàng & Hoàn Tiền", path: "/returns" },
      { name: "khuyến mãi", path: "/promotions" },
      { name: "Sơ đồ trang web", path: "/sitemap" },
      { name: "Trợ Giúp Dịch Vụ Khách Hàng", path: "/customer-service" },
    ],
  };

  return (
    <footer className="footer">
      <div className="membership-banner">
        <h2>
          TRỞ THÀNH HỘI VIÊN & HƯỞNG ƯU ĐÃI 15%{" "}
          <Link
            to="/v1/auth/login"
            className="register-btn"
            state={{ activeTab: "register" }} // Add state to set active tab
          >
            ĐĂNG KÝ MIỄN PHÍ
          </Link>
        </h2>
      </div>

      <div className="footer-content">
        <div className="footer-section">
          <h3>SẢN PHẨM</h3>
          <ul>
            {footerLinks.products.map((link, index) => (
              <li key={index}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h3>THỂ THAO</h3>
          <ul>
            {footerLinks.sports.map((link, index) => (
              <li key={index}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h3>BỘ SƯU TẬP</h3>
          <ul>
            {footerLinks.collections.map((link, index) => (
              <li key={index}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h3>THÔNG TIN VỀ CÔNG TY</h3>
          <ul>
            {footerLinks.company.map((link, index) => (
              <li key={index}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h3>HỖ TRỢ</h3>
          <ul>
            {footerLinks.support.map((link, index) => (
              <li key={index}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="social-links">
          <h3>THEO DÕI CHÚNG TÔI</h3>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
