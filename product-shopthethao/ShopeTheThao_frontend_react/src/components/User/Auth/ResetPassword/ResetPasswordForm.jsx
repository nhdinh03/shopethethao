import React, { useState } from 'react';
import { Form, Input, Button, message, Steps } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import authApi from 'api/Admin/Auth/Login';

const { Step } = Steps;

const ResetPasswordForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSendOTP = async (values) => {
    setLoading(true);
    try {
      await authApi.sendOtpEmailNew(values);
      setEmail(values.email);
      message.success('Mã OTP đã được gửi đến email của bạn!');
      setCurrentStep(1);
    } catch (error) {
      message.error('Không thể gửi OTP: ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      await authApi.ResetPasswordNew({
        email: email,
        otp: values.otp,
        newPassword: values.newPassword
      });
      message.success('Đặt lại mật khẩu thành công!');
      navigate('/login');
    } catch (error) {
      message.error('Đặt lại mật khẩu thất bại: ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Nhập Email',
      content: (
        <Form form={form} onFinish={handleSendOTP}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Gửi Mã OTP
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Đặt Lại Mật Khẩu',
      content: (
        <Form form={form} onFinish={handleResetPassword}>
          <Form.Item
            name="otp"
            rules={[{ required: true, message: 'Vui lòng nhập mã OTP!' }]}
          >
            <Input placeholder="Nhập mã OTP" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Đặt Lại Mật Khẩu
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className="reset-password-container">
      <h2>Đặt Lại Mật Khẩu</h2>
      <Steps current={currentStep}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">
        {steps[currentStep].content}
      </div>
    </div>
  );
};

export default ResetPasswordForm;
