import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  accentColor?: 'gold' | 'emerald' | 'blue' | 'red';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  accentColor = 'gold'
}) => {
  const accentClasses = {
    gold: 'border-l-4 border-l-gold-500 text-gold-400 bg-gold-500/10',
    emerald: 'border-l-4 border-l-emerald-500 text-emerald-400 bg-emerald-500/10',
    blue: 'border-l-4 border-l-blue-500 text-blue-400 bg-blue-500/10',
    red: 'border-l-4 border-l-red-500 text-red-400 bg-red-500/10',
  }[accentColor];

  return (
    <div className={`bg-coal-900 border border-coal-800 rounded-lg p-5 shadow-sm relative overflow-hidden transition-all hover:border-coal-700 ${accentClasses}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-coal-400">{title}</p>
          <h3 className="text-2xl font-bold font-mono text-coal-50 mt-1 tracking-tight">{value}</h3>
        </div>
        <div className="p-2.5 rounded-lg bg-coal-800/80 border border-coal-700/50">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || change) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {change && (
            <span className={`inline-flex items-center gap-0.5 font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          {subtitle && <span className="text-coal-400">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
