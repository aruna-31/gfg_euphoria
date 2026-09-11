import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-gray-300 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-gray-400 pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-[#0a0f0c] border ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-[#1e2d23] focus:border-[#00b259] focus:ring-[#00b259]/30'
          } rounded-xl px-3.5 py-3 text-sm text-gray-100 placeholder-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 bg-[#080e0a]/90 shadow-inner ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 text-gray-400 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-400 mt-0.5">{error}</span>}
      {!error && helperText && <span className="text-xs text-gray-500 mt-0.5">{helperText}</span>}
    </div>
  );
};
