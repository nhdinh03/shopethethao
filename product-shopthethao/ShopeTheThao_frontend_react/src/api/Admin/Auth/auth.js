import axiosClient from "api/global/axiosClient";

const endpoints = {
  auth: "auth/signin",
  signup: "auth/signup",
  logout: "auth/logout",
  regenerateOtp: "auth/regenerate-otp",
  verifyAccount: "auth/verify-account",
  changePassword: "auth/change-password",
  forgotPassword: "auth/forgot-password",
  resetPassword: "auth/reset-password",
};

const authApi = {
  login: function(credentials) {
    return this.getLogin(credentials);
  },

  getLogin: async (values) => {
    try {
      const response = await axiosClient.post(endpoints.auth, values);
      const data = response?.data;

      if (!data || !data.token || !data.type || !data.roles) {
        throw new Error("Invalid response format");
      }

      localStorage.clear();

      const token = `${data.type} ${data.token}`;
      localStorage.setItem("token", token);

      const userData = {
        id: data.id,
        fullname: data.fullname,
        email: data.email,
        phone: data.phone,
        image: data.image,
        gender: data.gender,
        birthday: data.birthday,
        address: data.address,
        roles: data.roles,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("roles", JSON.stringify(data.roles));

      return {
        success: true,
        data: userData,
        roles: data.roles,
      };
    } catch (error) {
      // Ensure cleanup on error
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("roles");
      throw error;
    }
  },


  signup: async (values) => {
    try {
      const response = await axiosClient.post(endpoints.signup, values);
      const { data } = response;

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error("lỗi", error);
      throw error;
    }
  },

  getVerifyAccount: async (values) => {
    try {
      const response = await axiosClient.post(endpoints.verifyAccount, values);

      return response;
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      throw error;
    }
  },



  changePassword: async (values) => {
    try {
      console.log("Sending password change request with payload:", JSON.stringify(values));
      const response = await axiosClient.put(endpoints.changePassword, {
        id: values.id,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword
      });
      return response.data;
    } catch (error) {
      console.error("Password change API error:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      throw error;
    }
  },

  regenerateOtp: async (email) => {
    try {
      // Handle both direct email input and object format
      const emailValue = typeof email === 'object' ? email.email : email;
      const payload = { email: emailValue };
      
      const response = await axiosClient.put(endpoints.regenerateOtp, payload);
      return response.data;
    } catch (error) {
      console.error("Lỗi trong quá trình tái tạo OTP:", error);
      throw error;
    }
  },

  sendOtpEmail: async (values) => {
    try {
      const response = await axiosClient.put(endpoints.forgotPassword, values);
      return response.data;
    } catch (error) {
      console.error("Lỗi gửi email:", error);
      throw error;
    }
  },

  resetPassword: async (values) => {
    try {
      const response = await axiosClient.put(endpoints.resetPassword, values);
      return response.data;
    } catch (error) {
      console.error("Lỗi đặt lại mật khẩu:", error);
      throw error;
    }
  },

  getToken() {
    try {
      const token = localStorage.getItem("token");
      // Clean up invalid tokens
      if (!token || token === "undefined") {
        localStorage.removeItem("token");
        return null;
      }
      return token;
    } catch (error) {
      console.error("Token retrieval error:", error);
      localStorage.removeItem("token");
      return null;
    }
  },

  getUserData() {
    return {
      token: localStorage.getItem('token'),
      user: JSON.parse(localStorage.getItem('user') || 'null'),
      roles: JSON.parse(localStorage.getItem('roles') || '[]')
    };
  },

  getUser() {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        return JSON.parse(user);
      } catch (e) {
        console.error("Lỗi khi phân tích user:", e);
        return null;
      }
    }
    return null;
  },

  logout() {
    const token = this.getToken();
    
    // Always clear localStorage first
    localStorage.clear();
    
    if (!token) {
        return Promise.resolve({ message: "Đăng xuất thành công" });
    }

    return axiosClient.post(endpoints.logout, {}, {
        headers: { 
            Authorization: token
        }
    })
    .then(response => {
        return response.data;
    })
    .catch(error => {
        console.error("Lỗi đăng xuất:", error);
        // Return success anyway since we've cleared localStorage
        return { message: "Đăng xuất thành công" };
    });
  },

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token; // Returns true if token exists and is not empty
  },

  hasRole(role) {
    try {
      const userData = this.getUserData();
      if (!userData || !userData.user || !userData.user.role) {
        return false;
      }
      return userData.user.role === role;
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  }
};

export default authApi;
