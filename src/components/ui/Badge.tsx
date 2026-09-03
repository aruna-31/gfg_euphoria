import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'amber' | 'blue' | 'purple' | 'red' | 'gray' | 'gold' | 'silver' | 'bronze';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'green',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-wide',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
  };

  const variantStyles = {
    green: 'bg-[#00b259]/15 text-[#00e575] border border-[#00b259]/30',
    amber: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    blue: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
    red: 'bg-red-500/15 text-red-300 border border-red-500/30',
    gray: 'bg-gray-800 text-gray-300 border border-gray-700',
    gold: 'bg-amber-500/20 text-amber-200 border border-amber-400/50 shadow-sm shadow-amber-500/20',
    silver: 'bg-slate-500/20 text-slate-200 border border-slate-400/50',
    bronze: 'bg-orange-600/20 text-orange-200 border border-orange-500/50',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full uppercase font-mono ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
