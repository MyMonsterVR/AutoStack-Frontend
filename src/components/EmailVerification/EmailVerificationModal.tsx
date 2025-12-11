import React, { useState, useEffect, FormEvent } from 'react';
import Modal from '../Global/Modal';
import { verifyEmail, resendVerificationEmail } from '../../utils/Api/EmailVerification';
import '../../css/EmailVerificationModal.css';

interface EmailVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerified: () => void;
    userId: string;
}

export default function EmailVerificationModal({
    isOpen,
    onClose,
    onVerified,
    userId
}: EmailVerificationModalProps) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!code.trim()) {
            setError('Please enter a verification code');
            setIsLoading(false);
            return;
        }

        if (code.length !== 6) {
            setError('Verification code must be 6 digits');
            setIsLoading(false);
            return;
        }

        try {
            const result = await verifyEmail(userId, code);

            if (result.success) {
                setSuccess('Email verified successfully!');
                setTimeout(() => {
                    onVerified();
                }, 1500);
            } else {
                setError(result.message || 'Invalid verification code');
                setCode('');
            }
        } catch (err: any) {
            console.error('Email verification error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const result = await resendVerificationEmail(userId);

            if (result.success) {
                setSuccess('Verification email sent! Please check your inbox.');
                setResendCooldown(60); // 60 second cooldown
            } else {
                setError(result.message || 'Failed to resend verification email');
            }
        } catch (err: any) {
            console.error('Resend email error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Email Verification" size="sm">
            <div className="email-verify-modal">
                <button
                    className="email-verify-close"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    ×
                </button>

                <h2 className="email-verify-title">Verify Your Email</h2>
                <p className="email-verify-subtitle">
                    Enter the 6-digit code sent to your email address
                </p>
                <p className="email-verify-help">
                    Didn't receive the email? Check your spam folder or click "Resend Code" below.
                </p>

                {error && <div className="email-verify-error">{error}</div>}
                {success && <div className="email-verify-success">{success}</div>}

                <form className="email-verify-form" onSubmit={handleSubmit}>
                    <div className="email-verify-field">
                        <label htmlFor="code">Verification Code</label>
                        <input
                            id="code"
                            name="code"
                            type="text"
                            placeholder="000000"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            disabled={isLoading}
                            autoComplete="off"
                            autoFocus
                            maxLength={6}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="email-verify-btn"
                        disabled={isLoading || code.length !== 6}
                    >
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                    </button>

                    <div className="email-verify-resend">
                        <button
                            type="button"
                            className="email-verify-resend-btn"
                            onClick={handleResend}
                            disabled={isLoading || resendCooldown > 0}
                        >
                            {resendCooldown > 0
                                ? `Resend Code (${resendCooldown}s)`
                                : 'Resend Code'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
