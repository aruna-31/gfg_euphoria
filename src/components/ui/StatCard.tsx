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
      className="relative overflow-hidden transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold font-mono text-white mt-1.5">{value}</p>
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
        <div className="p-3 rounded-xl bg-[#142017] border border-[#223528] text-[#00e575]">
          {icon}
        </div>
      </div>
    </Card>
  );
};
