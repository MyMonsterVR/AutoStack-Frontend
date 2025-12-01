import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, logoutUser, refreshToken } from '../utils/Api/Auth';
import { fetchUserData } from '../utils/Api/UserData';
import {GUID} from "../utils/global";

interface User {
    id: string;
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
    register: (email: string, username: string, password: string, confirmPassword: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
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
                        email: me.data.email
                    });
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
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
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
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
