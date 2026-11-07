import React from 'react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 56,
  strokeWidth = 5,
  colorClass = 'stroke-brand-blue'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const safeProgress = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`${colorClass} transition-all duration-700 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <span className="absolute text-xs font-semibold text-gray-200">
        {Math.round(safeProgress)}%
      </span>
    </div>
  );
};
