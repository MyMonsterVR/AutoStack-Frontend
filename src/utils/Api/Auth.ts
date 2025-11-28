import axios from "axios";

const API_BASE_URL = "https://autostack.dk/api";

interface AuthResponse {
    success: boolean;
    message?: string;
    accessToken?: string;
    refreshToken?: string;
}

export const loginUser = async (username: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/login`,
            { username, password },
            {
                withCredentials: true, // Important: send/receive cookies
                headers: { 'Content-Type': 'application/json' }
            }
        );

        return {
            success: true,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken
        };
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
    } catch (error) {
        console.error("Logout error:", error);
    }
};

export const refreshToken = async (): Promise<AuthResponse> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/refresh`,
            {},
            { withCredentials: true }
        );

        return {
            success: true,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken
        };
    } catch (error: any) {
        return { success: false, message: "Session expired. Please log in again." };
    }
};