import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from 'react-icons/fi';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './login.scss';
import img from "assets/Img";
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="login-wrapper">
      {/* Left Side with Parallax Effect */}
      <motion.div 
        className="login-left"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="welcome-content">
          <h1>Chào mừng bạn đến với Shop Nhdinh</h1>
          <p>Nơi mang đến cho bạn những sản phẩm thể thao chất lượng nhất</p>
          <div className="features">
            <div className="feature-item">
              <FiUser />
              <span>Tài khoản khách hàng được bảo mật tuyệt đối</span>
            </div>
            {/* Add more feature items */}
          </div>
        </div>
      </motion.div>

      {/* Right Side with Form */}
      <motion.div 
        className="login-right"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="form-container"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Form Header with Hover Effect */}
          <motion.div className="form-header">
            <motion.img 
            src={img.Co_VN}
              alt="Logo" 
              className="brand-logo"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            />
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Đăng nhập
            </motion.h2>
          </motion.div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Enhanced Input Fields */}
            <InputField
              icon={<FiMail />}
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleChange}
            />

            <InputField
              icon={<FiLock />}
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Nhập mật khẩu của bạn"
              value={formData.password}
              onChange={handleChange}
              endIcon={
                <motion.button
                  type="button"
                  className="visibility-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </motion.button>
              }
            />

            {/* Enhanced Checkbox */}
            <motion.div 
              className="form-options"
              whileHover={{ scale: 1.02 }}
            >
              <CustomCheckbox
                checked={formData.remember}
                onChange={(e) => handleChange(e)}
                name="remember"
                label="Ghi nhớ đăng nhập"
              />
            </motion.div>

            {/* Enhanced Submit Button */}
            <motion.button
              type="submit"
              className="submit-button"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    className="loading-spinner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="spinner" />
                    <span>Đang đăng nhập...</span>
                  </motion.div>
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Đăng nhập
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Enhanced Social Login */}
            <div className="social-login">
              <motion.div 
                className="social-buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <SocialButton
                  icon={<FaFacebookF />}
                  label="Facebook"
                  color="#1877F2"
                />
                <SocialButton
                  icon={<FaGoogle />}
                  label="Google"
                  color="#EA4335"
                />
              </motion.div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Helper Components
const InputField = ({ icon, endIcon, ...props }) => (
  <motion.div 
    className="form-group"
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
  >
    <div className="input-field">
      <motion.span 
        className="field-icon"
        initial={{ opacity: 0.5 }}
        whileHover={{ opacity: 1 }}
      >
        {icon}
      </motion.span>
      <input {...props} />
      {endIcon}
    </div>
  </motion.div>
);

const CustomCheckbox = ({ label, ...props }) => (
  <motion.label 
    className="custom-checkbox"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <input type="checkbox" {...props} />
    <motion.span 
      className="checkmark"
      whileHover={{ backgroundColor: "rgba(79, 70, 229, 0.1)" }}
    />
    <span>{label}</span>
  </motion.label>
);

const SocialButton = ({ icon, label, color }) => (
  <motion.button
    type="button"
    className="social-button"
    style={{ "--button-color": color }}
    whileHover={{ 
      scale: 1.05,
      boxShadow: `0 0 20px ${color}33`
    }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.span className="icon">{icon}</motion.span>
    <span className="label">{label}</span>
  </motion.button>
);

export default Login;
