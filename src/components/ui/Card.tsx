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
    default: 'bg-gradient-to-br from-[#111c15]/95 to-[#0a100c]/95 border border-[#294330] text-gray-100 shadow-[0_18px_50px_rgba(0,0,0,0.22)]',
    glow: 'bg-gradient-to-br from-[#13271a]/95 to-[#09130d]/95 border border-[#00b259]/40 text-gray-100 shadow-[0_20px_60px_rgba(0,178,89,0.12)]',
    subtle: 'bg-[#0b120e]/75 border border-[#203326] text-gray-200',
  };

  const hoverStyle = hoverEffect
    ? 'hover:-translate-y-0.5 hover:border-[#00b259]/55 hover:shadow-[0_24px_60px_rgba(0,178,89,0.12)]'
    : '';

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${hoverStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};
