import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Register.css';          // NEW CSS FILE
import AutostackLogo from '../images/AutostackLogo.png';

function Register() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: registration logic
    }

    return (
        <div className="register">
            <div className="register-card">

                <NavLink to="/"><img className="register-img" src={AutostackLogo} alt="Autostack Logo"/></NavLink>

                <h1 className="register-title">Register</h1>
                <p className="register-subtitle">Create your AutoStack account</p>

                <form className="register-form" onSubmit={handleSubmit}>

                    <div className="register-field">
                        <label htmlFor="username">Username</label>
                        <input id="username" type="text" placeholder="Enter username" required/>
                    </div>

                    <div className="register-field">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" placeholder="Enter email" required/>
                    </div>

                    <div className="register-field">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" placeholder="Enter password" required/>
                    </div>

                    <div className="register-field">
                        <label htmlFor="ConfirmPassword">Confirm password</label>
                        <input id="ConfirmPassword" type="password" placeholder="Confirm password" required/>
                    </div>

                    <button type="submit" className="register-btn">Create Account</button>

                    <div className="register-links">
                        <NavLink to="/Login">Have an account? Sign in</NavLink>
                    </div>

                </form>

            </div>
        </div>
    );
}

export default Register;
