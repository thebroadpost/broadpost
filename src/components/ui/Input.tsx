import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-gray-700 font-sans">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`px-3 py-2 border border-border bg-white text-primary font-sans placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100 disabled:text-gray-400 ${
            error ? 'border-accent-red focus:ring-accent-red' : ''
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-accent-red mt-1">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
