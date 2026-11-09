import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../lib/api.js';
import { Mission } from '../types/index.js';

export const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    api.getMissions().then(setMissions).catch(console.error);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blankDays = Array.from({ length: firstDayIndex }, (_, i) => i);

  const monthName = currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-2"
            style={{ letterSpacing: '-0.06em' }}
          >
            <CalendarIcon className="w-6 h-6 text-white" />
            <span>Smart Calendar & Deadlines</span>
          </h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.60)' }}>
            Synchronize tactical execution with fixed temporal deadlines.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl text-white/70 hover:text-white transition-colors"
            style={{
              background: 'rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-white min-w-[140px] text-center font-mono">
            {monthName}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl text-white/70 hover:text-white transition-colors"
            style={{
              background: 'rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
        }}
      >
        {/* Day of Week Headers */}
        <div
          className="grid grid-cols-7 text-center py-2.5 text-xs font-mono font-semibold uppercase tracking-wider"
          style={{
            background: 'rgba(255,255,255,0.06)',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.60)'
          }}
        >
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Matrix */}
        <div
          className="grid grid-cols-7 divide-x divide-y"
          style={{ borderColor: 'rgba(255,255,255,0.10)' }}
        >
          {blankDays.map((i) => (
            <div
              key={`blank-${i}`}
              className="min-h-[110px] p-2"
              style={{
                background: 'rgba(255,255,255,0.02)',
                borderColor: 'rgba(255,255,255,0.10)'
              }}
            />
          ))}

          {daysArray.map((day) => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const dayMissions = missions.filter((m) => m.deadline && m.deadline.startsWith(dateStr));

            return (
              <div
                key={day}
                className="min-h-[110px] p-2 transition-colors"
                style={{
                  background: isToday ? 'rgba(255,255,255,0.12)' : 'transparent',
                  borderColor: 'rgba(255,255,255,0.10)'
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      background: isToday ? '#ffffff' : 'transparent',
                      color: isToday ? '#1129e2' : 'rgba(255,255,255,0.85)'
                    }}
                  >
                    {day}
                  </span>
                </div>

                <div className="space-y-1">
                  {dayMissions.map((m) => (
                    <div
                      key={m.id}
                      className="px-2 py-1 rounded text-[10px] truncate text-white"
                      style={{
                        background: 'rgba(255,255,255,0.14)',
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.22)'
                      }}
                      title={m.title}
                    >
                      {m.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
