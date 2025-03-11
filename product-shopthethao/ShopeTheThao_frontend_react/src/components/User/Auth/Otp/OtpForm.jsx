import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import authApi from 'api/Admin/Auth/Login';


const OtpForm = () => {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const onFinish = async (values) => {
    if (!email) {
      message.error('Email không tồn tại!');
      return;
    }

    setLoading(true);
    try {
      await authApi.getVerifyAccount({
        email: email,
        otp: values.otp
      });
      message.success('Xác thực tài khoản thành công!');
      navigate('/login');
    } catch (error) {
      message.error('Xác thực thất bại: ' + (error.response?.data?.message || 'Mã OTP không đúng'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      message.error('Email không tồn tại!');
      return;
    }

    setResendLoading(true);
    try {
      await authApi.regenerateOtp(email);
      message.success('Đã gửi lại mã OTP mới!');
    } catch (error) {
      message.error('Không thể gửi lại OTP: ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="otp-form-container">
      <h2>Xác Thực Tài Khoản</h2>
      <p>Vui lòng nhập mã OTP đã được gửi đến email: {email}</p>
      
      <Form
        name="otpForm"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: 'Vui lòng nhập mã OTP!' },
            { len: 6, message: 'Mã OTP phải có 6 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập mã OTP" maxLength={6} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Xác Thực
          </Button>
        </Form.Item>

        <Form.Item>
          <Button 
            type="link" 
            onClick={handleResendOtp} 
            loading={resendLoading}
            block
          >
            Gửi lại mã OTP
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OtpForm;
