import axios from 'axios';
import httpStatus from './httpStatus';
import funcUtils from 'utils/funcUtils';
import authApi from 'api/Admin/Auth/Login';

// import authApi from '../user/Security/authApi';

const baseUrl = process.env.REACT_APP_ShopeTheThao_PRODUCTION_REST_API;
// setup axios client

const axiosClient = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-type': 'application/json',
    },
    // withCredentials: true,
});

axiosClient.interceptors.request.use(
    (config) => {
        try {
            const token = authApi.getToken();
            if (token && token !== 'undefined') {
                config.headers['Authorization'] = token;
            }
        } catch (error) {
            console.error('Thiết lập header xác thực không thành công:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            authApi.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
