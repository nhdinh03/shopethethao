import { useState, useCallback } from 'react';
import AuthService from '../services/authService';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const result = await AuthService.login(credentials);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
  }, []);

  return {
    login,
    logout,
    loading,
    error,
    isAuthenticated: AuthService.isAuthenticated(),
    hasRole: AuthService.hasRole,
    getUserData: AuthService.getUserData
  };
};
