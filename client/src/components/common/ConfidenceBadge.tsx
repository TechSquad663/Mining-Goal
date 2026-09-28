import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface ConfidenceBadgeProps {
  confidence: number; // 0 to 1 or 0 to 100
  evidenceCount?: number;
  dataStatus?: 'VERIFIED' | 'CAUTION' | 'INSUFFICIENT_EVIDENCE';
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ 
  confidence, 
  evidenceCount,
  dataStatus = 'VERIFIED'
}) => {
  const percentage = confidence > 1 ? confidence : Math.round(confidence * 1000) / 10;

  const isHigh = percentage >= 90;
  const isCaution = percentage >= 70 && percentage < 90;

  let colorClasses = 'bg-emerald-950/70 border-emerald-700/60 text-emerald-300';
  let Icon = ShieldCheck;

  if (dataStatus === 'INSUFFICIENT_EVIDENCE' || percentage < 70) {
    colorClasses = 'bg-red-950/70 border-red-700/60 text-red-300';
    Icon = ShieldAlert;
  } else if (isCaution || dataStatus === 'CAUTION') {
    colorClasses = 'bg-amber-950/70 border-amber-700/60 text-amber-300';
    Icon = ShieldAlert;
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md border text-xs font-mono font-semibold ${colorClasses}`}>
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span>Confidence: {percentage}%</span>
      {evidenceCount !== undefined && (
        <span className="opacity-80 pl-1 border-l border-current/30 font-sans">
          {evidenceCount} {evidenceCount === 1 ? 'Source' : 'Sources'}
        </span>
      )}
      <span className="font-sans px-1.5 py-0.2 rounded bg-black/40 text-[10px] uppercase tracking-wider">
        {dataStatus === 'INSUFFICIENT_EVIDENCE' ? 'Missing Evidence' : dataStatus}
      </span>
    </div>
  );
};
