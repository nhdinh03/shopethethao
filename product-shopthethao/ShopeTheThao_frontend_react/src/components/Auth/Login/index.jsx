import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from 'react-icons/fi';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import './login.scss';

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
      <div className="login-left">
        <div className="welcome-content">
          <h1>Chào mừng bạn đến với Sport Shop</h1>
          <p>Nơi mang đến cho bạn những sản phẩm thể thao chất lượng nhất</p>
          <div className="features">
            <div className="feature-item">
              <FiUser />
              <span>Tài khoản được bảo mật tuyệt đối</span>
            </div>
            {/* Add more feature items */}
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="form-container">
          <div className="form-header">
            <img src="/logo.png" alt="Logo" className="brand-logo" />
            <h2>Đăng nhập</h2>
            <p>Vui lòng đăng nhập để tiếp tục</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="input-label">Email</label>
              <div className="input-field">
                <FiMail className="field-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Nhập email của bạn"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="input-label">
                Mật khẩu
                <Link to="/forgot-password" className="forgot-link">
                  Quên mật khẩu?
                </Link>
              </label>
              <div className="input-field">
                <FiLock className="field-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Nhập mật khẩu của bạn"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="visibility-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                <span>Ghi nhớ đăng nhập</span>
              </label>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                'Đăng nhập'
              )}
            </button>

            <div className="social-login">
              <div className="divider">
                <span>hoặc tiếp tục với</span>
              </div>
              <div className="social-buttons">
                <button type="button" className="social-button facebook">
                  <FaFacebookF />
                  <span>Facebook</span>
                </button>
                <button type="button" className="social-button google">
                  <FaGoogle />
                  <span>Google</span>
                </button>
              </div>
            </div>
          </form>

          <div className="form-footer">
            <p>Chưa có tài khoản?</p>
            <Link to="/register" className="register-link">
              Đăng ký ngay
              <svg viewBox="0 0 24 24" className="arrow-icon">
                <path d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
