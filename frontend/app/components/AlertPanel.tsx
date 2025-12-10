import { AlertTriangle, X } from 'lucide-react';

interface Alert {
  id: string;
  type: 'ultrasonic' | 'accident' | 'tilt';
  message: string;
  severity: 'danger';
  timestamp: Date;
}

interface AlertPanelProps {
  alerts: Alert[];
  onClearAlerts: () => void;
}

export function AlertPanel({ alerts, onClearAlerts }: AlertPanelProps) {
  const dangerAlerts = alerts.filter((a) => a.severity === 'danger');

  if (alerts.length === 0) return null;

  return (
    <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/30">
      <div className="max-w-md mx-auto lg:max-w-6xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-400">Active Alerts</span>
                <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs">
                  {dangerAlerts.length} Critical
                </span>
              </div>
              <div className="space-y-1">
                {alerts.slice(0, 2).map((alert) => (
                  <div
                    key={alert.id}
                    className="text-sm text-slate-300 truncate"
                  >
                    • {alert.message}
                  </div>
                ))}
                {alerts.length > 2 && (
                  <div className="text-sm text-slate-400">
                    +{alerts.length - 2} more alerts
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClearAlerts}
            className="text-slate-400 hover:text-white transition-colors p-1"
            aria-label="Clear alerts"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
