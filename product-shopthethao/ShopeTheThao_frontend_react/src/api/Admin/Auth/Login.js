import axiosClient from 'api/global/axiosClient';

const endpoints = {
    auth: 'auth/signin',
    signup: 'auth/signup',
    logout: 'auth/logout',
    regenerateOtp: 'auth/regenerate-otp',
    verifyAccount: 'auth/verify-account',
    changePassword: 'auth/change-password',
    SendOtpEmail: 'auth/forgot-password',
    ResetPassword: 'auth/reset-password'
};

const authApi = {
    getLogin: async (values) => {
        try {
            const response = await axiosClient.post(endpoints.auth, values);

            if (response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
            }
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            if (response.data.roles) {
                localStorage.setItem('roles', JSON.stringify(response.data.roles));
            }

            return response;
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            throw error;
        }
    },

    getVerifyAccount: async (values) => {
        try {
            const response = await axiosClient.post(endpoints.verifyAccount, values);

            return response;
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            throw error;
        }
    },

    signup: async (values) => {
        try {
            const response = await axiosClient.post(endpoints.signup, values);
            const { data } = response;

            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            return data;
        } catch (error) {
            console.error('lỗi', error);
            throw error;
        }
    },

    regenerateOtp: async (email) => {
        try {
            const response = await axiosClient.put(`${endpoints.regenerateOtp}?email=${(email)}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi trong quá trình tái tạo OTP:', error);
            throw error;
        }
    },

    changePasswordNew: async (values) => {
        try {
            const response = await axiosClient.put(endpoints.changePassword, values);
            return response.data;
        } catch (error) {
            console.error('Lỗi Đổi mật khẩu:', error);
            throw error;
        }
    },

    ResetPasswordNew: async (values) => {
        try {
            const response = await axiosClient.put(endpoints.ResetPassword, values);
            return response.data;
        } catch (error) {
            console.error('Lỗi Đổi mật khẩu:', error);
            throw error;
        }
    },

    sendOtpEmailNew: async (values) => {
        try {
            const response = await axiosClient.put(endpoints.SendOtpEmail, values);
            return response.data;
        } catch (error) {
            console.error('Lỗi gửi email:', error);
            throw error;
        }
    },

    getToken() {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                return JSON.parse(token);
            } catch (e) {
                console.error('Lỗi khi phân tích token:', e);
                return null;
            }
        }
        return null;
    },

    getUser() {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                return JSON.parse(user);
            } catch (e) {
                console.error('Lỗi khi phân tích user:', e);
                return null;
            }
        }
        return null;
    },

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        return axiosClient.get(endpoints.logout)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error during logout:', error);
            });
    },
}

export default authApi;
