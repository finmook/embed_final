import { ReactNode } from 'react';

interface SensorCardProps {
  title: string;
  icon: ReactNode;
  status: 'safe' | 'warning' | 'danger';
  iconColor: string;
  children: ReactNode;
}

export function SensorCard({
  title,
  icon,
  status,
  iconColor,
  children,
}: SensorCardProps) {
  const borderColor =
    status === 'danger'
      ? 'border-red-500/50'
      : status === 'warning'
      ? 'border-yellow-500/50'
      : 'border-green-500/50';

  const bgColor =
    status === 'danger'
      ? 'bg-red-500/5'
      : status === 'warning'
      ? 'bg-yellow-500/5'
      : 'bg-green-500/5';

  return (
    <div
      className={`bg-slate-800/50 backdrop-blur-sm border ${borderColor} ${bgColor} rounded-lg p-4 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`${iconColor}`}>{icon}</div>
          <h2 className="text-white">{title}</h2>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs ${
            status === 'danger'
              ? 'bg-red-500/20 text-red-400'
              : status === 'warning'
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-green-500/20 text-green-400'
          }`}
        >
          {status === 'danger'
            ? '⚠ DANGER'
            : status === 'warning'
            ? '⚡ WARNING'
            : '✓ SAFE'}
        </div>
      </div>
      {children}
    </div>
  );
}
