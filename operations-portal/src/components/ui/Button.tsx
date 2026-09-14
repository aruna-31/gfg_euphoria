import React from 'react';
import { useAudio } from '../../context/AudioContext';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'gfg';
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
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500/50';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-4.5 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#2F8D46] via-[#22C55E] to-[#10B981] hover:from-[#247338] hover:via-[#16A34A] hover:to-[#059669] text-white shadow-lg shadow-emerald-900/30 hover:shadow-emerald-600/40 active:scale-[0.98]',
    gfg:
      'bg-[#2F8D46] hover:bg-[#247338] text-white shadow-lg shadow-emerald-950/40 hover:shadow-emerald-500/20 active:scale-[0.98]',
    secondary:
      'bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/60 active:scale-[0.98]',
    outline:
      'bg-transparent hover:bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 hover:border-emerald-400 active:scale-[0.98]',
    danger:
      'bg-rose-950/60 hover:bg-rose-900/70 text-rose-300 border border-rose-500/30 hover:border-rose-400 active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-emerald-400 active:scale-[0.98]',
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
