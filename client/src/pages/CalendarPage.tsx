import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Target } from 'lucide-react';
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
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-brand-blue" />
            <span>Smart Calendar & Deadlines</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Synchronize tactical execution with fixed temporal deadlines.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-surface-border text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-white min-w-[140px] text-center font-mono">
            {monthName}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-surface-border text-gray-400 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="glass-panel rounded-2xl border border-surface-border overflow-hidden">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 bg-surface-100/90 text-center py-2.5 border-b border-surface-border text-xs font-mono font-semibold text-gray-400 uppercase">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 divide-x divide-y divide-surface-border">
          {blankDays.map((i) => (
            <div key={`blank-${i}`} className="min-h-[110px] bg-surface-200/30 p-2" />
          ))}

          {daysArray.map((day) => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const dayMissions = missions.filter((m) => m.deadline && m.deadline.startsWith(dateStr));

            return (
              <div
                key={day}
                className={`min-h-[110px] p-2 transition-colors hover:bg-surface-100/40 ${
                  isToday ? 'bg-brand-blue/5' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday ? 'bg-brand-blue text-white shadow-glow' : 'text-gray-300'
                    }`}
                  >
                    {day}
                  </span>
                </div>

                <div className="space-y-1">
                  {dayMissions.map((m) => (
                    <div
                      key={m.id}
                      className="px-2 py-1 rounded bg-brand-blue/15 border border-brand-blue/30 text-[10px] text-blue-300 truncate"
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
