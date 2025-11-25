import { useState, useCallback, type ReactNode } from 'react';
import { ToastContext } from './useToastContext';
import type { ToastType, Toast } from './useToastContext';

export type { ToastType, Toast };

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 3000) => {
      const id = `toast-${++toastId}`;
      const toast: Toast = { id, message, type, duration };

      setToasts((prevToasts) => [...prevToasts, toast]);

      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }
    },
    [hideToast]
  );

  const success = useCallback(
    (message: string, duration = 3000) => showToast(message, 'success', duration),
    [showToast]
  );

  const error = useCallback(
    (message: string, duration = 5000) => showToast(message, 'error', duration),
    [showToast]
  );

  const info = useCallback(
    (message: string, duration = 3000) => showToast(message, 'info', duration),
    [showToast]
  );

  const warning = useCallback(
    (message: string, duration = 4000) => showToast(message, 'warning', duration),
    [showToast]
  );

  const value = {
    toasts,
    showToast,
    hideToast,
    success,
    error,
    info,
    warning,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
