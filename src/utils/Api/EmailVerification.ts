import axiosInstance from './axiosConfig';

export interface VerifyEmailRequest {
    userId: string;
    code: string;
}

export interface ResendVerificationEmailRequest {
    userId: string;
}

export interface EmailVerificationStatusResponse {
    isVerified: boolean;
    verifiedAt: string | null;
    hasPendingCode: boolean;
    codeExpiresAt: string | null;
}

export interface ApiResponse<T = any> {
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

export const getEmailVerificationStatus = async (userId: string): Promise<ApiResponse<EmailVerificationStatusResponse>> => {
    try {
        const response = await axiosInstance.get(`/email-verification/status?userId=${userId}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to get verification status'
        };
    }
};
