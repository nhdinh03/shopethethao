import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { motion } from "framer-motion";
import { FiMail, FiUser, FiLock } from "react-icons/fi";
import authApi from 'api/Admin/Auth/auth';
import "./otpForm.scss";

const OtpForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(true);
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');

  // Add authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      message.info('Bạn đã đăng nhập!');
      navigate('/');
      return;
    }

    const savedVerification = JSON.parse(localStorage.getItem('pendingVerification'));
    
    // Use location state first, then fallback to localStorage
    if (location.state?.id) {
      setUserId(location.state.id);
      setUserEmail(location.state.email || '');
    } else if (savedVerification?.id) {
      setUserId(savedVerification.id);
      setUserEmail(savedVerification.email || '');
    } else if (savedVerification?.email) {
      setUserEmail(savedVerification.email);
    }
  }, [navigate, location.state]);

  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown, canResend]);

  // Handle OTP verification
  const handleVerify = async (values) => {
    if (!userId) {
      message.error('Không tìm thấy thông tin tài khoản!');
      return;
    }

    setLoading(true);
    try {
      await authApi.getVerifyAccount({
        id: userId, // Use the stored userId directly
        otp: values.otp
      });
      
      localStorage.removeItem('pendingVerification');
      message.success('Xác thực tài khoản thành công!');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.message || 'Xác thực thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP resend with email
  const handleResendOtp = async () => {
    if (!verificationEmail) {
      message.error('Vui lòng nhập email để nhận mã OTP!');
      return;
    }

    setResendLoading(true);
    try {
      await authApi.regenerateOtp(verificationEmail);
      
      message.success('Đã gửi mã OTP mới! Vui lòng kiểm tra email và xác minh trong vòng 1 phút.');
      setCanResend(false);
      setCountdown(60);
      setUserEmail(verificationEmail);
      
      // Save email for future reference
      if (userId) {
        localStorage.setItem('pendingVerification', JSON.stringify({
          id: userId,
          email: verificationEmail,
          timestamp: new Date().getTime()
        }));
      } else {
        localStorage.setItem('pendingVerification', JSON.stringify({
          email: verificationEmail,
          timestamp: new Date().getTime()
        }));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Không thể gửi lại mã OTP!';
      message.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <motion.div 
        className="otp-form-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="form-header">
          <h2>Xác thực tài khoản</h2>
          <p>Vui lòng nhập mã OTP đã được gửi đến email của bạn</p>
        </div>

        <Form
          form={form}
          onFinish={handleVerify}
          layout="vertical"
          className="otp-form"
        >
          {userId && (
            <div className="user-info">
              <FiUser className="icon" />
              <span>Tài khoản: {userId}</span>
            </div>
          )}

          <Form.Item
            name="otp"
            rules={[
              { required: true, message: 'Vui lòng nhập mã OTP!' },
              { len: 6, message: 'Mã OTP phải có 6 ký tự!' }
            ]}
          >
            <Input
              prefix={<FiLock className="input-icon" />}
              placeholder="Nhập mã OTP"
              maxLength={6}
            />
          </Form.Item>

          <div className="resend-container">
            <Input
              prefix={<FiMail className="input-icon" />}
              placeholder="Email để nhận mã OTP"
              value={verificationEmail}
              onChange={(e) => setVerificationEmail(e.target.value)}
              className="email-input"
            />
            <Button
              onClick={handleResendOtp}
              disabled={!canResend}
              loading={resendLoading}
              className="resend-button"
            >
              {canResend ? 'Gửi mã' : `Gửi lại sau (${countdown}s)`}
            </Button>
          </div>

          <div className="form-actions">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="verify-button"
              block
            >
              Xác thực
            </Button>
          </div>
        </Form>
      </motion.div>
    </div>
  );
};

export default OtpForm;
