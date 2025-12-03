import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, logoutUser, refreshToken } from '../utils/Api/Auth';
import { fetchUserData } from '../utils/Api/UserData';
import {GUID} from "../utils/global";

type AuthState = 'initializing' | 'authenticated' | 'unauthenticated';

// Global flag to prevent concurrent auth checks across component remounts
let isCheckingAuth = false;
let authCheckPromise: Promise<void> | null = null;

interface User {
    id: string;
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    authState: AuthState;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
    register: (email: string, username: string, password: string, confirmPassword: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [authState, setAuthState] = useState<AuthState>('initializing');

    // Check authentication status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        console.log('[AuthContext] checkAuthStatus starting...');

        // If an auth check is already in progress, wait for it instead of starting a new one
        if (isCheckingAuth && authCheckPromise) {
            console.log('[AuthContext] Auth check already in progress, waiting for it...');
            await authCheckPromise;
            console.log('[AuthContext] Previous auth check completed, skipping duplicate');
            return;
        }

        isCheckingAuth = true;

        // Wrap the auth check in a promise that can be awaited
        authCheckPromise = (async () => {
            try {
                // Try to refresh token to verify authentication
                console.log('[AuthContext] Calling refreshToken...');
                const result = await refreshToken();
                console.log('[AuthContext] refreshToken result:', result);

                if (result.success) {
                    // Fetch user details so we persist session on reload
                    console.log('[AuthContext] Calling fetchUserData...');
                    const me = await fetchUserData();
                    console.log('[AuthContext] fetchUserData result:', me);

                    if (me.success && me.data) {
                        console.log('[AuthContext] Setting authenticated state with user:', me.data.username);
                        setUser({
                            id: me.data.id as GUID,
                            username: me.data.username,
                            email: me.data.email
                        });
                        setAuthState('authenticated');
                    } else {
                        console.log('[AuthContext] fetchUserData failed, setting unauthenticated');
                        setUser(null);
                        setAuthState('unauthenticated');
                    }
                } else {
                    console.log('[AuthContext] refreshToken failed, setting unauthenticated');
                    setUser(null);
                    setAuthState('unauthenticated');
                }
            } catch (error) {
                console.error('[AuthContext] checkAuthStatus error:', error);
                setUser(null);
                setAuthState('unauthenticated');
            } finally {
                isCheckingAuth = false;
                authCheckPromise = null;
                console.log('[AuthContext] checkAuthStatus completed');
            }
        })();

        await authCheckPromise;
    };

    const login = async (username: string, password: string) => {
        try {
            const result = await loginUser(username, password);
            if (result.success) {
                // Fetch user details after login
                const me = await fetchUserData();
                if (me.success && me.data) {
                    setUser({
                        id: me.data.id as GUID,
                        username: me.data.username,
                        email: me.data.email
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
                return { success: true };
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
    };

    return (
        <AuthContext.Provider value={{
            user,
            authState,
            isAuthenticated: authState === 'authenticated',
            isLoading: authState === 'initializing',
            login,
            register,
            logout
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
