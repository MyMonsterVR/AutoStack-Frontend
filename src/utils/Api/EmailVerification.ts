import axiosInstance from './axiosConfig';

export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
}

export const verifyEmail = async (userId: string, code: string): Promise<ApiResponse> => {
    try {
        const response = await axiosInstance.post('/email-verification/verify', {
            userId,
            code
        });
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to verify email'
        };
    }
};

export const resendVerificationEmail = async (userId: string): Promise<ApiResponse> => {
    try {
        const response = await axiosInstance.post('/email-verification/resend', {
            userId
        });
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to resend verification email'
        };
    }
};
