import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Global/Navbar';
import BrowseStacks from './pages/BrowseStacks';
import Home from './pages/Home';
import Login from './pages/Login';
import MyAccount from './pages/MyAccount';
import MyStacks from './pages/MyStacks';
import Register from './pages/Register';
import UploadStacks from './pages/UploadStacks';
import Footer from './components/Global/Footer';
import { addToStacks, StackInfo } from "./utils/storedStacks"

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

    for(const stackInfo of stackInfoTest)
    {
        addToStacks(stackInfo.id, stackInfo);
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
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/MyAccount" element={<MyAccount />} />
                <Route path="/MyStacks" element={<MyStacks />} />
                <Route path="/UploadStacks" element={<UploadStacks />} />
            </Routes>

            {!shouldHideLayout && <Footer />}
        </>
    );
}

export default App;