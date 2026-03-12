import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'red' | 'blue' | 'outline';
}

export function Badge({ className = '', variant = 'primary', children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-1.5 py-0.5 text-xs font-bold font-sans uppercase tracking-wider';
  
  const variants = {
    primary: 'bg-primary text-white',
    red: 'bg-accent-red text-white',
    blue: 'bg-accent-blue text-white',
    outline: 'border border-primary text-primary'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
