import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'amber' | 'blue' | 'purple' | 'red' | 'gray' | 'gold' | 'silver' | 'bronze' | 'pink';
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
    sm: 'text-[11px] px-2 py-0.5 font-bold tracking-wide',
    md: 'text-xs px-2.5 py-1 font-bold tracking-wide',
  };

  const variantStyles = {
    pink: 'bg-pink-100 text-pink-700 border border-pink-300',
    green: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    amber: 'bg-amber-100 text-amber-800 border border-amber-300',
    blue: 'bg-sky-100 text-sky-800 border border-sky-300',
    purple: 'bg-purple-100 text-purple-800 border border-purple-300',
    red: 'bg-rose-100 text-rose-800 border border-rose-300',
    gray: 'bg-gray-100 text-gray-700 border border-gray-300',
    gold: 'bg-amber-100 text-amber-900 border border-amber-400 shadow-sm shadow-amber-500/10',
    silver: 'bg-slate-100 text-slate-800 border border-slate-300',
    bronze: 'bg-orange-100 text-orange-800 border border-orange-300',
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
