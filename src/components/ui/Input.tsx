import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = props.id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [props['aria-describedby'], errorId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="flex flex-col space-y-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300 font-sans">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={`px-3 py-2 border border-border bg-white dark:bg-gray-900 text-primary dark:text-gray-100 font-sans placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500 ${
            error ? 'border-accent-red focus:ring-accent-red' : ''
          } ${className}`}
          {...props}
        />
        {error && <span id={errorId} className="text-xs text-accent-red mt-1">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
