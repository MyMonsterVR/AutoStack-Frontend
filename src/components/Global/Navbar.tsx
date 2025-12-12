import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AutostackLogo from '../../images/AutostackLogo.png';
import '../../css/Navbar.css';

function Navbar() {
    const { isAuthenticated, isLoading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const nav = document.querySelector('.navbar');
            if (nav && !nav.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMenuOpen]);

    return (
        <header className="navbar">
            <div className="navbar-content">
                <div className="navbar-left">
                    <NavLink to="/">
                        <img className="navbar-img" src={AutostackLogo} alt="Autostack Logo"/>
                    </NavLink>
                </div>
                <button
                    className="burger-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                >
                    <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
                    <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
                    <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
                </button>
                <div className={`navbar-right ${isMenuOpen ? 'menu-open' : ''}`}>
                    <ul className="navbar-links">
                        <li>
                            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/BrowseStacks" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>Stacks</NavLink>
                        </li>
                        <li>
                            <NavLink to="/Download" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>Download</NavLink>
                        </li>

                        {isLoading ? (
                            <>
                                <li><div className="nav-skeleton" /></li>
                                <li><div className="nav-skeleton" /></li>
                            </>
                        ) : !isAuthenticated ? (
                            <>
                                <li>
                                    <NavLink to="/Login" className="nav-link nav-link-signin">Sign in</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/Register" className="nav-link">Register</NavLink>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <NavLink to="/Dashboard" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>Dashboard</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/CreateStack" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>Create Stack</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/MyAccount" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>Profile</NavLink>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="nav-link nav-logout-btn"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
