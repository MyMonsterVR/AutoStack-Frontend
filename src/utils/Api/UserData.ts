import axios from "axios";
import { GUID } from "../global";
import axiosInstance from "./axiosConfig";

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
        const response = await axiosInstance.get(
            `https://autostack.dk/api/user/me`
        );

        return {
            success: true,
            data: response.data.data
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch user data."
        };
    }
};
