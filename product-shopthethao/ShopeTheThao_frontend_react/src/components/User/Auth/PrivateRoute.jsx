import UserNotFound from 'pages/NotFound/UserNotFound';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { hasPermission, isAdminRole } from 'utils/roleManager';


const PrivateRoute = ({ children, requiredPermission }) => {
  const userRoles = JSON.parse(localStorage.getItem('roles') || '[]');
  const isAuthenticated = localStorage.getItem('token');
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/dashboard-management-sys');

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
