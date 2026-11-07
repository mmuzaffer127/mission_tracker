import React from 'react';
import { MissionPriority, MissionStatus } from '../../types/index.js';

interface StatusBadgeProps {
  status?: MissionStatus;
  priority?: MissionPriority;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, priority, className = '' }) => {
  if (status) {
    const config = {
      not_started: { label: 'Not Started', bg: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
      in_progress: { label: 'In Progress', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
      completed: { label: 'Completed', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
      on_hold: { label: 'On Hold', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
      cancelled: { label: 'Cancelled', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
    }[status] || { label: status, bg: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${className}`}>
        {config.label}
      </span>
    );
  }

  if (priority) {
    const config = {
      low: { label: 'Low', bg: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
      medium: { label: 'Medium', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      high: { label: 'High Priority', bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
      critical: { label: 'CRITICAL', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/40 shadow-sm shadow-rose-950' }
    }[priority] || { label: priority, bg: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider border ${config.bg} ${className}`}>
        {config.label}
      </span>
    );
  }

  return null;
};
