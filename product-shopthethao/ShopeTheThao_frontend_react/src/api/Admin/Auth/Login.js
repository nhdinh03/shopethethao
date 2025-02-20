import axiosClient from "api/global/axiosClient";

const endpoints = {
  auth: "auth/signin",
  signup: "auth/signup",
  logout: "auth/logout",
  regenerateOtp: "auth/regenerate-otp",
  verifyAccount: "auth/verify-account",
  changePassword: "auth/change-password",
  SendOtpEmail: "auth/forgot-password",
  ResetPassword: "auth/reset-password",
};

const authApi = {
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

  getVerifyAccount: async (values) => {
    try {
      const response = await axiosClient.post(endpoints.verifyAccount, values);

      return response;
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
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

  regenerateOtp: async (email) => {
    try {
      const response = await axiosClient.put(
        `${endpoints.regenerateOtp}?email=${email}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi trong quá trình tái tạo OTP:", error);
      throw error;
    }
  },

  changePasswordNew: async (values) => {
    try {
      const response = await axiosClient.put(endpoints.changePassword, values);
      return response.data;
    } catch (error) {
      console.error("Lỗi Đổi mật khẩu:", error);
      throw error;
    }
  },

  ResetPasswordNew: async (values) => {
    try {
      const response = await axiosClient.put(endpoints.ResetPassword, values);
      return response.data;
    } catch (error) {
      console.error("Lỗi Đổi mật khẩu:", error);
      throw error;
    }
  },

  sendOtpEmailNew: async (values) => {
    try {
      const response = await axiosClient.put(endpoints.SendOtpEmail, values);
      return response.data;
    } catch (error) {
      console.error("Lỗi gửi email:", error);
      throw error;
    }
  },

  getToken() {
    try {
      const token = localStorage.getItem("token");
      return token && token !== "undefined" ? token : null;
    } catch (error) {
      console.error("Token retrieval error:", error);
      return null;
    }
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
    // Xóa tất cảlocalStorage trước
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("roles");

    // Chỉ thực hiện lệnh gọi API nếu chúng tôi có mã thông báo
    if (token) {
      return axiosClient
        .get(endpoints.logout, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          console.log("Đăng xuất thành công:", response.data);
          return response.data;
        })
        .catch((error) => {
          console.error("Lỗi đăng xuất:", error);
          throw error;
        });
    }

    // Return resolved promise if no token
    return Promise.resolve({ message: "Đã đăng localStorage" });
  },
};

export default authApi;
