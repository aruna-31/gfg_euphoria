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
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-pink-300';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md shadow-pink-500/20 active:scale-[0.98]',
    secondary:
      'bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 hover:border-pink-400 active:scale-[0.98]',
    outline:
      'bg-white hover:bg-pink-50 text-pink-600 border border-pink-300 hover:border-pink-500 active:scale-[0.98]',
    danger:
      'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 hover:border-rose-400 active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-pink-50 text-gray-700 hover:text-pink-600 active:scale-[0.98]',
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
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
