import React, { FormEvent } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Login.css';
import AutostackLogo from '../images/AutostackLogo.png';

function Login () {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("login");
        // TODO: login logic
    }

    return (
        <div className="login">
            <div className="login-card">

                <NavLink to="/"><img className="login-img" src={AutostackLogo} alt="Autostack Logo"/></NavLink>

                <h1 className="login-title">Login</h1>

                <p className="login-subtitle">Sign in to your AutoStack account</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label htmlFor="username">Username</label>
                        <input id="username" name="username" type="text" placeholder="Enter username" required/>
                    </div>

                    <div className="login-field">
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" placeholder="Enter password" required/>
                    </div>

                    <button type="submit" className="login-btn">Sign In</button>

                    <div className="login-links">
                        <NavLink to="/Register" className="nav-link">Don't have an account? Sign up</NavLink>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default Login;
