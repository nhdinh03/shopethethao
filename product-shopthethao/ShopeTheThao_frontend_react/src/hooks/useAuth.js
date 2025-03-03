import authApi from 'api/Admin/Auth/Login';
import { useState, useCallback } from 'react';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authApi.login(credentials);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
  }, []);

  // Check if the methods exist before using them
  const isAuthenticated = useCallback(() => {
    return typeof authApi.isAuthenticated === 'function' 
      ? authApi.isAuthenticated() 
      : false;
  }, []);

  const hasRole = useCallback((role) => {
    return typeof authApi.hasRole === 'function'
      ? authApi.hasRole(role)
      : false;
  }, []);

  const getUserData = useCallback(() => {
    return typeof authApi.getUserData === 'function'
      ? authApi.getUserData()
      : null;
  }, []);

  return {
    login,
    logout,
    loading,
    error,
    isAuthenticated: isAuthenticated(),
    hasRole,
    getUserData
  };
};
