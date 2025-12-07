import apiClient from './axiosConfig';

// API Response Types
export interface BeginSetupResponse {
    setupToken: string;
    manualEntryKey: string;
    qrCode: number[]; // byte array from backend
}

export interface ConfirmSetupResponse {
    recoveryCodes: string[];
}

export interface TwoFactorStatusResponse {
    isEnabled: boolean;
    enabledAt: string | null;
    recoveryCodesRemaining: number;
}

export interface VerifyLoginResponse {
    requiresTwoFactor: boolean;
    twoFactorToken: string | null;
    accessToken: string | null;
    refreshToken: string | null;
}

export interface RegenerateRecoveryCodesResponse {
    recoveryCodes: string[];
}

// API Functions

/**
 * Begin 2FA setup - generates secret and QR code
 * Requires authentication
 */
export const begin2FASetup = async (): Promise<BeginSetupResponse> => {
    const response = await apiClient.post<{ success: boolean; data: BeginSetupResponse }>('/2fa/setup/begin');
    return response.data.data;
};

/**
 * Confirm 2FA setup with TOTP code
 * Requires authentication
 */
export const confirm2FASetup = async (setupToken: string, totpCode: string): Promise<ConfirmSetupResponse> => {
    const response = await apiClient.post<{ success: boolean; data: ConfirmSetupResponse }>('/2fa/setup/confirm', {
        setupToken,
        totpCode
    });
    return response.data.data;
};

/**
 * Get current 2FA status for authenticated user
 * Requires authentication
 */
export const get2FAStatus = async (): Promise<TwoFactorStatusResponse> => {
    const response = await apiClient.get<{ success: boolean; data: TwoFactorStatusResponse }>('/2fa/status');
    return response.data.data;
};

/**
 * Verify TOTP code during login
 * No authentication required (uses temporary 2FA token)
 */
export const verify2FALogin = async (
    twoFactorToken: string,
    code: string
): Promise<VerifyLoginResponse> => {
    const response = await apiClient.post<{ success: boolean; data: VerifyLoginResponse }>('/2fa/verify', {
        twoFactorToken,
        code
    });
    return response.data.data;
};

/**
 * Verify recovery code during login
 * No authentication required (uses temporary 2FA token)
 */
export const verify2FARecovery = async (
    twoFactorToken: string,
    recoveryCode: string
): Promise<VerifyLoginResponse> => {
    const response = await apiClient.post<{ success: boolean; data: VerifyLoginResponse }>('/2fa/verify/recovery', {
        twoFactorToken,
        recoveryCode
    });
    return response.data.data;
};

/**
 * Disable 2FA for current user
 * Requires authentication and rate limited
 */
export const disable2FA = async (password: string, totpCode: string): Promise<void> => {
    await apiClient.post('/2fa/disable', {
        userId: '', // Will be extracted from JWT by backend
        password,
        totpCode
    });
};

/**
 * Regenerate recovery codes
 * Requires authentication and rate limited
 */
export const regenerateRecoveryCodes = async (
    password: string,
    totpCode: string
): Promise<RegenerateRecoveryCodesResponse> => {
    const response = await apiClient.post<{ success: boolean; data: RegenerateRecoveryCodesResponse }>(
        '/2fa/recovery-codes/regenerate',
        {
            userId: '', // Will be extracted from JWT by backend
            password,
            totpCode
        }
    );
    return response.data.data;
};
