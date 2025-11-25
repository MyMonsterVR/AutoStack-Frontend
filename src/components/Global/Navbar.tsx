import React from 'react';
import { NavLink } from 'react-router-dom';
import AutostackLogo from '../../images/AutostackLogo.png';
import '../../css/Navbar.css';

function Navbar() {
    var isSignedIn = false; // Placeholder for future authentication logic

    return (
        <header className="navbar">
            <div className="navbar-content">
                <div className="navbar-left">
                        <NavLink to="/"><img className="navbar-img" src={AutostackLogo} alt="Autostack Logo"/></NavLink>
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

                        {!isSignedIn ? (
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
                                    <NavLink to="/MyAccount" className="nav-link">Profile</NavLink>
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