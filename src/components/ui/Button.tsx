import React from 'react';
import { useAudio } from '../../context/AudioContext';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const { playClick } = useAudio();

  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#070908]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#00b259] hover:bg-[#00c964] text-black font-semibold shadow-lg shadow-[#00b259]/20 hover:shadow-[#00b259]/35 active:scale-[0.98] focus:ring-[#00e575]',
    secondary:
      'bg-[#16211a] hover:bg-[#1f2f25] text-gray-200 border border-[#2c4433] hover:border-[#00b259]/50 active:scale-[0.98] focus:ring-[#00b259]',
    outline:
      'bg-transparent hover:bg-[#0e1611] text-[#00e575] border border-[#00b259]/50 hover:border-[#00e575] active:scale-[0.98] focus:ring-[#00e575]',
    danger:
      'bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/40 hover:border-red-400 active:scale-[0.98] focus:ring-red-500',
    ghost:
      'bg-transparent hover:bg-[#141d17] text-gray-300 hover:text-white active:scale-[0.98] focus:ring-gray-600',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading) {
      try {
        playClick();
      } catch {
        // ignore audio
      }
      if (onClick) onClick(e);
    }
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
