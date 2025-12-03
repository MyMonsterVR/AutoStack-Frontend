import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/Global/ProtectedRoute';
import './utils/Api/axiosConfig';
import './css/Loading.css';

import Navbar from './components/Global/Navbar';
import Footer from './components/Global/Footer';

import BrowseStacks from './pages/BrowseStacks';
import BrowseTemplates from './pages/BrowseTemplates';
import CreateStack from './pages/CreateStack';
import Dashboard from './pages/Dashboard';
import Download from "./pages/Download";
import Home from './pages/Home';
import Login from './pages/Login';
import MyAccount from './pages/MyAccount';
import Register from './pages/Register';
import StackInfoPage from './pages/StackInfo';

import { addToStacks } from "./utils/storedStacks";
import { fetchStacks, StackInfoType, StackResponseSuccess } from "./utils/Api/Stacks";
import { addToTemplates, TemplateInfo } from "./utils/storedTemplates";

function App() {
    const templateInfoTest: TemplateInfo[] = [
        {
            id: 1,
            name: "mern",
            author: "mr bumbastic",
            authorImg: "https://example.com/johndoe.jpg",
            downloads: 1500,
            description: "Good description right?",
            type: "Fullstack"
        },
        {
            id: 2,
            name: "test",
            author: "mufinman",
            authorImg: "https://example.com/johndoe.jpg",
            downloads: 1100,
            description: "Another Good description right?",
            type: "Backend"
        },
        {
            id: 3,
            name: "React",
            author: "kasper",
            authorImg: "https://example.com/janedoe.jpg",
            downloads: 1500,
            description: "Good react description?",
            type: "Frontend"
        },
        {
            id: 4,
            name: "bumbo",
            author: "ole",
            authorImg: "https://example.com/janedoe.jpg",
            downloads: 1500,
            description: "ka-chow?",
            type: "Frontend"
        },
        {
            id: 5,
            name: "clat",
            author: "mememe",
            authorImg: "https://example.com/janedoe.jpg",
            downloads: 1500,
            description: "ka chikka?",
            type: "Frontend"
        }
    ];

    useEffect(() => {
        fetchStacks().then((res) => {
            if ('data' in res) {
                const success = res as StackResponseSuccess;
                success.data.items.forEach((stackInfo: StackInfoType) => {
                    addToStacks(stackInfo.id, stackInfo);
                });
            } else {
                console.error('fetchStacks returned an error response', res);
            }
        }).catch(err => {
            console.error('fetchStacks failed', err);
        });

        for (const templateInfo of templateInfoTest) {
            addToTemplates(templateInfo.id, templateInfo);
        }
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
    const hideLayoutOn = ["/Login", "/Register"];
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
                <Route path="/BrowseTemplates" element={<BrowseTemplates />} />
                <Route path="/Download" element={<Download />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
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

            {!shouldHideLayout && <Footer />}
        </>
    );
}

export default App;
