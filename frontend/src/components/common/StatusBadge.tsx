
type BadgeType = 'Applied' | 'Phone Screen' | 'Interview' | 'Offer' | 'Rejected' | string;

interface StatusBadgeProps {
  status: BadgeType;
  className?: string;
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  'Applied': { bg: 'bg-primary/10', text: 'text-primary', label: 'Applied' },
  'Phone Screen': { bg: 'bg-secondary/10', text: 'text-secondary', label: 'Screening' },
  'Interview': { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container', label: 'Interviewing' },
  'Offer': { bg: 'bg-secondary text-white shadow-sm', text: '', label: 'Offer Received' },
  'Rejected': { bg: 'bg-outline-variant/20', text: 'text-on-surface-variant', label: 'Rejected' },
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status] || { bg: 'bg-surface-container-high', text: 'text-on-surface-variant', label: status };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${config.bg} ${config.text} ${className}`}>
      {config.label}
    </span>
  );
}
