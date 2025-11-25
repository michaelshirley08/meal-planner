import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  variant?: 'inline' | 'card' | 'page';
}

export function ErrorMessage({ message, onRetry, variant = 'card' }: ErrorMessageProps) {
  return (
    <div className={`error-message error-${variant}`} role="alert">
      <div className="error-icon">⚠</div>
      <div className="error-content">
        <p className="error-text">{message}</p>
        {onRetry && (
          <button className="error-retry-btn" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
