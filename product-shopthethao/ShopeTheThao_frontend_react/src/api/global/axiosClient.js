import axios from 'axios';
import authApi from 'api/Admin/Auth/Login';


const baseUrl = process.env.REACT_APP_ShopeTheThao_PRODUCTION_REST_API;
// setup axios client

const axiosClient = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-type': 'application/json',
    },
    // withCredentials: true,
});

// axiosClient.interceptors.response.use(
//     (response) => {
//         if (response && response.data) {
//             return response;
//         }
//         return response;
//     },
//     (error) => {
//         if (error.response) {
//             switch (error.response.status) {
//                 case httpStatus.INTERNAL_SERVER_ERROR:
//                     funcUtils.notify('Lỗi kết nối server', 'error');
//                     break;
//                 // case 401:
//                 //     funcUtils.notify(error.response.data.message, 'error');
//                 //     break;
//                 // case httpStatus.CONFLICT:
//                 //     funcUtils.notify(error.response.data, 'error');
//                 //     break;
//                 default:
//                     console.log(error);
//                     break;
//             }
//         }
//         return Promise.reject(error);
//     },
// );

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
export default axiosClient;
