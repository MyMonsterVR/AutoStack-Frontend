import React, { useState } from 'react';
import { resendVerificationEmail } from '../../utils/Api/EmailVerification';
import '../../css/EmailVerificationBanner.css';

interface EmailVerificationBannerProps {
    onVerifyClick: () => void;
    userId: string;
}

export default function EmailVerificationBanner({ onVerifyClick, userId }: EmailVerificationBannerProps) {
    const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [resendMessage, setResendMessage] = useState('');

    const handleResend = async () => {
        setResendStatus('sending');
        setResendMessage('');

        try {
            const result = await resendVerificationEmail(userId);

            if (result.success) {
                setResendStatus('success');
                setResendMessage('Verification email sent! Check your inbox.');
                setTimeout(() => {
                    setResendStatus('idle');
                    setResendMessage('');
                }, 5000);
            } else {
                setResendStatus('error');
                setResendMessage(result.message || 'Failed to resend email');
                setTimeout(() => {
                    setResendStatus('idle');
                    setResendMessage('');
                }, 5000);
            }
        } catch (err) {
            setResendStatus('error');
            setResendMessage('An error occurred. Please try again.');
            setTimeout(() => {
                setResendStatus('idle');
                setResendMessage('');
            }, 5000);
        }
    };

    return (
        <div className="email-verify-banner">
            <div className="email-verify-banner-content">
                <div className="email-verify-banner-icon">⚠️</div>
                <div className="email-verify-banner-text">
                    <h3>Your email is not verified</h3>
                    <p>Verify your email to access all features including creating stacks, editing your profile, and enabling two-factor authentication.</p>
                    {resendMessage && (
                        <p className={`email-verify-banner-message ${resendStatus === 'success' ? 'success' : 'error'}`}>
                            {resendMessage}
                        </p>
                    )}
                </div>
            </div>
            <div className="email-verify-banner-actions">
                <button
                    className="email-verify-banner-btn primary"
                    onClick={onVerifyClick}
                >
                    Verify Now
                </button>
                <button
                    className="email-verify-banner-btn secondary"
                    onClick={handleResend}
                    disabled={resendStatus === 'sending'}
                >
                    {resendStatus === 'sending' ? 'Sending...' : 'Resend Email'}
                </button>
            </div>
        </div>
    );
}
