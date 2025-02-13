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