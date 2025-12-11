import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../utils/Api/Auth';
import AutostackLogo from '../images/AutostackLogo.png';
import '../css/ResetPassword.css';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Get token from URL query parameters without decoding + signs
        const queryString = window.location.search;
        const match = queryString.match(/[?&]token=([^&]*)/);
        if (match && match[1]) {
            // Decode URL encoding but preserve + signs by using decodeURIComponent
            // which treats + as a literal character (unlike searchParams.get which treats + as space)
            const tokenFromUrl = decodeURIComponent(match[1]);
            setToken(tokenFromUrl);
        } else {
            setError('Invalid or missing reset token. Please request a new password reset.');
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!token) {
            setError('Invalid reset token.');
            return;
        }

        if (!newPassword || !confirmNewPassword) {
            setError('Please fill in all fields.');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const result = await resetPassword(token, newPassword, confirmNewPassword);

            if (result.success) {
                setSuccess('Password reset successfully! Redirecting to login...');
                setNewPassword('');
                setConfirmNewPassword('');

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(result.message || 'Failed to reset password. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-page">
            <div className="reset-password-container">
                <NavLink to="/">
                    <img className="reset-password-img" src={AutostackLogo} alt="Autostack Logo" />
                </NavLink>

                <h1>Reset Password</h1>
                <p className="reset-password-description">
                    Enter your new password below.
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="reset-password-form">
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            disabled={loading || !token}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmNewPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder="Confirm new password"
                            disabled={loading || !token}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading || !token}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

