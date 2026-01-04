import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isValid?: boolean;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isValid,
  helperText,
  className = '',
  required,
  ...props
}) => {
  return (
    <div className={`w-full mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          className={`
            w-full h-12 px-4 border rounded-lg text-base transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${error 
              ? 'border-error focus:border-error focus:ring-red-200' 
              : isValid 
                ? 'border-success focus:border-success focus:ring-green-100' 
                : 'border-gray-300 focus:border-medical-blue focus:ring-blue-100'
            }
            disabled:bg-gray-100 disabled:text-gray-500
          `}
          {...props}
        />
        {isValid && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
            <i className="fas fa-check-circle text-lg"></i>
          </div>
        )}
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-error">
            <i className="fas fa-exclamation-circle text-lg"></i>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-gray-500 italic">{helperText}</p>}
    </div>
  );
};
