import React from 'react';
import { Card } from './Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  highlight = false,
}) => {
  return (
    <Card
      variant={highlight ? 'glow' : 'default'}
      className="relative min-w-0 overflow-hidden transition-all duration-300 group"
    >
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#00b259]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</p>
          <p className="text-2xl lg:text-3xl font-black font-mono tracking-tight text-white mt-1.5">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1.5 mt-2.5">
              <span
                className={`text-xs font-semibold ${
                  trend.isPositive ? 'text-[#00e575]' : 'text-red-400'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-[11px] text-gray-500">vs previous round</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl bg-[#142017]/80 border border-[#2b4834] text-[#00e575] shadow-inner">
          {icon}
        </div>
      </div>
    </Card>
  );
};
