export const sanitizeErrorMessage = (error: any): string => {
    if (typeof error === 'string') {
        return error;
    }

    if (error?.response?.data?.message) {
        return error.response.data.message;
    }

    if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (typeof errors === 'object') {
            const messages = Object.values(errors)
                .flat()
                .filter(msg => typeof msg === 'string')
                .join(', ');
            return messages || 'An error occurred';
        }
    }

    if (error?.message) {
        const msg = error.message.toLowerCase();
        if (msg.includes('network')) {
            return 'Network error. Please check your connection.';
        }
        if (msg.includes('timeout')) {
            return 'Request timed out. Please try again.';
        }
        return error.message;
    }

    return 'An unexpected error occurred';
};

export const isNetworkError = (error: any): boolean => {
    return error?.message?.toLowerCase().includes('network') ||
           error?.code === 'NETWORK_ERROR' ||
           !navigator.onLine;
};
