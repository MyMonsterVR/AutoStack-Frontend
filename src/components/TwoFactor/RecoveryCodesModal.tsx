import React from 'react';
import './TwoFactorSetup.css';

interface RecoveryCodesModalProps {
    recoveryCodes: string[];
    onClose: () => void;
}

function RecoveryCodesModal({ recoveryCodes, onClose }: RecoveryCodesModalProps) {
    const handleDownload = () => {
        const content = `AutoStack Recovery Codes\nGenerated: ${new Date().toLocaleString()}\n\n${recoveryCodes.join('\n')}\n\nKeep these codes safe. Each code can only be used once.`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `autostack-recovery-codes-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(recoveryCodes.join('\n'));
            alert('Recovery codes copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('Failed to copy codes. Please copy manually.');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Recovery Codes</h2>
                <p className="modal-subtitle">
                    Save these recovery codes in a safe place. Each code can only be used once to access your account if you lose access to your authenticator app.
                </p>

                <div className="recovery-codes-container">
                    {recoveryCodes.map((code, index) => (
                        <div key={index} className="recovery-code">
                            {code}
                        </div>
                    ))}
                </div>

                <div className="modal-warning">
                    <strong>⚠️ Important:</strong> Store these codes securely. They won't be shown again.
                </div>

                <div className="modal-actions">
                    <button onClick={handleCopy} className="modal-btn modal-btn-secondary">
                        Copy All
                    </button>
                    <button onClick={handleDownload} className="modal-btn modal-btn-secondary">
                        Download
                    </button>
                    <button onClick={onClose} className="modal-btn modal-btn-primary">
                        I've Saved My Codes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RecoveryCodesModal;
