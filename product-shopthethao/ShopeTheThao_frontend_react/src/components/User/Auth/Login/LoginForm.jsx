import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, message, Divider } from "antd";
import { FiLock, FiEye, FiEyeOff, FiUser, FiMail, FiArrowRight } from "react-icons/fi";
import { FaFacebookF, FaGoogle, FaTwitter, FaGithub } from "react-icons/fa";
import "./loginForm.scss";
import img from "assets/Img";
import { useAuth } from "hooks/useAuth";
import { getRedirectPath, getLoginMessage } from "utils/roleManager";
import { validateId, validatePassword } from "../Custom";

// Fix import paths to directly import from the FormFields file
import { InputField, CustomCheckbox, SocialButton } from "../Common/FormFields";
import ForgotPasswordForm from "../ForgotPassword/ForgotPasswordForm";
import RegisterForm from "../Register/RegisterForm";
import Loading from "pages/Loading/loading";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    id: "",
    password: "",
  });
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "login" // Get initial tab from location state
  );
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    remember: false,
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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
      const errorMessage =
        err.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!";

      if (errorMessage.startsWith("Tài khoản chưa được xác thực:")) {
        message.info(errorMessage.split(":")[1]);
        navigate("/v1/auth/otp", { state: { id: formData.id.trim() } });
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  const handleSocialLogin = (provider) => {
    message.info(`Đăng nhập bằng ${provider} đang được phát triển!`);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("token"); // or however you store your auth token
    if (token || isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Add this useEffect to handle tab changes from route state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear the state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Update handleTabChange to be more explicit about tab switching
  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === "register") {
      // Reset any login form data when switching to register
      setFormData({
        id: "",
        password: "",
        remember: false,
      });
      setErrors({
        id: "",
        password: "",
      });
    }
  };

  // Add this function to get the proper tab label
  const getLoginTabLabel = () => {
    return showForgotPassword ? "QUÊN MẬT KHẨU" : "ĐĂNG NHẬP"   ;
  };

  const renderFormFooter = () => (
    <div className="form-footer">
      <p>{activeTab === "login" ? "Không có tài khoản?" : "Đã có tài khoản?"}</p>
      <Link
        to="#"
        className="switch-auth-mode"
        onClick={(e) => {
          e.preventDefault();
          handleTabChange(activeTab === "login" ? "register" : "login");
        }}
      >
        {activeTab === "login" ? "Đăng ký ngay" : "Đăng nhập ngay"}
        <FiArrowRight className="arrow-icon" />
      </Link>
    </div>
  );

  // Dynamically generate the tabs based on whether we're showing the forgot password form
  const generateTabItems = () => {
    // Only show the login tab when forgot password is active
    if (showForgotPassword) {
      return [
        {
          key: "login",
          label: getLoginTabLabel(),
          children: (
            <AnimatePresence mode="wait">
              <ForgotPasswordForm
                forgotPasswordEmail={forgotPasswordEmail}
                setForgotPasswordEmail={setForgotPasswordEmail}
                handleForgotPassword={handleForgotPassword}
                onCancel={() => setShowForgotPassword(false)}
              />
            </AnimatePresence>
          ),
        }
      ];
    }

    // Otherwise show both tabs
    return [
      {
        key: "login",
        label: getLoginTabLabel(),
        children: (
          <AnimatePresence mode="wait">
            <motion.div
              key="login-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="login-form">
                <InputField
                  icon={<FiUser />}
                  type="text"
                  name="id"
                  placeholder=" Tài khoản đăng nhập hoặc Email, số điện thoại"
                  value={formData.id}
                  onChange={handleChange}
                  error={errors.id}
                />
                <InputField
                  icon={<FiLock />}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mật khẩu"
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
                <div className="form-options">
                  <CustomCheckbox
                    checked={formData.remember}
                    onChange={(e) => handleChange(e)}
                    name="remember"
                    label="Ghi nhớ đăng nhập"
                  />
                  <Link
                    to="#"
                    className="forgot-link"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <motion.button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
                </motion.button>
                <div className="social-login">
                  <Divider className="social-divider">
                    <span>Hoặc đăng nhập với</span>
                  </Divider>
                  <div className="social-buttons-grid">
                    <SocialButton
                      icon={<FaFacebookF />}
                      label="Facebook"
                      color="#1877F2"
                      onClick={() => handleSocialLogin("Facebook")}
                    />
                    <SocialButton
                      icon={<FaGoogle />}
                      label="Google"
                      color="#EA4335"
                      onClick={() => handleSocialLogin("Google")}
                    />
                    <SocialButton
                      icon={<FaTwitter />}
                      label="Twitter"
                      color="#1DA1F2"
                      onClick={() => handleSocialLogin("Twitter")}
                    />
                    <SocialButton
                      icon={<FaGithub />}
                      label="Github"
                      color="#333333"
                      onClick={() => handleSocialLogin("Github")}
                    />
                  </div>
                </div>
                {renderFormFooter()}
              </form>
            </motion.div>
          </AnimatePresence>
        ),
      },
      {
        key: "register",
        label: "ĐĂNG KÝ",
        children: (
          <motion.div
            key="register-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <RegisterForm
              onLoginClick={() => handleTabChange("login")}
            />
          </motion.div>
        ),
      },
    ];
  };

  return (
    <div className="login-wrapper">
      {/* Left Side with Welcome Content */}
      <motion.div
        className="login-left"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="welcome-content">
          <h1>Chào mừng bạn đến với Shop Thể Thao</h1>
          <p>Nơi mang đến cho bạn những sản phẩm thể thao chất lượng nhất</p>
          <div className="features">
            <div className="feature-item">
              <FiUser />
              <span>Tài khoản khách hàng được bảo mật tuyệt đối</span>
            </div>
            <div className="feature-item">
              <FaGoogle />
              <span>Đăng nhập dễ dàng với tài khoản mạng xã hội</span>
            </div>
            <div className="feature-item">
              <FiMail />
              <span>Nhận thông báo về sản phẩm mới và ưu đãi hấp dẫn</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side with Form */}
      <motion.div
        className="login-right"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="form-container"
          transition={{ type: "spring", stiffness: 200 }}
        >
          {/* Form Header with Logo */}
          <motion.div className="form-header">
            <motion.img src={img.Co_VN} alt="Logo" className="brand-logo" />
          </motion.div>

          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            centered
            className={`auth-tabs ${showForgotPassword ? 'forgot-password-mode' : ''}`}
            items={generateTabItems()}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginForm;