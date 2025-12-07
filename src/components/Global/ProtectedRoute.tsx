import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../css/Loading.css';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { authState } = useAuth();
    const location = useLocation();

    // Show loading spinner while auth is initializing
    if (authState === 'initializing') {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    // Redirect to login only if explicitly unauthenticated
    if (authState === 'unauthenticated') {
        return <Navigate to="/Login" state={{ from: location }} replace />;
    }

    // Redirect to 2FA verify if in the middle of 2FA flow
    if (authState === 'awaiting2fa') {
        return <Navigate to="/2fa/verify" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
