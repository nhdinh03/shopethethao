import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./loginForm.scss";
import img from "assets/Img";
import { useAuth } from "hooks/useAuth";
import { message } from "antd";
import { getRedirectPath, getLoginMessage } from "utils/roleManager";
import { validateId, validatePassword } from "../Custom";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    id: "",
    password: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { id: "", password: "" };

    // Validate ID
    validateId(null, formData.id, (error) => {
      if (error) {
        newErrors.id = error;
        isValid = false;
      }
    });

    // Validate Password
    validatePassword(null, formData.password, (error) => {
      if (error) {
        newErrors.password = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      message.error("Vui lòng kiểm tra lại thông tin đăng nhập!");
      return;
    }

    try {
      const response = await login({
        id: formData.id.trim(),
        password: formData.password,
      });

      const redirectPath = getRedirectPath(response.roles);
      const loginMessage = getLoginMessage(response.roles);

      navigate(redirectPath);
      message.success(loginMessage);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!";
      
      if (errorMessage.startsWith('Tài khoản chưa được xác thực:')) {
        message.info(errorMessage.split(':')[1]);
        navigate('/otp', { state: { id: formData.id.trim() } });
        return;
      }
      
      message.error(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value.trim(),
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token'); // or however you store your auth token
    if (token || isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    id: "",
    password: "",
    remember: false,
  });

  return (
    <div className="login-wrapper">
      {/* Right Side with Welcome Content */}
      <motion.div
        className="login-left"
        initial={{ opacity: 0, x: 100 }} // Changed from -100 to 100
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

      {/* Left Side with Form */}
      <motion.div
        className="login-right"
        initial={{ opacity: 0, x: -100 }} // Changed from 100 to -100
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="form-container"
          whileHover={{ scale: 1.005 }} // Reduced from 1.01
          transition={{ type: "spring", stiffness: 200 }} // Reduced stiffness
        >
          {/* Form Header with Hover Effect */}
          <motion.div className="form-header">
            <motion.img
              src={img.Co_VN}
              alt="Logo"
              className="brand-logo"
              whileHover={{ scale: 1.05 }} // Reduced from 1.1
              whileTap={{ scale: 0.98 }} // Increased from 0.95
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
              icon={<FiUser />}
              type="text"
              name="id"
              placeholder="Nhập ID hoặc số điện thoại"
              value={formData.id}
              onChange={handleChange}
              error={errors.id}
            />

            <InputField
              icon={<FiLock />}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Nhập mật khẩu của bạn"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              endIcon={
                <button
                  type="button"
                  className="visibility-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              }
            />

            {/* Enhanced Checkbox */}
            <motion.div className="form-options" whileHover={{ scale: 1.02 }}>
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
              whileHover={{ scale: 1.01 }} // Reduced from 1.02
              whileTap={{ scale: 0.99 }} // Increased from 0.98
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

// Optimized helper components
const InputField = ({ icon, endIcon, error, ...props }) => (
  <motion.div
    className="form-group"
    whileHover={{ scale: 1.01 }} // Reduced from 1.02
    whileTap={{ scale: 0.99 }} // Increased from 0.98
    transition={{ duration: 0.1 }} // Reduced from 0.2
  >
    <div className={`input-field ${error ? "error" : ""}`}>
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
    {error && (
      <motion.div
        className="error-message"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {error}
      </motion.div>
    )}
  </motion.div>
);

const CustomCheckbox = ({ label, ...props }) => (
  <label className="custom-checkbox">
    <input type="checkbox" {...props} />
    <span className="checkmark" />
    <span>{label}</span>
  </label>
);

const SocialButton = ({ icon, label, color }) => (
  <motion.button
    type="button"
    className={`social-button ${label.toLowerCase()}`}
    style={{ "--button-color": color }}
    whileHover={{
      scale: 1.02, // Reduced from 1.03
      boxShadow: `0 2px 8px ${color}33`, // Reduced shadow
    }}
    whileTap={{ scale: 0.99 }} // Added gentle tap effect
    transition={{ type: "spring", stiffness: 300, damping: 15 }} // Optimized spring
  >
    <motion.span className="icon">{icon}</motion.span>
    <span className="label">{label}</span>
  </motion.button>
);

export default LoginForm;
