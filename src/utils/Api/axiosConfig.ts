import axios from 'axios';
import { refreshToken } from './Auth';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response interceptor to handle 401 errors
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Don't retry auth endpoints
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (originalRequest.url?.includes('/login') || originalRequest.url?.includes('/refresh')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return axios(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const result = await refreshToken();
                if (result.success) {
                    processQueue(null, result.accessToken);
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                // Redirect to login
                window.location.href = '/Login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// Request interceptor to always include credentials
axios.interceptors.request.use(
    (config) => {
        config.withCredentials = true;
        return config;
    },
    (error) => Promise.reject(error)
);

export default axios;
