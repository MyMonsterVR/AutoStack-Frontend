import React, { FormEvent, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AutostackLogo from '../images/AutostackLogo.png';
import '../css/Login.css';

function Login() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || '/';

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const form = e.currentTarget;
        const formData = new FormData(form);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password');
            setIsLoading(false);
            return;
        }

        try {
            const result = await login(username, password);

            if (result.success) {
                // Check if 2FA is required
                if (result.requiresTwoFactor) {
                    navigate('/2fa/verify', { replace: true, state: { from } });
                } else {
                    navigate(from, { replace: true });
                }
            } else {
                setError(result.message || 'Login failed. Please check your credentials.');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="login-card">
                <NavLink to="/">
                    <img className="login-img" src={AutostackLogo} alt="Autostack Logo" />
                </NavLink>

                <h1 className="login-title">Login</h1>

                <p className="login-subtitle">Sign in to your AutoStack account</p>

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

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label htmlFor="username">Username</label>
                        <input id="username" name="username" type="text" placeholder="Enter username" disabled={isLoading} required/>
                    </div>

                    <div className="login-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <div className="login-links">
                        <NavLink to="/Register" className="nav-link">
                            Don't have an account? Sign up
                        </NavLink>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
