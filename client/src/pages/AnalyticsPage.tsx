import React, { useEffect, useState } from 'react';
import { BarChart3, PieChart, ShieldAlert } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { api } from '../lib/api.js';

export const AnalyticsPage: React.FC = () => {
  const [wheelData, setWheelData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [wRes, sRes] = await Promise.all([
          api.getLifeBalanceWheel(),
          api.getDashboardSummary()
        ]);
        setWheelData(wRes);
        setSummary(sRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const productivityVelocity = [
    { name: 'Mon', missions: 3, deepWorkHrs: 4.5 },
    { name: 'Tue', missions: 5, deepWorkHrs: 6.0 },
    { name: 'Wed', missions: 4, deepWorkHrs: 5.0 },
    { name: 'Thu', missions: 6, deepWorkHrs: 7.2 },
    { name: 'Fri', missions: 5, deepWorkHrs: 5.5 },
    { name: 'Sat', missions: 2, deepWorkHrs: 3.0 },
    { name: 'Sun', missions: 3, deepWorkHrs: 4.0 }
  ];

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Calculating telemetry metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-brand-cyan" />
          <span>Analytics & Life Balance Telemetry</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Multidimensional life optimization: holistic tracking across all 8 essential life quadrants.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart: Life Balance Wheel */}
        <div className="glass-panel rounded-2xl p-6 border border-surface-border flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 border-b border-surface-border mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">8-Quadrant Life Balance Wheel</h3>
              <p className="text-[11px] text-gray-400">Harmonized assessment across career, mind, and health</p>
            </div>
            <span className="text-xs font-mono text-brand-cyan font-bold">Optimal Synergy</span>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={wheelData}>
                <PolarGrid stroke="#1f293d" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#334155" />
                <Radar
                  name="Life Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Weekly Output & Deep Work */}
        <div className="glass-panel rounded-2xl p-6 border border-surface-border flex flex-col">
          <div className="w-full flex items-center justify-between pb-3 border-b border-surface-border mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Weekly Execution Velocity</h3>
              <p className="text-[11px] text-gray-400">Completed missions vs. Deep Work hours logged</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">35.2 hrs logged</span>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productivityVelocity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="missions" name="Missions Done" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="deepWorkHrs" name="Deep Work (Hrs)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
