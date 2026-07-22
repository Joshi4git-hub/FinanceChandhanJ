import React from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={inputId} className="text-sm font-medium text-text-main">
        {label}
      </label>
      <input
        id={inputId}
        className={`px-4 py-3 bg-background border rounded-2xl text-sm transition-all duration-200 outline-none
          ${error 
            ? 'border-danger focus:border-danger focus:ring-4 focus:ring-danger/10' 
            : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
          }`}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
};
