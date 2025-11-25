import { Component, type ReactNode, type ErrorInfo } from 'react';
import { ErrorMessage } from './common/ErrorMessage';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ padding: '2rem' }}>
          <ErrorMessage
            message="Something went wrong. Please try refreshing the page."
            onRetry={() => window.location.reload()}
            variant="page"
          />
          {this.state.error && (
            <details style={{ marginTop: '2rem', fontSize: '14px', color: '#6b7280' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                Error details
              </summary>
              <pre style={{
                background: '#f9fafb',
                padding: '1rem',
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {this.state.error.message}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
