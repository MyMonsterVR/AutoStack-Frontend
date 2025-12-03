import axios from "axios";
import { API_BASE_URL } from "./config";

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest: any = error.config || {};
        const status = error?.response?.status;
        const url = (originalRequest?.url || '').toLowerCase();

        const isRefreshCall = url.includes('/refresh');

        if (status === 401 && !originalRequest._retry && !isRefreshCall) {
            originalRequest._retry = true;

            try {
                await axios.post(
                    `${API_BASE_URL}/refresh`,
                    {},
                    { withCredentials: true }
                );

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;