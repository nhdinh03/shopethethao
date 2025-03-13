import UserNotFound from 'pages/NotFound/UserNotFound';
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { hasPermission, isAdminRole } from 'utils/roleManager';
import { Spin } from 'antd';

const PrivateRoute = ({ children, requiredPermission }) => {
  const [isLoading, setIsLoading] = useState(true);
  const userRoles = JSON.parse(localStorage.getItem('roles') || '[]');
  const isAuthenticated = localStorage.getItem('token');
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/dashboard-management-sys');

  useEffect(() => {
    // Simulate checking authentication status
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f0f2f5'
      }}>
        <Spin size="large" tip="Đang kiểm tra quyền truy cập..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/v1/auth/login" />;
  }

  // Kiểm tra quyền truy cập đường dẫn admin
  if (isAdminPath && !isAdminRole(userRoles)) {
    return <UserNotFound />;
  }

  if (requiredPermission && !hasPermission(userRoles, requiredPermission)) {
    return <UserNotFound />;
  }

  return children;
};

export default PrivateRoute;
