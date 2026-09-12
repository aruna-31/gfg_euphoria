import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glow' | 'subtle';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverEffect = true,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl p-5 backdrop-blur-xl transition-all duration-300';
  
  const variantStyles = {
    default: 'bg-[#0F1E2E]/90 border border-emerald-500/20 text-slate-100 shadow-xl shadow-black/40',
    glow: 'bg-gradient-to-br from-[#132A3E] to-[#0C1A27] border border-emerald-400/40 text-slate-100 shadow-2xl shadow-emerald-950/50 ring-1 ring-emerald-500/20',
    subtle: 'bg-[#0B1622]/90 border border-slate-700/40 text-slate-200',
  };

  const hoverStyle = hoverEffect
    ? 'hover:border-emerald-400/60 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/20'
    : '';

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${hoverStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};
