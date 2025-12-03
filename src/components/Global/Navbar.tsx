import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AutostackLogo from '../../images/AutostackLogo.png';
import '../../css/Navbar.css';

function Navbar() {
    const { isAuthenticated, isLoading, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <header className="navbar">
            <div className="navbar-content">
                <div className="navbar-left">
                    <NavLink to="/">
                        <img className="navbar-img" src={AutostackLogo} alt="Autostack Logo"/>
                    </NavLink>
                </div>
                <div className="navbar-right">
                    <ul className="navbar-links">
                        <li>
                            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/BrowseStacks" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>Stacks</NavLink>
                        </li>
                        <li>
                            <NavLink to="/BrowseTemplates" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>Templates</NavLink>
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
                                        className="nav-link"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: 0
                                        }}
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
