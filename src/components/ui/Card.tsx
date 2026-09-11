import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> { variant?: 'default' | 'glow' | 'subtle'; hoverEffect?: boolean; }
export const Card: React.FC<CardProps> = ({ children, variant = 'default', hoverEffect = true, className = '', ...props }) => {
  const baseStyles = 'rounded-2xl p-5 backdrop-blur-md transition-all duration-200';
  const variantStyles = {
    default: 'bg-[#18212d] border border-[#2b3a4f] text-slate-100 shadow-xl shadow-black/15',
    glow: 'bg-gradient-to-br from-[#1d2938] to-[#17212e] border border-pink-400/35 text-slate-100 shadow-xl shadow-pink-500/10',
    subtle: 'bg-[#141d29] border border-[#29394d] text-slate-100',
  };
  const hoverStyle = hoverEffect ? 'hover:border-pink-400/60 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/20' : '';
  return <div className={`${baseStyles} ${variantStyles[variant]} ${hoverStyle} ${className}`} {...props}>{children}</div>;
};
