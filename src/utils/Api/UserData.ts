import axios from "axios";
import { GUID } from "../global";
import axiosInstance from "./axiosConfig";
import { API_BASE_URL } from "./config";

interface UserDataResponse {
    success: boolean;
    data?: {
        id: GUID;
        email: string;
        username: string;
        avatarUrl: string;
    };
    message?: string;
}

export const fetchUserData = async (): Promise<UserDataResponse> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/user/me`);
        const payload = response.data?.data ?? {};
        return {
            success: true,
            data: payload
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch user data."
        };
    }
};

export const editUser = async (userData: {
    username?: string;
    email?: string;
    avatarUrl?: string;
    currentPassword?: string | null;
    newPassword?: string | null;
    confirmNewPassword?: string | null;
}): Promise<UserDataResponse> => {
    try {
        const response = await axiosInstance.patch(`${API_BASE_URL}/user/edit`, userData);
        return {
            success: true,
            data: response.data?.data
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to update user data."
        };
    }
};

