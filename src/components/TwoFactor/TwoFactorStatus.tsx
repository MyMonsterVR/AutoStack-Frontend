import React, { useState, useEffect } from 'react';
import { get2FAStatus, disable2FA, regenerateRecoveryCodes } from '../../utils/Api/TwoFactor';
import TwoFactorSetup from './TwoFactorSetup';
import RecoveryCodesModal from './RecoveryCodesModal';
import './TwoFactorSetup.css';

interface TwoFactorStatusProps {
    onStatusChange?: () => void;
}

function TwoFactorStatus({ onStatusChange }: TwoFactorStatusProps) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [enabledAt, setEnabledAt] = useState<string | null>(null);
    const [recoveryCodesRemaining, setRecoveryCodesRemaining] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showSetup, setShowSetup] = useState(false);
    const [showDisable, setShowDisable] = useState(false);
    const [showRegenerate, setShowRegenerate] = useState(false);
    const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Disable form state
    const [disablePassword, setDisablePassword] = useState('');
    const [disableTotpCode, setDisableTotpCode] = useState('');
    const [isDisabling, setIsDisabling] = useState(false);

    // Regenerate form state
    const [regeneratePassword, setRegeneratePassword] = useState('');
    const [regenerateTotpCode, setRegenerateTotpCode] = useState('');
    const [isRegenerating, setIsRegenerating] = useState(false);

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            const status = await get2FAStatus();
            setIsEnabled(status.isEnabled);
            setEnabledAt(status.enabledAt);
            setRecoveryCodesRemaining(status.recoveryCodesRemaining);
        } catch (err) {
            console.error('Failed to load 2FA status:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetupComplete = () => {
        setShowSetup(false);
        setSuccess('Two-factor authentication has been enabled successfully!');
        loadStatus();
        onStatusChange?.();
    };

    const handleDisable = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsDisabling(true);

        try {
            await disable2FA(disablePassword, disableTotpCode);
            setShowDisable(false);
            setDisablePassword('');
            setDisableTotpCode('');
            setSuccess('Two-factor authentication has been disabled');
            loadStatus();
            onStatusChange?.();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to disable 2FA');
        } finally {
            setIsDisabling(false);
        }
    };

    const handleRegenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsRegenerating(true);

        try {
            const result = await regenerateRecoveryCodes(regeneratePassword, regenerateTotpCode);
            setRecoveryCodes(result.recoveryCodes);
            setShowRegenerate(false);
            setRegeneratePassword('');
            setRegenerateTotpCode('');
            setShowRecoveryCodes(true);
            loadStatus();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to regenerate recovery codes');
        } finally {
            setIsRegenerating(false);
        }
    };

    if (isLoading) {
        return <div>Loading 2FA status...</div>;
    }

    return (
        <div className="twofactor-status">
            {error && (
                <div className="status-message status-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="status-message status-success">
                    {success}
                </div>
            )}

            <div className="status-info">
                <div className="status-row">
                    <span className="status-label">Status:</span>
                    <span className={`status-badge ${isEnabled ? 'status-enabled' : 'status-disabled'}`}>
                        {isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                </div>

                {isEnabled && enabledAt && (
                    <div className="status-row">
                        <span className="status-label">Enabled since:</span>
                        <span className="status-value">{new Date(enabledAt).toLocaleString()}</span>
                    </div>
                )}

                {isEnabled && (
                    <div className="status-row">
                        <span className="status-label">Recovery codes remaining:</span>
                        <span className={`status-value ${recoveryCodesRemaining < 3 ? 'status-warning' : ''}`}>
                            {recoveryCodesRemaining}
                            {recoveryCodesRemaining < 3 && ' (Consider regenerating)'}
                        </span>
                    </div>
                )}
            </div>

            <div className="status-actions">
                {!isEnabled ? (
                    <button onClick={() => setShowSetup(true)} className="status-btn status-btn-primary">
                        Enable Two-Factor Authentication
                    </button>
                ) : (
                    <>
                        <button onClick={() => setShowRegenerate(true)} className="status-btn status-btn-secondary">
                            Regenerate Recovery Codes
                        </button>
                        <button onClick={() => setShowDisable(true)} className="status-btn status-btn-danger">
                            Disable 2FA
                        </button>
                    </>
                )}
            </div>

            {showSetup && (
                <TwoFactorSetup
                    onComplete={handleSetupComplete}
                    onCancel={() => setShowSetup(false)}
                />
            )}

            {showDisable && (
                <div className="modal-overlay" onClick={() => setShowDisable(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Disable Two-Factor Authentication</h2>
                        <p className="modal-subtitle">Enter your password and current TOTP code to disable 2FA</p>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleDisable} className="verify-form">
                            <div className="form-field">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={disablePassword}
                                    onChange={(e) => setDisablePassword(e.target.value)}
                                    disabled={isDisabling}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Verification Code</label>
                                <input
                                    type="text"
                                    className="verify-input"
                                    placeholder="000000"
                                    value={disableTotpCode}
                                    onChange={(e) => setDisableTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength={6}
                                    disabled={isDisabling}
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowDisable(false)}
                                    className="modal-btn modal-btn-secondary"
                                    disabled={isDisabling}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="modal-btn modal-btn-danger"
                                    disabled={isDisabling}
                                >
                                    {isDisabling ? 'Disabling...' : 'Disable 2FA'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showRegenerate && (
                <div className="modal-overlay" onClick={() => setShowRegenerate(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Regenerate Recovery Codes</h2>
                        <p className="modal-subtitle">
                            This will invalidate all existing recovery codes and generate new ones.
                        </p>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleRegenerate} className="verify-form">
                            <div className="form-field">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={regeneratePassword}
                                    onChange={(e) => setRegeneratePassword(e.target.value)}
                                    disabled={isRegenerating}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Verification Code</label>
                                <input
                                    type="text"
                                    className="verify-input"
                                    placeholder="000000"
                                    value={regenerateTotpCode}
                                    onChange={(e) => setRegenerateTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength={6}
                                    disabled={isRegenerating}
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowRegenerate(false)}
                                    className="modal-btn modal-btn-secondary"
                                    disabled={isRegenerating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="modal-btn modal-btn-primary"
                                    disabled={isRegenerating}
                                >
                                    {isRegenerating ? 'Generating...' : 'Generate New Codes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showRecoveryCodes && (
                <RecoveryCodesModal
                    recoveryCodes={recoveryCodes}
                    onClose={() => {
                        setShowRecoveryCodes(false);
                        setSuccess('Recovery codes have been regenerated successfully');
                    }}
                />
            )}
        </div>
    );
}

export default TwoFactorStatus;
