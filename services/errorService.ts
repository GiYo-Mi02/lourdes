// Simple centralized error handler
// In a real app, this would send logs to Sentry, Datadog, etc.

type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

interface AppError {
  message: string;
  originalError?: any;
  severity: ErrorSeverity;
  timestamp: string;
  context?: string;
}

export const handleError = (
  message: string, 
  originalError?: any, 
  severity: ErrorSeverity = 'error',
  userFeedback?: (msg: string) => void
) => {
  const errorObj: AppError = {
    message,
    originalError,
    severity,
    timestamp: new Date().toISOString(),
    context: window.location.pathname
  };

  // Log to console with appropriate styling
  switch (severity) {
    case 'critical':
    case 'error':
      console.error(`[${severity.toUpperCase()}] ${message}`, originalError);
      break;
    case 'warning':
      console.warn(`[${severity.toUpperCase()}] ${message}`, originalError);
      break;
    default:
      console.log(`[${severity.toUpperCase()}] ${message}`, originalError);
  }

  // If a UI feedback callback is provided, trigger it
  if (userFeedback) {
    userFeedback(message);
  } else if (severity === 'critical') {
    // Fallback for critical errors if no UI handler provided
    alert(`System Error: ${message}. Please contact staff.`);
  }
};
