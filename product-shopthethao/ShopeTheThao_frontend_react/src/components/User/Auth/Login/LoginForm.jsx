import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiMail,
  FiArrowRight,
  FiPhone,
  FiInfo,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaGoogle,
  FaTwitter,
  FaGithub,
  FaMars,
  FaVenus,
  FaUserAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, message, Divider, Radio } from "antd";
import "./loginForm.scss";
import img from "assets/Img";
import { useAuth } from "hooks/useAuth";
import { getRedirectPath, getLoginMessage } from "utils/roleManager";
import { validateId, validatePassword } from "../Custom";
import authApi from "api/Admin/Auth/auth";

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
        navigate("/otp", { state: { id: formData.id.trim() } });
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
    if (!forgotPasswordEmail.trim()) {
      message.error("Vui lòng nhập email của bạn!");
      return;
    }

    try {
      // const response = await authApi.forgotPassword({ email: forgotPasswordEmail });
      message.success("Link đặt lại mật khẩu đã được gửi đến email của bạn!");
      setShowForgotPassword(false);
    } catch (error) {
      message.error(
        "Không thể gửi email đặt lại mật khẩu: " +
        (error.response?.data?.message || "Có lỗi xảy ra")
      );
    }
  };

  const handleSocialLogin = (provider) => {
    message.info(`Đăng nhập bằng ${provider} đang được phát triển!`);
    // Here you would implement OAuth login for the provider
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
            className="auth-tabs"
            items={[
              {
                key: "login",
                label: "ĐĂNG NHẬP",
                children: (
                  <AnimatePresence mode="wait">
                    {showForgotPassword ? (
                      <ForgotPasswordForm
                        forgotPasswordEmail={forgotPasswordEmail}
                        setForgotPasswordEmail={setForgotPasswordEmail}
                        handleForgotPassword={handleForgotPassword}
                        onCancel={() => setShowForgotPassword(false)}
                      />
                    ) : (
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
                            placeholder="Email hoặc ID đăng nhập"
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
                    )}
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
                    <EnhancedRegisterForm
                      onLoginClick={() => handleTabChange("login")}
                    />
                  </motion.div>
                ),
              },
            ]}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

// Enhanced Register Form Component
const EnhancedRegisterForm = ({ onLoginClick }) => {
  const [formData, setFormData] = useState({
    id: "",
    phone: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "M", // M: Male, F: Female, O: Other
    role: ["USER"],
  });
  const [errors, setErrors] = useState({
    id: "",
    phone: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
  });
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case "id":
        if (!value.trim()) return "Tên tài khoản không được để trống";
        if (value.length < 4) return "Tên tài khoản phải có ít nhất 4 ký tự";
        if (!/^[a-zA-Z0-9_]+$/.test(value))
          return "Tên tài khoản chỉ chứa chữ cái, số và dấu gạch dưới";
        return "";
      case "phone":
        if (!value.trim()) return "Số điện thoại không được để trống";
        if (!/^[0-9]{10}$/.test(value.replace(/\s/g, "")))
          return "Số điện thoại phải có 10 chữ số";
        return "";
      case "fullname":
        if (!value.trim()) return "Họ và tên không được để trống";
        if (value.trim().length < 2) return "Họ và tên quá ngắn";
        return "";
      case "email":
        if (!value.trim()) return "Email không được để trống";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Email không hợp lệ";
        return "";
      case "password":
        if (!value) return "Mật khẩu không được để trống";
        if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
        if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value))
          return "Mật khẩu phải chứa cả chữ và số";
        return "";
      case "confirmPassword":
        if (!value) return "Vui lòng xác nhận mật khẩu";
        if (value !== formData.password) return "Mật khẩu xác nhận không khớp";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field on change
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));

    // Calculate password strength if password field changes
    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({ score: 0, label: "" });
      return;
    }

    let score = 0;

    // Length check
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;

    // Character variety check
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label = "";
    if (score <= 2) label = "weak";
    else if (score <= 4) label = "medium";
    else label = "strong";

    setPasswordStrength({ score, label });
  };

  const handleGenderChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      gender: e.target.value,
    }));
  };

  const validateStep = (currentStep) => {
    let isValid = true;
    const newErrors = { ...errors };

    if (currentStep === 1) {
      // Validate Step 1 fields
      const fields = ["id", "phone", "fullname"];
      fields.forEach((field) => {
        const error = validateField(field, formData[field]);
        newErrors[field] = error;
        if (error) isValid = false;
      });
    } else if (currentStep === 2) {
      // Validate Step 2 fields
      const fields = ["email", "password", "confirmPassword"];
      fields.forEach((field) => {
        const error = validateField(field, formData[field]);
        newErrors[field] = error;
        if (error) isValid = false;
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      // Add smooth animation between steps
      const content = document.querySelector(".step-content");
      if (content) {
        content.classList.add("fade-out");
        setTimeout(() => {
          setStep(step + 1);
          content.classList.remove("fade-out");
        }, 300);
      } else {
        setStep(step + 1);
      }
    } else {
      // Shake animation for validation errors
      const form = document.querySelector(".register-form");
      form.classList.add("shake");
      setTimeout(() => form.classList.remove("shake"), 500);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) {
      message.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      // Create the registration data in the correct format
      const registrationData = {
        id: formData.id,
        phone: formData.phone,
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
        gender: formData.gender, // Send M/F/O directly
        role: ["USER"],
      };

      // Remove confirmPassword as it's not needed in the API
      delete registrationData.confirmPassword;

      // Call the API
      await authApi.signup(registrationData);
      message.success(
        "Đăng ký thành công! Kiểm tra email nhập mã để xác nhận tài khoản."
      );
      navigate("/otp", { state: { id: formData.id } });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
      message.error(errorMessage);
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div
        className={`step ${step >= 1 ? "active" : ""} ${
          step > 1 ? "completed" : ""
        }`}
      >
        <div className="step-number">1</div>
        <div className="step-title">Thông tin cá nhân</div>
      </div>
      <div className={`step-connector ${step > 1 ? "half" : ""}`}></div>
      <div className={`step ${step >= 2 ? "active" : ""}`}>
        <div className="step-number">2</div>
        <div className="step-title">Thông tin tài khoản</div>
      </div>
    </div>
  );

  const renderPasswordStrength = () => (
    <div className="password-strength">
      <span className={`strength-text ${passwordStrength.label}`}>
        {passwordStrength.label === "weak" && "Yếu"}
        {passwordStrength.label === "medium" && "Trung bình"}
        {passwordStrength.label === "strong" && "Mạnh"}
      </span>
      <div className="strength-bars">
        <div
          className={`bar ${
            passwordStrength.score >= 1
              ? `active ${passwordStrength.label}`
              : ""
          }`}
        ></div>
        <div
          className={`bar ${
            passwordStrength.score >= 2
              ? `active ${passwordStrength.label}`
              : ""
          }`}
        ></div>
        <div
          className={`bar ${
            passwordStrength.score >= 3
              ? `active ${passwordStrength.label}`
              : ""
          }`}
        ></div>
        <div
          className={`bar ${
            passwordStrength.score >= 4
              ? `active ${passwordStrength.label}`
              : ""
          }`}
        ></div>
        <div
          className={`bar ${
            passwordStrength.score >= 5
              ? `active ${passwordStrength.label}`
              : ""
          }`}
        ></div>
      </div>
    </div>
  );

  if (registrationComplete) {
    return (
      <div className="register-success">
        <motion.div
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 12L11 15L16 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        <h3>Đăng ký thành công!</h3>
        <p>Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để tiếp tục.</p>
        <motion.button
          className="submit-button login-button"
          onClick={onLoginClick}
          whileTap={{ scale: 0.98 }}
        >
          Đăng nhập ngay
        </motion.button>
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`register-form ${loading ? "submitting" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {renderStepIndicator()}
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="step-content animated-input"
          >
            <div className="form-group-wrapper">
              <InputField
                icon={<FaUserAlt />}
                type="text"
                name="id"
                placeholder="Tên tài khoản"
                value={formData.id}
                onChange={handleChange}
                error={errors.id}
                maxLength={30}
                toolTip="Tên tài khoản dùng để đăng nhập (ví dụ: johndoe123)"
              />
            </div>
            <div className="form-group-wrapper">
              <InputField
                icon={<FiPhone />}
                type="tel"
                name="phone"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                maxLength={10}
              />
            </div>
            <div className="form-group-wrapper">
              <InputField
                icon={<FiUser />}
                type="text"
                name="fullname"
                placeholder="Họ và tên đầy đủ"
                value={formData.fullname}
                onChange={handleChange}
                error={errors.fullname}
              />
            </div>
            <div className="form-group">
              <label className="input-label">Giới tính</label>
              <div className="gender-select">
                <Radio.Group
                  onChange={handleGenderChange}
                  value={formData.gender}
                >
                  <Radio value="M" className="gender-option">
                    <FaMars className="gender-icon male" /> Nam
                  </Radio>
                  <Radio value="F" className="gender-option">
                    <FaVenus className="gender-icon female" /> Nữ
                  </Radio>
                  <Radio value="O" className="gender-option">
                    <FiUser className="gender-icon other" /> Khác
                  </Radio>
                </Radio.Group>
              </div>
            </div>
            <motion.button
              type="button"
              className="submit-button"
              onClick={nextStep}
              whileTap={{ scale: 0.98 }}
              whileHover={{ boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
            >
              Tiếp theo
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="step-content animated-input"
          >
            <div className="form-group-wrapper">
              <InputField
                icon={<FiMail />}
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>
            <div className="form-group-wrapper">
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
                requirements="Tối thiểu 6 ký tự, bao gồm chữ và số"
              />
            </div>
            {formData.password && renderPasswordStrength()}
            <div className="form-group-wrapper">
              <InputField
                icon={<FiLock />}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                endIcon={
                  <button
                    type="button"
                    className="visibility-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                }
              />
            </div>
            <div className="button-group">
              <motion.button
                type="button"
                className="back-button"
                onClick={prevStep}
                // whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                Quay lại
              </motion.button>
              <motion.button
                type="submit"
                className="submit-button"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                whileHover={{ boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
              >
                {loading ? <>ĐANG XỬ LÝ...</> : "ĐĂNG KÝ"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="form-footer">
        <p>Đã có tài khoản?</p>
        <button 
          type="button"
          className="switch-auth-mode"
          onClick={onLoginClick}
        >
          Đăng nhập ngay
          <FiArrowRight className="arrow-icon" />
        </button>
      </div>
    </motion.form>
  );
};

// Optimized helper components
const InputField = ({
  icon,
  endIcon,
  error,
  toolTip,
  requirements,
  ...props
}) => (
  <motion.div className="form-group">
    {(toolTip || props.placeholder) && (
      <div className={`input-label ${toolTip ? "with-tooltip" : ""}`}>
        <span>{props.placeholder}</span>
        {toolTip && (
          <motion.span
            className="tooltip-icon"
            title={toolTip}
            whileHover={{ scale: 1.2 }}
          >
            <FiInfo size={12} />
          </motion.span>
        )}
      </div>
    )}
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
    {requirements && !error && (
      <div className="field-requirements">{requirements}</div>
    )}
    {error && (
      <motion.div
        className="error-message"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ duration: 0.2 }}
      >
        {error}
      </motion.div>
    )}
  </motion.div>
);

// Forgot Password Form Component
const ForgotPasswordForm = ({
  forgotPasswordEmail,
  setForgotPasswordEmail,
  handleForgotPassword,
  onCancel,
}) => (
  <motion.div
    key="forgot-password"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="forgot-password-form"
  >
    <h3>Quên mật khẩu</h3>
    <p>Vui lòng nhập email của bạn để nhận link đặt lại mật khẩu.</p>
    <form onSubmit={handleForgotPassword}>
      <InputField
        icon={<FiMail />}
        type="email"
        placeholder="Email của bạn"
        value={forgotPasswordEmail}
        onChange={(e) => setForgotPasswordEmail(e.target.value)}
      />
      <div className="button-group">
        <motion.button
          type="button"
          className="cancel-button"
          onClick={onCancel}
          whileTap={{ scale: 0.98 }}
        >
          Hủy
        </motion.button>
        <motion.button
          type="submit"
          className="submit-button"
          whileTap={{ scale: 0.98 }}
        >
          Gửi
        </motion.button>
      </div>
    </form>
  </motion.div>
);

const CustomCheckbox = ({ label, ...props }) => (
  <label className="custom-checkbox">
    <input type="checkbox" {...props} />
    <span className="checkmark" />
    <span>{label}</span>
  </label>
);

const SocialButton = ({ icon, label, color, onClick }) => (
  <motion.button
    type="button"
    className={`social-button ${label.toLowerCase()}`}
    style={{ "--button-color": color }}
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.span className="icon">{icon}</motion.span>
    <span className="label">{label}</span>
  </motion.button>
);

export default LoginForm;