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
      not_started: { label: 'Not Started', cls: 'badge-not-started' },
      in_progress:  { label: 'In Progress',  cls: 'badge-in-progress' },
      completed:    { label: 'Completed',     cls: 'badge-completed' },
      on_hold:      { label: 'On Hold',       cls: 'badge-on-hold' },
      cancelled:    { label: 'Cancelled',     cls: 'badge-cancelled' }
    }[status] || { label: status, cls: 'badge-not-started' };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.cls} ${className}`}
      >
        {config.label}
      </span>
    );
  }

  if (priority) {
    const config = {
      low:      { label: 'Low',          cls: 'badge-not-started' },
      medium:   { label: 'Medium',       cls: 'badge-in-progress' },
      high:     { label: 'High Priority', cls: 'badge-on-hold' },
      critical: { label: 'CRITICAL',     cls: 'badge-critical' }
    }[priority] || { label: priority, cls: 'badge-not-started' };

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ${config.cls} ${className}`}
      >
        {config.label}
      </span>
    );
  }

  return null;
};
