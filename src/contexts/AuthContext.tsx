import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, logoutUser, refreshToken } from '../utils/Api/Auth';
import { fetchUserData } from '../utils/Api/UserData';
import { verify2FALogin, verify2FARecovery } from '../utils/Api/TwoFactor';
import {GUID} from "../utils/global";

type AuthState = 'initializing' | 'authenticated' | 'unauthenticated' | 'awaiting2fa';

// Global flag to prevent concurrent auth checks across component remounts
let isCheckingAuth = false;
let authCheckPromise: Promise<void> | null = null;

interface User {
    id: string;
    username: string;
    email: string;
    emailVerified: boolean;
}

interface AuthContextType {
    user: User | null;
    authState: AuthState;
    isAuthenticated: boolean;
    isLoading: boolean;
    twoFactorRequired: boolean;
    twoFactorToken: string | null;
    emailVerificationPending: boolean;
    pendingUserId: string | null;
    login: (username: string, password: string) => Promise<{ success: boolean; message?: string; requiresTwoFactor?: boolean }>;
    register: (email: string, username: string, password: string, confirmPassword: string) => Promise<{ success: boolean; message?: string; userId?: string }>;
    logout: () => Promise<void>;
    verifyTwoFactor: (code: string, isRecoveryCode?: boolean) => Promise<{ success: boolean; message?: string }>;
    setEmailVerificationPending: (pending: boolean, userId?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [authState, setAuthState] = useState<AuthState>('initializing');
    const [twoFactorToken, setTwoFactorToken] = useState<string | null>(null);
    const [emailVerificationPending, setEmailVerificationPending] = useState<boolean>(false);
    const [pendingUserId, setPendingUserId] = useState<string | null>(null);

    // Check authentication status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        // If an auth check is already in progress, wait for it instead of starting a new one
        if (isCheckingAuth && authCheckPromise) {
            await authCheckPromise;
            return;
        }

        isCheckingAuth = true;

        // Wrap the auth check in a promise that can be awaited
        authCheckPromise = (async () => {
            try {
                // Try to refresh token to verify authentication
                const result = await refreshToken();

                if (result.success) {
                    // Fetch user details so we persist session on reload
                    const me = await fetchUserData();

                    if (me.success && me.data) {
                        setUser({
                            id: me.data.id as GUID,
                            username: me.data.username,
                            email: me.data.email,
                            emailVerified: me.data.emailVerified || false
                        });
                        setAuthState('authenticated');
                    } else {
                        setUser(null);
                        setAuthState('unauthenticated');
                    }
                } else {
                    // Refresh token failed - this is normal if user isn't logged in
                    setUser(null);
                    setAuthState('unauthenticated');
                }
            } catch (error: any) {
                setUser(null);
                setAuthState('unauthenticated');
            } finally {
                isCheckingAuth = false;
                authCheckPromise = null;
            }
        })();

        await authCheckPromise;
    };

    const login = async (username: string, password: string) => {
        try {
            const result = await loginUser(username, password);
            if (result.success) {
                // Check if 2FA is required
                if (result.data?.requiresTwoFactor && result.data?.twoFactorToken) {
                    setTwoFactorToken(result.data.twoFactorToken);
                    setAuthState('awaiting2fa');
                    return { success: true, requiresTwoFactor: true };
                }

                // No 2FA required - fetch user details and complete login
                const me = await fetchUserData();
                if (me.success && me.data) {
                    setUser({
                        id: me.data.id as GUID,
                        username: me.data.username,
                        email: me.data.email,
                        emailVerified: me.data.emailVerified || false
                    });
                    setAuthState('authenticated');
                    return { success: true };
                }
                return { success: false, message: me.message || 'Failed to load user profile.' };
            }
            return { success: false, message: result.message };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    };

    const register = async (email: string, username: string, password: string, confirmPassword: string) => {
        try {
            const result = await registerUser(email, username, password, confirmPassword);
            if (result.success) {
                // Registration successful - extract userId if available
                const userId = result.data?.userId || result.data?.id;
                return { success: true, userId };
            }
            return { success: false, message: result.message };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
        setAuthState('unauthenticated');
        setTwoFactorToken(null);
    };

    const verifyTwoFactor = async (code: string, isRecoveryCode: boolean = false) => {
        if (!twoFactorToken) {
            return { success: false, message: 'No two-factor token available' };
        }

        try {
            const result = isRecoveryCode
                ? await verify2FARecovery(twoFactorToken, code)
                : await verify2FALogin(twoFactorToken, code);

            if (result.accessToken && result.refreshToken) {
                const me = await fetchUserData();
                if (me.success && me.data) {
                    setUser({
                        id: me.data.id as GUID,
                        username: me.data.username,
                        email: me.data.email,
                        emailVerified: me.data.emailVerified || false
                    });
                    setAuthState('authenticated');
                    setTwoFactorToken(null);
                    return { success: true };
                }
                return { success: false, message: me.message || 'Failed to load user profile.' };
            }

            return { success: false, message: 'Invalid verification code' };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || error.message || 'Verification failed' };
        }
    };

    const handleSetEmailVerificationPending = (pending: boolean, userId?: string) => {
        setEmailVerificationPending(pending);
        setPendingUserId(userId || null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            authState,
            isAuthenticated: authState === 'authenticated',
            isLoading: authState === 'initializing',
            twoFactorRequired: authState === 'awaiting2fa',
            twoFactorToken,
            emailVerificationPending,
            pendingUserId,
            login,
            register,
            logout,
            verifyTwoFactor,
            setEmailVerificationPending: handleSetEmailVerificationPending
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
