import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'amber' | 'blue' | 'purple' | 'red' | 'gray' | 'gold' | 'silver' | 'bronze' | 'pink' | 'gfg' | 'cyan';
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
    sm: 'text-[11px] px-2.5 py-0.5 font-bold tracking-wide',
    md: 'text-xs px-3 py-1 font-bold tracking-wide',
  };

  const variantStyles = {
    gfg: 'bg-[#123820] text-[#4ADE80] border border-[#22C55E]/40 shadow-sm shadow-emerald-500/15',
    green: 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/35 shadow-sm shadow-emerald-500/10',
    pink: 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/35',
    purple: 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/35',
    cyan: 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/35 shadow-sm shadow-cyan-500/10',
    blue: 'bg-sky-950/80 text-sky-300 border border-sky-500/35',
    amber: 'bg-amber-950/80 text-amber-300 border border-amber-500/35',
    red: 'bg-rose-950/80 text-rose-300 border border-rose-500/35',
    gray: 'bg-slate-800/80 text-slate-300 border border-slate-600/35',
    gold: 'bg-amber-950/90 text-amber-300 border border-amber-400/50 shadow-sm shadow-amber-500/15',
    silver: 'bg-slate-800 text-slate-200 border border-slate-400/40',
    bronze: 'bg-orange-950/90 text-orange-300 border border-orange-500/40',
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
