import React, { FormEvent, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AutostackLogo from '../images/AutostackLogo.png';
import '../css/TwoFactorVerify.css';

interface LocationState {
    from?: string;
}

function TwoFactorVerify() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [useRecoveryCode, setUseRecoveryCode] = useState(false);

    const { twoFactorRequired, verifyTwoFactor } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state as LocationState | null;
    const from = state?.from || '/';

    // Redirect if not in 2FA flow
    if (!twoFactorRequired) {
        return <Navigate to="/login" replace />;
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!code.trim()) {
            setError('Please enter a verification code');
            setIsLoading(false);
            return;
        }

        try {
            const result = await verifyTwoFactor(code, useRecoveryCode);

            if (result.success) {
                navigate(from, { replace: true });
            } else {
                setError(result.message || 'Invalid verification code');
                setCode(''); // Clear the code field on error
            }
        } catch (err: any) {
            console.error('2FA verification error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleRecoveryMode = () => {
        setUseRecoveryCode(!useRecoveryCode);
        setCode('');
        setError('');
    };

    return (
        <div className="twofactor-verify">
            <div className="twofactor-verify-card">
                <img className="twofactor-verify-img" src={AutostackLogo} alt="Autostack Logo" />

                <h1 className="twofactor-verify-title">Two-Factor Authentication</h1>

                <p className="twofactor-verify-subtitle">
                    {useRecoveryCode
                        ? 'Enter one of your recovery codes'
                        : 'Enter the 6-digit code from your authenticator app'}
                </p>

                {error && (
                    <div className="twofactor-verify-error">
                        {error}
                    </div>
                )}

                <form className="twofactor-verify-form" onSubmit={handleSubmit}>
                    <div className="twofactor-verify-field">
                        <label htmlFor="code">
                            {useRecoveryCode ? 'Recovery Code' : 'Verification Code'}
                        </label>
                        <input
                            id="code"
                            name="code"
                            type="text"
                            placeholder={useRecoveryCode ? 'XXXX-XXXX-XX' : '000000'}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            disabled={isLoading}
                            autoComplete="off"
                            autoFocus
                            maxLength={useRecoveryCode ? 12 : 6}
                            required
                        />
                    </div>

                    <button type="submit" className="twofactor-verify-btn" disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Verify'}
                    </button>

                    <div className="twofactor-verify-links">
                        <button
                            type="button"
                            className="twofactor-verify-toggle"
                            onClick={toggleRecoveryMode}
                            disabled={isLoading}
                        >
                            {useRecoveryCode
                                ? 'Use authenticator app instead'
                                : "Can't access your app? Use a recovery code"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TwoFactorVerify;
