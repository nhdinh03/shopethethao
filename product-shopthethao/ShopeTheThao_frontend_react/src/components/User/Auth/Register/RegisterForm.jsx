import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { message, Radio } from "antd";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";
import { FaMars, FaVenus, FaUserAlt } from "react-icons/fa";
import { InputField, EmailField } from "../Common/FormFields";
import authApi from "api/Admin/Auth/auth";

const RegisterForm = ({ onLoginClick }) => {
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
      navigate("/v1/auth/otp", { state: { id: formData.id } });
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
              <EmailField
                icon={<FiMail />}
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

export default RegisterForm;
