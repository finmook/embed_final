"use client"
import { useState, useEffect, useRef } from 'react';
import { SensorDashboard } from './components/SensorDashboard';
import { AlertPanel } from './components/AlertPanel';
import { SensorHistory } from './components/SensorHistory';

export interface SensorData {
  ultrasonic: {
    distance: number;
    objectDetected: boolean;
    status: 'safe' | 'danger';
  };
  accident: {
    infraredDetected: boolean;
    status: 'safe' | 'danger';
  };
  tilt: {
    isStable: boolean;
    status: 'safe' | 'danger';
  };
  timestamp: Date;
}

const normalizeHistoryEntry = (entry: any): SensorData => {
  const distance = Number(entry?.distance ?? 0);
  const accidentTriggered = Boolean(entry?.accident);
  const isStable = entry?.tilt === undefined ? true : Boolean(entry.tilt);

  return {
    ultrasonic: {
      distance,
      objectDetected: distance < 40,
      status: distance < 40 ? 'danger' : 'safe',
    },
    accident: {
      infraredDetected: accidentTriggered,
      status: accidentTriggered ? 'danger' : 'safe',
    },
    tilt: {
      isStable,
      status: isStable ? 'safe' : 'danger',
    },
    timestamp: entry?.timestamp ? new Date(entry.timestamp) : new Date(),
  };
};

export default function App() {
  const accidentHoldRef = useRef(0);
  const [sensorData, setSensorData] = useState<SensorData>({
    ultrasonic: { distance: 100, objectDetected: false, status: 'safe' },
    accident: { infraredDetected: false, status: 'safe' },
    tilt: { isStable: true, status: 'safe' },
    timestamp: new Date(),
  });

  const [alerts, setAlerts] = useState<Array<{
    id: string;
    type: 'ultrasonic' | 'accident' | 'tilt';
    message: string;
    severity: 'danger';
    timestamp: Date;
  }>>([]);

  const [history, setHistory] = useState<SensorData[]>([]);

  useEffect(() => {

    const pull = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sensor/history`);
      const rawHistory = await res.json();
      const normalizedHistory: SensorData[] = rawHistory.map(normalizeHistoryEntry);
      setHistory(normalizedHistory);
    };
    const fetchData = async () => {
      const latest = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sensor`);
      const newValue = await latest.json();
      return newValue;
    }
    const fetchAlert = async () => {
      const alertsRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alerts`);
      const alerts = await alertsRes.json();
      setAlerts(alerts);
    }
    fetchData();
    fetchAlert();
    const interval = setInterval(async () => {
      pull();
      const newValue = await fetchData();
      fetchAlert();
      const newData: SensorData = {
        ultrasonic: {
          distance: newValue.distance,
          objectDetected: newValue.distance < 40,
          status: newValue.distance < 40 ? 'danger' : 'safe'
        },
        accident: {
          infraredDetected: newValue.accident,
          status: newValue.accident ? 'danger' : 'safe'
        },
        tilt: {
          isStable: newValue.tilt,
          status: !newValue.tilt ? 'danger' : 'safe'
        },
        timestamp: new Date(),
      };

      if (newData.ultrasonic.distance < 40) {
        newData.ultrasonic.status = 'danger';
        newData.ultrasonic.objectDetected = true;
      }

      if (newData.accident.infraredDetected) {
        newData.accident.status = 'danger';
      }

      if (!newData.tilt.isStable) {
        newData.tilt.status = 'danger';
        newData.tilt.isStable = false;
      }
      const newAlerts: {
        id: string;
        type: 'ultrasonic' | 'accident' | 'tilt';
        message: string;
        severity: 'danger';
        timestamp: Date;
      }[] = [];
      if (newData.ultrasonic.status === 'danger') {
        newAlerts.push({
          id: `alert-${Date.now()}-ultrasonic`,
          type: 'ultrasonic' as const,
          message: `Object detected at ${newData.ultrasonic.distance}cm - Too close!`,
          severity: 'danger' as const,
          timestamp: new Date(),
        });
      }

      if (newData.accident.status === 'danger') {
        newAlerts.push({
          id: `alert-${Date.now()}-accident`,
          type: 'accident' as const,
          message: `Accident alert!`,
          severity: 'danger' as const,
          timestamp: new Date(),
        });
      }

      if (newData.tilt.status === 'danger') {
        newAlerts.push({
          id: `alert-${Date.now()}-tilt`,
          type: 'tilt' as const,
          message: `Critical tilt detected:  Structure unstable!`,
          severity: 'danger' as const,
          timestamp: new Date(),
        });
      }

      if (newAlerts.length > 0) {
        setAlerts((prev) => [...newAlerts, ...prev].slice(0, 10));
      }

      setSensorData(newData);
      setHistory(prev => {
        const updated = [...prev, newData];
        if (updated.length > 20) {
          updated.shift();       
        }
        return [...updated];    
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-md mx-auto lg:max-w-6xl">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
          <div className="px-4 py-4">
            <h1 className="text-white flex items-center gap-2">
              <span className="text-2xl">🏠</span>
              Home Safety Monitor
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time IoT sensor monitoring
            </p>
          </div>
        </div>

        {/* Alert Panel */}
        {alerts.length > 0 && (
          <AlertPanel alerts={alerts} onClearAlerts={clearAlerts} />
        )}

        {/* Main Content */}
        <div className="p-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:p-6">
          {/* Sensor Dashboard */}
          <div className="lg:col-span-2">
            <SensorDashboard sensorData={sensorData} />
          </div>

          {/* Sensor History */}
          <div className="mt-4 lg:mt-0">
            <SensorHistory history={history} />
          </div>
        </div>
      </div>
    </div>
  );
}
