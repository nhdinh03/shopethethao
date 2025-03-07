import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMapPin,
  FiPhone, FiMail, FiClock, FiCheck, FiArrowUp, FiShield,
  FiTruck, FiCreditCard, FiGift, FiHelpCircle
} from "react-icons/fi";
import { Link } from "react-router-dom";
import "./footer.scss";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Using useCallback for handleScroll to prevent unnecessary re-renders
  const handleScroll = useCallback(() => {
    setShowScrollTop(window.scrollY > 300);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]); // Dependency array includes handleScroll

  // Using useCallback for handleSubscribe
  const handleSubscribe = useCallback((e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  }, [email]); // Dependency array includes email

  // Using useCallback for scrollToTop
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Variants for animations
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  const successMessageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
  };

  const scrollTopButtonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  const footerLinks = [
    { text: "Trang chủ", to: "/" },
    { text: "Sản phẩm", to: "/products" },
    { text: "Về chúng tôi", to: "/about" },
    { text: "Tin tức", to: "/blog" },
    { text: "Liên hệ", to: "/contact" },
    { text: "Chính sách bảo mật", to: "/privacy" },
    { text: "Điều khoản sử dụng", to: "/terms" },
    { text: "Chính sách đổi trả", to: "/returns" },
  ];

  return (
    <footer className="footer">
      {/* Services Section */}
      <motion.div
        className="footer-services"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container">
          <div className="services-grid">
            <ServiceCard
              icon={<FiTruck />}
              title="Miễn phí vận chuyển"
              description="Đơn hàng từ 500K"
            />
            <ServiceCard
              icon={<FiShield />}
              title="Bảo hành 365 ngày"
              description="1 đổi 1 trong 7 ngày"
            />
            <ServiceCard
              icon={<FiCreditCard />}
              title="Thanh toán an toàn"
              description="Nhiều phương thức"
            />
            <ServiceCard
              icon={<FiHelpCircle />}
              title="Hỗ trợ 24/7"
              description="Tư vấn nhiệt tình"
            />
          </div>
        </div>
      </motion.div>

      {/* Main Footer Content */}
      <motion.div 
        className="footer-main"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container">
          <div className="footer-grid">
            {/* About Us */}
            <motion.div variants={sectionVariants}>
              <h4>Về chúng tôi</h4>
              <p>
                Nhdinh Shope - Nhà sưu tầm và phân phối chính hãng các thương hiệu thời trang 
                quốc tế hàng đầu Việt Nam. Chúng tôi cam kết mang đến những sản phẩm chất lượng nhất.
              </p>
              <div className="social-links">
                <SocialLink Icon={FiFacebook} href="https://facebook.com/" />
                <SocialLink Icon={FiInstagram} href="https://instagram.com/" />
                <SocialLink Icon={FiTwitter} href="https://twitter.com/" />
                <SocialLink Icon={FiYoutube} href="https://youtube.com/" />
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={sectionVariants}>
              <h4>Liên kết nhanh</h4>
              <ul className="footer-links">
                {footerLinks.slice(0, 5).map((link, index) => (
                  <motion.li 
                    key={index}
                    custom={index}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <FooterLink text={link.text} to={link.to} />
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Policy Links */}
            <motion.div variants={sectionVariants}>
              <h4>Chính sách</h4>
              <ul className="footer-links">
                {footerLinks.slice(5).map((link, index) => (
                  <motion.li 
                    key={index}
                    custom={index}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <FooterLink text={link.text} to={link.to} />
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={sectionVariants}>
              <h4>Liên hệ</h4>
              <ul className="contact-info">
                <ContactInfo Icon={FiMapPin} text="123 Đường Nguyễn Văn Linh, Quận 7, TP. HCM" />
                <ContactInfo Icon={FiPhone} text="(+84) 123 456 789" />
                <ContactInfo Icon={FiMail} text="info@nhdinh-shop.com" />
                <ContactInfo Icon={FiClock} text="Thứ 2 - Chủ nhật: 9:00 - 21:00" />
              </ul>
            </motion.div>

            {/* Newsletter */}
            <motion.div className="footer-newsletter" variants={sectionVariants}>
              <h4>Đăng ký nhận tin</h4>
              <p>Đăng ký để nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt</p>
              <form onSubmit={handleSubscribe}>
                <div className="newsletter-input">
                  <AnimatePresence>
                    {isSubscribed && (
                      <motion.div
                        className="success-message"
                        variants={successMessageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <FiCheck /> Đăng ký thành công!
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Đăng ký</button>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="container">
          <div className="copyright">
            <p>© {new Date().getFullYear()} Nhdinh Shope. Tất cả quyền được bảo lưu.</p>
            <div className="footer-extra-links">
              <a href="/sitemap">Sơ đồ trang</a>
              <a href="/faq">Câu hỏi thường gặp</a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="scroll-top"
            onClick={scrollToTop}
            variants={scrollTopButtonVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            aria-label="Scroll to top"
          >
            <FiArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

// Helper Components
const ServiceCard = React.memo(({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="service-card"
  >
    <div className="icon">{icon}</div>
    <div className="content">
      <h5>{title}</h5>
      <p>{description}</p>
    </div>
  </motion.div>
));

const SocialLink = React.memo(({ Icon, href }) => (
  <motion.a
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="social-link"
  >
    <Icon />
  </motion.a>
));

const FooterLink = React.memo(({ text, to }) => (
  <Link to={to}>
    {text}
  </Link>
));

const ContactInfo = React.memo(({ Icon, text }) => (
  <li>
    <Icon />
    <span>{text}</span>
  </li>
));

export default Footer;