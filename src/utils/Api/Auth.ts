import axios from "axios";
import axiosInstance from "./axiosConfig";
import { API_BASE_URL } from "./config";

interface AuthResponse {
    success: boolean;
    message?: string;
    accessToken?: string;
    refreshToken?: string;
    data?: {
        requiresTwoFactor?: boolean;
        twoFactorToken?: string;
        accessToken?: string;
        refreshToken?: string;
    };
}

export const loginUser = async (username: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/login`,
            { username, password },
            {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const responseData = response.data?.data;

        // Check if response contains 2FA requirement
        if (responseData?.requiresTwoFactor && responseData?.twoFactorToken) {
            return {
                success: true,
                data: {
                    requiresTwoFactor: true,
                    twoFactorToken: responseData.twoFactorToken
                }
            };
        }

        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Login failed. Please try again."
        };
    }
};

export const registerUser = async (
    email: string,
    username: string,
    password: string,
    confirmPassword: string
): Promise<AuthResponse> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/register`,
            { email, username, password, confirmPassword },
            {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            }
        );

        return { success: true, message: "Registration successful! Please log in." };
    } catch (error: any) {
        const errorMessage = error.response?.data?.errors
            ? Object.values(error.response.data.errors).flat().join(', ')
            : error.response?.data?.message || "Registration failed. Please try again.";

        return { success: false, message: errorMessage };
    }
};

export const logoutUser = async (): Promise<void> => {
    try {
        await axios.post(
            `${API_BASE_URL}/logout`,
            {},
            { withCredentials: true }
        );

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    } catch (error) {
        console.error("Logout error:", error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
};

export const refreshToken = async (): Promise<AuthResponse> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/refresh`,
            {},
            { withCredentials: true }
        );

        console.log('refreshToken response:', response.status, response.data);
        return { success: true };
    } catch (error: any) {
        console.error('refreshToken failed:', error.response?.status, error.response?.data, error.message);
        return { success: false, message: "Session expired. Please log in again." };
    }
};