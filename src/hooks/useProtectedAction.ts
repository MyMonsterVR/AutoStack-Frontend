import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedActionError {
    response?: {
        status: number;
        data?: {
            message?: string;
        };
    };
}

export const useProtectedAction = () => {
    const { user } = useAuth();
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => Promise<unknown>) | null>(null);

    const executeProtected = useCallback(async <T,>(action: () => Promise<T>): Promise<T | null> => {
        try {
            const result = await action();
            return result;
        } catch (error) {
            const err = error as ProtectedActionError;

            if (err.response?.status === 403) {
                // Store the action to retry after verification
                setPendingAction(() => action);
                setShowVerificationModal(true);
                return null;
            }

            // Re-throw if it's not a 403 error
            throw error;
        }
    }, []);

    const handleVerificationComplete = useCallback(async () => {
        setShowVerificationModal(false);

        // Retry the pending action if there is one
        if (pendingAction) {
            try {
                await pendingAction();
            } catch (error) {
                console.error('Error retrying action after verification:', error);
            } finally {
                setPendingAction(null);
            }
        }
    }, [pendingAction]);

    const handleModalClose = useCallback(() => {
        setShowVerificationModal(false);
        setPendingAction(null);
    }, []);

    return {
        executeProtected,
        showVerificationModal,
        handleVerificationComplete,
        handleModalClose,
        userId: user?.id || ''
    };
};
