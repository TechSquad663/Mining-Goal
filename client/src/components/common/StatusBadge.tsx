import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toUpperCase();

  let styles = 'bg-coal-800 text-coal-300 border-coal-700';

  if (normalized === 'VERIFIED' || normalized === 'APPROVED' || normalized === 'INDEXED' || normalized === 'RESOLVED') {
    styles = 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80';
  } else if (normalized === 'CONFLICT_DETECTED' || normalized === 'FLAGGED' || normalized === 'CHANGES_REQUESTED' || normalized === 'FAILED') {
    styles = 'bg-red-950/60 text-red-400 border-red-800/80';
  } else if (normalized === 'PENDING_REVIEW' || normalized === 'UNDER_REVIEW' || normalized === 'PENDING') {
    styles = 'bg-amber-950/60 text-amber-400 border-amber-800/80';
  } else if (normalized === 'OCR_PROCESSING' || normalized === 'CLASSIFYING' || normalized === 'UPLOADED' || normalized === 'DRAFT') {
    styles = 'bg-blue-950/60 text-blue-400 border-blue-800/80';
  }

  const px = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${px} ${styles}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status.replace(/_/g, ' ')}
    </span>
  );
};
