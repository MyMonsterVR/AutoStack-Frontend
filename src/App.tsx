import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Global/Navbar';

import BrowseStacks from './pages/BrowseStacks';
import BrowseTemplates from './pages/BrowseTemplates';
import Home from './pages/Home';
import Login from './pages/Login';
import MyAccount from './pages/MyAccount';
import MyStacks from './pages/MyStacks';
import Register from './pages/Register';
import StackInfoPage from './pages/StackInfo';
import UploadStacks from './pages/UploadStacks';

import Footer from './components/Global/Footer';
import { addToStacks, StackInfo } from "./utils/storedStacks"
import { addToTemplates, TemplateInfo } from "./utils/storedTemplates"

function App() {
    const stackInfoTest: StackInfo[] = [
        {
            id: 1,
            name: "mern",
            author: "anton",
            authorImg: "https://example.com/johndoe.jpg",
            downloads: 1500,
            description: "Good description right?",
            type: "Fullstack"
        },
        {
            id: 2,
            name: "test",
            author: "John Moe",
            authorImg: "https://example.com/johndoe.jpg",
            downloads: 1100,
            description: "Another Good description right?",
            type: "Backend"
        },
        {
            id: 3,
            name: "React",
            author: "Jane Doe",
            authorImg: "https://example.com/janedoe.jpg",
            downloads: 1500,
            description: "Good react description?",
            type: "Frontend"
        },
        {
            id: 4,
            name: "bumbo",
            author: "Jane Doe",
            authorImg: "https://example.com/janedoe.jpg",
            downloads: 1500,
            description: "ka-chow?",
            type: "Frontend"
        },
        {
            id: 5,
            name: "clat",
            author: "Jane Doe",
            authorImg: "https://example.com/janedoe.jpg",
            downloads: 1500,
            description: "ka chikka?",
            type: "Frontend"
        }
    ]

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
    ]

    for(const stackInfo of stackInfoTest)
    {
        addToStacks(stackInfo.id, stackInfo);
    }

    for(const templateInfo of templateInfoTest)
    {
        addToTemplates(templateInfo.id, templateInfo);
    }

    const location = useLocation();

    const hideLayoutOn = ["/Login", "/Register"];

    const shouldHideLayout = hideLayoutOn.includes(location.pathname);

    return (
        <>
            {!shouldHideLayout && <Navbar />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/BrowseStacks" element={<BrowseStacks />} />
                <Route path="/BrowseTemplates" element={<BrowseTemplates />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/MyAccount" element={<MyAccount />} />
                <Route path="/MyStacks" element={<MyStacks />} />
                <Route path="/StackInfo/:id" element={<StackInfoPage />} />
                <Route path="/UploadStacks" element={<UploadStacks />} />
            </Routes>

            {!shouldHideLayout && <Footer />}
        </>
    );
}

export default App;