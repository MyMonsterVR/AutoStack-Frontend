import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { forgotPassword } from '../utils/Api/Auth';
import AutostackLogo from '../images/AutostackLogo.png';
import '../css/ForgotPassword.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email) {
            setError('Please enter your email address.');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);

        try {
            const result = await forgotPassword(email);

            if (result.success) {
                setSuccess(result.message || 'Password reset email sent successfully. Please check your inbox.');
                setEmail('');
            } else {
                setError(result.message || 'Failed to send password reset email. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-container">
                <NavLink to="/">
                    <img className="forgot-password-img" src={AutostackLogo} alt="Autostack Logo" />
                </NavLink>

                <h1>Forgot Password</h1>
                <p className="forgot-password-description">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {error && (
                    <div style={{
                        color: '#ef4444',
                        backgroundColor: '#ef444420',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        border: '1px solid #ef4444'
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="forgot-password-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            disabled={loading}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="back-to-login">
                    <a href="/login">Back to Login</a>
                </div>
            </div>
        </div>
    );
}