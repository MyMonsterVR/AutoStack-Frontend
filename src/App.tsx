import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/Global/ProtectedRoute';
import './utils/Api/axiosConfig';
import './css/Loading.css';

import Navbar from './components/Global/Navbar';
import Footer from './components/Global/Footer';

import BrowseStacks from './pages/BrowseStacks';
import CreateStack from './pages/CreateStack';
import Dashboard from './pages/Dashboard';
import Download from "./pages/Download";
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Login from './pages/Login';
import MyAccount from './pages/MyAccount';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import StackInfoPage from './pages/StackInfo';
import TwoFactorVerify from './pages/TwoFactorVerify';

import { addToStacks } from "./utils/storedStacks";
import { fetchStacks, StackInfoType, StackResponseSuccess } from "./utils/Api/Stacks";

function App() {
    useEffect(() => {
        fetchStacks().then((res) => {
            if ('data' in res) {
                const result = res as StackResponseSuccess;
                result.data.items.forEach((stackInfo: StackInfoType) => {
                    addToStacks(stackInfo.id, stackInfo);
                });
            } else {
                console.error('fetchStacks returned an error response', res);
            }
        }).catch(err => {
            console.error('fetchStacks failed', err);
        });
    }, []);

    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

function AppContent() {
    const { authState } = useAuth();
    const location = useLocation();
    const hideLayoutOn = ["/Login", "/Register", "/2fa/verify", "/ForgotPassword", "/ResetPassword"];
    const shouldHideLayout = hideLayoutOn.includes(location.pathname);

    if (authState === 'initializing') {
        return (
            <div className="app-loading">
                <div className="loading-spinner" />
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <>
            {!shouldHideLayout && <Navbar />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/BrowseStacks" element={<BrowseStacks />} />
                <Route path="/ForgotPassword" element={<ForgotPassword />} />
                <Route path="/ResetPassword" element={<ResetPassword />} />
                <Route path="/Download" element={<Download />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/2fa/verify" element={<TwoFactorVerify />} />
                <Route path="/StackInfo/:id" element={<StackInfoPage />} />

                <Route path="/CreateStack" element={
                    <ProtectedRoute>
                        <CreateStack />
                    </ProtectedRoute>
                } />
                <Route path="/Dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/MyAccount" element={
                    <ProtectedRoute>
                        <MyAccount />
                    </ProtectedRoute>
                } />
            </Routes>
        </>
    );
}

export default App;
