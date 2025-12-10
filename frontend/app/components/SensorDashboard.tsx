import { Wifi, TriangleAlert, Smartphone } from 'lucide-react';
import { SensorCard } from './SensorCard';
import { SensorData } from '../page';

interface SensorDashboardProps {
  sensorData: SensorData;
}

export function SensorDashboard({ sensorData }: SensorDashboardProps) {
  return (
    <div className="space-y-4">
      {/* Ultrasonic Sensor */}
      <SensorCard
        title="Ultrasonic Sensor"
        icon={<Wifi className="w-6 h-6" />}
        status={sensorData.ultrasonic.status}
        iconColor="text-blue-400"
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Distance</span>
            <span className="text-white">
              {sensorData.ultrasonic.distance} cm
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Object Detected</span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                sensorData.ultrasonic.objectDetected
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-green-500/20 text-green-400'
              }`}
            >
              {sensorData.ultrasonic.objectDetected ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="mt-2">
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  sensorData.ultrasonic.status === 'danger'
                    ? 'bg-red-500': 'bg-green-500'
                }`}
                style={{
                  width: `${Math.min(
                    (sensorData.ultrasonic.distance / 200) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </SensorCard>

      {/* Accident Sensor */}
      <SensorCard
        title="Infrared Sensor"
        icon={<TriangleAlert className="w-6 h-6" />}
        status={sensorData.accident.status}
        iconColor="text-orange-400"
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Accident</span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                !sensorData.accident.infraredDetected
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {sensorData.accident.infraredDetected ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </SensorCard>

      {/* Tilt Sensor */}
      <SensorCard
        title="Vibration Sensor"
        icon={<Smartphone className="w-6 h-6" />}
        status={sensorData.tilt.status}
        iconColor="text-purple-400"
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Stability</span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                sensorData.tilt.isStable
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {sensorData.tilt.isStable ? 'Stable' : 'Unstable'}
            </span>
          </div>
          <div className="mt-4 flex justify-center">
            <div className="relative w-32 h-32">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
              >
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-slate-700"
                />
                {/* Center dot */}
                <circle
                  cx="50"
                  cy="50"
                  r="3"
                  fill="currentColor"
                  className="text-slate-600"
                />
                {/* Tilt indicator */}
                <line
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="15"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className={`transition-all duration-500 ${
                    sensorData.tilt.status === 'danger'
                      ? 'text-red-500'
                      : 'text-green-500'
                  }`}
                  transform={sensorData.tilt.status === 'danger' ? `rotate(45 50 50)`:`rotate(0 50 50)`}
                />
                <circle
                  cx="50"
                  cy="15"
                  r="4"
                  fill="currentColor"
                  className={`transition-all duration-500 ${
                    sensorData.tilt.status === 'danger'
                      ? 'text-red-500'
                      : 'text-green-500'
                  }`}
                  transform={sensorData.tilt.status === 'danger' ? `rotate(45 50 50)`:`rotate(0 50 50)`}
                />
              </svg>
            </div>
          </div>
        </div>
      </SensorCard>
    </div>
  );
}