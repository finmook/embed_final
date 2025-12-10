import { LineChart, Line, ResponsiveContainer, YAxis, XAxis } from 'recharts';
import { SensorData } from '../page';

interface SensorHistoryProps {
  history: SensorData[];
}

export function SensorHistory({ history }: SensorHistoryProps) {
  const ultrasonicData = history.map((data, index) => ({
    index,
    value: data?.ultrasonic?.distance ?? 0
  }));

  const accidentData = history.map((data, index) => ({
    index,
    value: data?.accident?.infraredDetected ? 1 : 0,
  }));

  const tiltData = history.map((data, index) => ({
    index,
    value: data?.tilt?.isStable ? 0 : 1,
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-white px-4 lg:px-0">Sensor History</h2>

      {/* Ultrasonic History */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-300 text-sm">Ultrasonic Distance</h3>
          <span className="text-xs text-slate-500">Last 40s</span>
        </div>
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={ultrasonicData}>
            <YAxis hide domain={[0, 200]} />
            <XAxis hide dataKey="index" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0 cm</span>
          <span>200 cm</span>
        </div>
      </div>

      {/* Accident Sensor History */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-300 text-sm">Accident</h3>
          <span className="text-xs text-slate-500">Last 40s</span>
        </div>
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={accidentData}>
            <YAxis hide domain={[0, 1]} />
            <XAxis hide dataKey="index" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#f87171"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>No</span>
          <span>Yes</span>
        </div>
      </div>

      {/* Tilt Sensor History */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-300 text-sm">Vibration</h3>
          <span className="text-xs text-slate-500">Last 40s</span>
        </div>
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={tiltData}>
            <YAxis hide domain={[0, 1]} />
            <XAxis hide dataKey="index" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#c084fc"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>NO</span>
          <span>YES</span>
        </div>
      </div>

      {/* Status Summary */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
        <h3 className="text-slate-300 text-sm mb-3">System Status</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Connected Sensors</span>
            <span className="text-green-400">3/3</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Last Update</span>
            <span className="text-slate-300">
              {history.length > 0
                ? new Date(
                    history[history.length - 1].timestamp
                  ).toLocaleTimeString()
                : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Data Points</span>
            <span className="text-slate-300">{history.length}/20</span>
          </div>
        </div>
      </div>
    </div>
  );
}
