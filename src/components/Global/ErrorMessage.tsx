import React from 'react';
import '../../css/ErrorMessage.css';

interface ErrorMessageProps {
    message: string;
    onDismiss?: () => void;
}

export default function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
    if (!message) return null;

    return (
        <div className="error-message">
            <span className="error-message-text">{message}</span>
            {onDismiss && (
                <button
                    className="error-message-dismiss"
                    onClick={onDismiss}
                    aria-label="Dismiss error"
                >
                    &times;
                </button>
            )}
        </div>
    );
}

export function SuccessMessage({ message, onDismiss }: ErrorMessageProps) {
    if (!message) return null;

    return (
        <div className="success-message">
            <span className="success-message-text">{message}</span>
            {onDismiss && (
                <button
                    className="success-message-dismiss"
                    onClick={onDismiss}
                    aria-label="Dismiss message"
                >
                    &times;
                </button>
            )}
        </div>
    );
}
