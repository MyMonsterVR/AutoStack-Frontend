import React, { FormEvent, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AutostackLogo from '../images/AutostackLogo.png';
import '../css/Register.css';

function Register() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const form = e.currentTarget;
        const formData = new FormData(form);
        const username = formData.get('username') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        // Validation
        if (!email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            setIsLoading(false);
            return;
        }

        try {
            const result = await register(email, username, password, confirmPassword);

            if (result.success) {
                navigate('/Login', {
                    state: { message: 'Registration successful! Please log in.' }
                });
            } else {
                setError(result.message || 'Registration failed. Please try again.');
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register">
            <div className="register-card">
                <NavLink to="/">
                    <img className="register-img" src={AutostackLogo} alt="Autostack Logo" />
                </NavLink>

                <h1 className="register-title">Register</h1>

                <p className="register-subtitle">Create your AutoStack account</p>

                {error && (
                    <div style={{
                        color: '#d32f2f',
                        backgroundColor: '#ffebee',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="register-field">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Enter username"
                            disabled={isLoading}
                            minLength={3}
                            required
                        />
                    </div>

                    <div className="register-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter email"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="register-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            disabled={isLoading}
                            minLength={8}
                            required
                        />
                    </div>

                    <div className="register-field">
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm password"
                            disabled={isLoading}
                            minLength={8}
                            required
                        />
                    </div>

                    <button type="submit" className="register-btn" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>

                    <div className="register-links">
                        <NavLink to="/Login" className="nav-link">
                            Have an account? Sign in
                        </NavLink>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
