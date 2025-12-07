import React, { useState, useEffect } from 'react';
import { begin2FASetup, confirm2FASetup } from '../../utils/Api/TwoFactor';
import RecoveryCodesModal from './RecoveryCodesModal';
import './TwoFactorSetup.css';

interface TwoFactorSetupProps {
    onComplete: () => void;
    onCancel: () => void;
}

function TwoFactorSetup({ onComplete, onCancel }: TwoFactorSetupProps) {
    const [step, setStep] = useState<'loading' | 'qr' | 'verify' | 'codes'>('loading');
    const [qrCode, setQrCode] = useState('');
    const [manualKey, setManualKey] = useState('');
    const [setupToken, setSetupToken] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        initializeSetup();
    }, []);

    const initializeSetup = async () => {
        try {
            const result = await begin2FASetup();

            // Handle both string (already base64) and array (byte array) formats
            let qrCodeDataUrl = '';
            const qrCodeData: any = result.qrCode;

            if (typeof qrCodeData === 'string') {
                // Backend returns base64 string
                qrCodeDataUrl = qrCodeData.startsWith('data:image')
                    ? qrCodeData
                    : `data:image/png;base64,${qrCodeData}`;
            } else if (Array.isArray(qrCodeData) && qrCodeData.length > 0) {
                // Convert byte array to base64 image
                const uint8Array = new Uint8Array(qrCodeData);
                let binaryString = '';
                for (let i = 0; i < uint8Array.length; i++) {
                    binaryString += String.fromCharCode(uint8Array[i]);
                }
                const base64String = btoa(binaryString);
                qrCodeDataUrl = `data:image/png;base64,${base64String}`;
            } else {
                setError('Invalid QR code format received from server');
                setStep('qr');
                return;
            }

            setQrCode(qrCodeDataUrl);
            setManualKey(result.manualEntryKey);
            setSetupToken(result.setupToken);
            setStep('qr');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to initialize 2FA setup');
            setStep('qr');
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!verificationCode.trim() || verificationCode.length !== 6) {
            setError('Please enter a valid 6-digit code');
            setIsLoading(false);
            return;
        }

        try {
            const result = await confirm2FASetup(setupToken, verificationCode);
            setRecoveryCodes(result.recoveryCodes);
            setStep('codes');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
            setVerificationCode('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodesConfirmed = () => {
        onComplete();
    };

    if (step === 'loading') {
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <p>Setting up two-factor authentication...</p>
                </div>
            </div>
        );
    }

    if (step === 'codes') {
        return (
            <RecoveryCodesModal
                recoveryCodes={recoveryCodes}
                onClose={handleCodesConfirmed}
            />
        );
    }

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content modal-content-large" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Set Up Two-Factor Authentication</h2>

                {step === 'qr' && (
                    <>
                        <div className="setup-step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Scan QR Code</h3>
                                <p>Use your authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.) to scan this QR code:</p>
                                {qrCode && (
                                    <div className="qr-container">
                                        <img src={qrCode} alt="2FA QR Code" className="qr-code" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="setup-step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Manual Entry</h3>
                                <p>Can't scan? Enter this code manually:</p>
                                <div className="manual-key">{manualKey}</div>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep('verify')}
                            className="modal-btn modal-btn-primary"
                        >
                            Next: Verify Code
                        </button>

                        <button onClick={onCancel} className="modal-btn modal-btn-text">
                            Cancel
                        </button>
                    </>
                )}

                {step === 'verify' && (
                    <>
                        <div className="setup-step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Verify Code</h3>
                                <p>Enter the 6-digit code from your authenticator app to complete setup:</p>

                                {error && (
                                    <div className="error-message">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleVerify} className="verify-form">
                                    <input
                                        type="text"
                                        className="verify-input"
                                        placeholder="000000"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        maxLength={6}
                                        autoFocus
                                        disabled={isLoading}
                                        required
                                    />

                                    <div className="modal-actions">
                                        <button
                                            type="button"
                                            onClick={() => setStep('qr')}
                                            className="modal-btn modal-btn-secondary"
                                            disabled={isLoading}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="modal-btn modal-btn-primary"
                                            disabled={isLoading || verificationCode.length !== 6}
                                        >
                                            {isLoading ? 'Verifying...' : 'Verify & Enable'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default TwoFactorSetup;
