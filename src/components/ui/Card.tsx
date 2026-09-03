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
  const baseStyles = 'rounded-xl p-5 backdrop-blur-md transition-all duration-200';

  const variantStyles = {
    default: 'bg-[#0f1612]/80 border border-[#1e2d23] text-gray-100 shadow-lg shadow-black/40',
    glow: 'bg-[#121c16]/90 border border-[#00b259]/40 text-gray-100 shadow-xl shadow-[#00b259]/10',
    subtle: 'bg-[#0b100d]/60 border border-[#18241c] text-gray-200',
  };

  const hoverStyle = hoverEffect
    ? 'hover:border-[#00b259]/50 hover:shadow-xl hover:shadow-[#00b259]/10'
    : '';

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${hoverStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};
