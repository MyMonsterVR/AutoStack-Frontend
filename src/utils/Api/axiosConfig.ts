import axios from "axios";
import { API_BASE_URL } from "./config";

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

// Request interceptor to attach access token, but never for auth/refresh endpoints
axiosInstance.interceptors.request.use(
    (config) => {
        const url = (config.url || '').toLowerCase();
        const isAuthFree = (
            url.includes('/refresh') ||
            url.includes('/login') ||
            url.includes('/register') ||
            url.includes('/logout')
        );

        if (!isAuthFree) {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                config.headers = config.headers || {};
                (config.headers as any).Authorization = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest: any = error.config || {};
        const status = error?.response?.status;
        const url = (originalRequest?.url || '').toLowerCase();

        // Avoid loops: never try to refresh when the failing call is /refresh itself
        const isRefreshCall = url.includes('/refresh');

        if (status === 401 && !originalRequest._retry && !isRefreshCall) {
            originalRequest._retry = true;

            try {
                // Rely on cookies only
                const refreshRes = await axios.post(
                    `${API_BASE_URL}/refresh`,
                    {},
                    { withCredentials: true }
                );

                const payload = refreshRes?.data?.data ?? {};
                const accessToken = payload.accessToken ?? payload?.accessToken;
                const newRefreshToken = payload.refreshToken ?? payload?.refreshToken;

                if (accessToken) localStorage.setItem('accessToken', accessToken);
                if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

                // Set Authorization header for the retried call if we have a token
                originalRequest.headers = originalRequest.headers || {};
                if (accessToken) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // On refresh failure, clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;