import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { message } from "antd";
import { FiMail, FiCheck, FiRefreshCw } from "react-icons/fi";
// Make sure to use the correct path to import InputField
import { InputField } from "../Common/FormFields";
import authApi from "api/Admin/Auth/auth";

const EmailVerificationForm = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.id;

  useEffect(() => {
    if (!userId) {
      navigate('/v1/auth/login');
      message.error("Không tìm thấy thông tin người dùng.");
      return;
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (e) => {
    const value = e.target.value;
    // Only allow digits and limit to 6 characters
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      message.error("Vui lòng nhập mã OTP 6 số!");
      return;
    }
    
    setLoading(true);
    try {
      await authApi.verifyAccount({
        code: otp,
        id: userId
      });
      message.success("Xác thực tài khoản thành công! Bạn có thể đăng nhập ngay.");
      navigate('/v1/auth/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Xác thực thất bại. Vui lòng kiểm tra lại mã OTP!";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    setResendLoading(true);
    try {
      await authApi.resendOtp({ id: userId });
      message.success("Đã gửi lại mã OTP mới đến email của bạn!");
      setCountdown(60);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Không thể gửi lại mã OTP. Vui lòng thử lại sau!";
      message.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="email-verification-container">
      <motion.div 
        className="verification-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="verification-header">
          <motion.div 
            className="email-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <FiMail size={40} />
          </motion.div>
          <h2>Xác thực tài khoản</h2>
          <p>Vui lòng nhập mã OTP đã được gửi đến email của bạn để xác thực tài khoản.</p>
        </div>

        <form onSubmit={handleVerify} className="verification-form">
          <div className="otp-input-wrapper">
            <InputField
              type="text"
              placeholder="Nhập mã OTP 6 số"
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
              autoFocus
            />
          </div>

          <motion.button
            type="submit"
            className={`verify-button ${loading ? 'loading' : ''}`}
            disabled={loading || !otp || otp.length !== 6}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Đang xác thực..." : "Xác thực tài khoản"}
            {!loading && <FiCheck className="button-icon" />}
          </motion.button>
          
          <div className="resend-wrapper">
            <button 
              type="button" 
              className={`resend-button ${countdown > 0 || resendLoading ? 'disabled' : ''}`}
              onClick={handleResendOtp}
              disabled={countdown > 0 || resendLoading}
            >
              {resendLoading ? "Đang gửi..." : "Gửi lại mã OTP"}
              {!resendLoading && countdown === 0 && <FiRefreshCw className="button-icon" />}
            </button>
            {countdown > 0 && <span className="countdown">({countdown}s)</span>}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailVerificationForm;
