import React, { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
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
    return <div className="p-8 text-center text-white/50 animate-pulse">Calculating telemetry metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-2"
          style={{ letterSpacing: '-0.06em' }}
        >
          <BarChart3 className="w-6 h-6 text-white" />
          <span>Analytics & Life Balance Telemetry</span>
        </h1>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.60)' }}>
          Multidimensional life optimization: holistic tracking across all 8 essential life quadrants.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart: Life Balance Wheel */}
        <div
          className="rounded-2xl p-6 flex flex-col items-center"
          style={{
            background: 'rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
          }}
        >
          <div
            className="w-full flex items-center justify-between pb-3 mb-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}
          >
            <div>
              <h3 className="text-sm font-bold text-white">8-Quadrant Life Balance Wheel</h3>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Harmonized assessment across career, mind, and health
              </p>
            </div>
            <span
              className="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.20)'
              }}
            >
              Optimal Synergy
            </span>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={wheelData}>
                <PolarGrid stroke="rgba(255,255,255,0.15)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.80)', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="rgba(255,255,255,0.25)" />
                <Radar
                  name="Life Score"
                  dataKey="score"
                  stroke="#ffffff"
                  fill="#ffffff"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Weekly Output & Deep Work */}
        <div
          className="rounded-2xl p-6 flex flex-col"
          style={{
            background: 'rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
          }}
        >
          <div
            className="w-full flex items-center justify-between pb-3 mb-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}
          >
            <div>
              <h3 className="text-sm font-bold text-white">Weekly Execution Velocity</h3>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Completed missions vs. Deep Work hours logged
              </p>
            </div>
            <span
              className="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.20)'
              }}
            >
              35.2 hrs logged
            </span>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productivityVelocity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.10)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.60)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.60)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17,41,226,0.95)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#ffffff'
                  }}
                />
                <Bar dataKey="missions" name="Missions Done" fill="#ffffff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="deepWorkHrs" name="Deep Work (Hrs)" fill="rgba(255,255,255,0.5)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
