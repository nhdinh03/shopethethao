import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { message } from "antd";
import { FiInfo, FiMail, FiLock, FiEyeOff, FiEye } from "react-icons/fi";
// Make sure to use the correct path to import the form components
import { InputField, EmailField } from "../Common/FormFields";
import authApi from "api/Admin/Auth/auth";

const ForgotPasswordForm = ({
  forgotPasswordEmail,
  setForgotPasswordEmail,

  onCancel,
}) => {
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail || !forgotPasswordEmail.trim()) {
      message.error("Vui lòng nhập email của bạn!");
      return;
    }

    setLoading(true);
    try {
      await authApi.sendOtpEmail({ email: forgotPasswordEmail.trim() });
      message.success("Mã OTP đã được gửi đến email của bạn!");
      setOtpSent(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Không thể gửi OTP. Vui lòng thử lại sau.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!otp || !otp.trim()) {
      message.error("Vui lòng nhập mã OTP!");
      return;
    }
    
    if (!newPassword || newPassword.length < 6) {
      message.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({
        code: otp.trim(),
        newPassword: newPassword
      });
      message.success("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.");
      onCancel(); // Return to login form
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại!";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="forgot-password"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="forgot-password-form"
    >
      {!otpSent ? (
        <>
          <p className="form-description">Vui lòng nhập email của bạn để nhận mã OTP đặt lại mật khẩu.</p>
          <form onSubmit={handleSendOtp} className="password-reset-form">
            <EmailField
              icon={<FiMail />}
              name="email"
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
                  disabled={loading}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? "ĐANG GỬI MÃ..." : "Gửi OTP"}
                </motion.button>
            </div>
          </form>
        </>
      ) : (
        <>
          <p className="form-description">Vui lòng nhập mã OTP đã được gửi đến email của bạn và tạo mật khẩu mới.</p>
          <form onSubmit={handleResetPassword} className="password-reset-form">
            <InputField
              icon={<FiInfo />}
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
            <InputField
              icon={<FiLock />}
              type={showNewPassword ? "text" : "password"}
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              endIcon={
                <button
                  type="button"
                  className="visibility-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              }
            />
            <InputField
              icon={<FiLock />}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            <div className="button-group">
              <motion.button
                type="button"
                className="back-button"
                onClick={() => setOtpSent(false)}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                Quay lại
              </motion.button>
              <motion.button
                type="submit"
                className={`submit-button ${loading ? 'loading' : ''}`}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading && <span className="button-spinner"></span>}
                {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
              </motion.button>
            </div>
          </form>
        </>
      )}
    </motion.div>
  );
};

export default ForgotPasswordForm;