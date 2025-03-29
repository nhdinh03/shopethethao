import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Spin, message, Result, Button } from 'antd';
import { ROUTES } from 'router';
import { useAuth } from 'hooks/useAuth';
import { getRedirectPath } from 'utils/roleManager';
import authApi from 'api/Admin/Auth/auth';

const OAuth2RedirectHandler = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const processOAuth2Response = async () => {
      try {
        const getUrlParameter = (name) => {
          name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
          const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
          const results = regex.exec(location.search);
          return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };

        const token = getUrlParameter('token');
        const refreshToken = getUrlParameter('refreshToken');
        const error = getUrlParameter('error');
        const userId = getUrlParameter('userId');
        const email = getUrlParameter('email');
        const name = getUrlParameter('name');
        const rolesParam = getUrlParameter('roles');
        const roles = rolesParam ? rolesParam.split(',') : [];

        if (error) {
          setError(error);
          setLoading(false);
          return;
        }

        if (!token) {
          setError('Không nhận được token xác thực');
          setLoading(false);
          return;
        }

        // Store token and user data using the auth API
        const userData = {
          id: userId,
          fullname: name,
          email: email,
          roles: roles
        };
        
        await authApi.processOAuth2Login(`Bearer ${token}`, refreshToken, userData);

        // Display success message
        message.success(`Chào mừng ${name} đã đăng nhập thành công!`);
        
        // Determine redirect path based on roles and navigate
        const redirectPath = getRedirectPath(roles);
        navigate(redirectPath);
      } catch (error) {
        console.error('OAuth2 Login Error:', error);
        setError('Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.');
        setLoading(false);
      }
    };

    processOAuth2Response();
  }, [location, navigate]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        background: '#f0f2f5'
      }}>
        <Spin size="large" />
        <h2 style={{ marginTop: 24, marginBottom: 8 }}>Đang xử lý đăng nhập...</h2>
        <p style={{ color: '#666' }}>Vui lòng đợi trong giây lát</p>
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Đăng nhập thất bại"
        subTitle={error}
        extra={[
          <Button 
            type="primary" 
            key="login" 
            onClick={() => navigate(ROUTES.AUTH.LOGIN)}
          >
            Trở về trang đăng nhập
          </Button>,
        ]}
      />
    );
  }

  return null;
};

export default OAuth2RedirectHandler;
