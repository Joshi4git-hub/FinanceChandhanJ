import React from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  endAdornment?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  endAdornment,
  rightElement,
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
      <div className="relative">
        <input
          id={inputId}
          className={`w-full px-4 py-3 bg-background border rounded-2xl text-sm transition-all duration-200 outline-none ${endAdornment || rightElement ? 'pr-12' : ''}
            ${error
              ? 'border-danger focus:border-danger focus:ring-4 focus:ring-danger/10'
              : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
            }`}
          {...props}
        />
        {(endAdornment || rightElement) && <div className="absolute inset-y-0 right-3 flex items-center">{endAdornment || rightElement}</div>}
      </div>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
};
