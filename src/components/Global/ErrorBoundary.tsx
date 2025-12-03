import React, { Component, ReactNode } from 'react';
import '../../css/ErrorBoundary.css';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h1 className="error-boundary-title">
                        Something went wrong
                    </h1>
                    <p className="error-boundary-message">
                        We're sorry for the inconvenience. Please try refreshing the page.
                    </p>
                    <div className="error-boundary-buttons">
                        <button
                            onClick={this.handleReset}
                            className="error-boundary-btn error-boundary-btn-primary"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="error-boundary-btn error-boundary-btn-secondary"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
