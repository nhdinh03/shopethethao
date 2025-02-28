import { loginApi } from 'api/Admin';

class AuthService {
  static async login(credentials) {
    try {
      const response = await loginApi.getLogin(credentials);
      
      if (response?.data) {
        const { token, user, roles } = response.data;
        this.setUserData({ token, user, roles });
        return response.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      this.clearUserData();
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }

  static setUserData(data) {
    if (data.token) localStorage.setItem('token', data.token);
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
    if (data.roles) localStorage.setItem('roles', JSON.stringify(data.roles));
  }

  static clearUserData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('roles');
  }

  static getUserData() {
    return {
      token: localStorage.getItem('token'),
      user: JSON.parse(localStorage.getItem('user') || 'null'),
      roles: JSON.parse(localStorage.getItem('roles') || '[]')
    };
  }

  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  static hasRole(role) {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    return roles.includes(role);
  }

  static logout() {
    this.clearUserData();
  }
}

export default AuthService;
