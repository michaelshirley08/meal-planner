import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({
  size = 'medium',
  message,
  fullPage = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={`loading-spinner-container ${fullPage ? 'full-page' : ''}`}>
      <div className={`loading-spinner spinner-${size}`}>
        <div className="spinner-circle"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  return spinner;
}
