import React, { useEffect, useState } from 'react';
import { Flame, Plus, CheckCircle2, RotateCcw, Calendar, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api.js';
import { Habit } from '../types/index.js';
import { Modal } from '../components/ui/Modal.js';
import { useSound } from '../contexts/SoundContext.js';

export const HabitsPage: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [heatmap, setHeatmap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<any>('daily');

  const { playComplete, playClick } = useSound();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [habRes, heatRes] = await Promise.all([
        api.getHabits(),
        api.getHeatmap()
      ]);
      setHabits(habRes);
      setHeatmap(heatRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckin = async (habitId: string) => {
    try {
      playClick();
      const today = new Date().toISOString().split('T')[0];
      await api.checkinHabit(habitId, today);
      playComplete();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      playClick();
      await api.createHabit({
        title,
        description,
        frequency
      });
      playComplete();
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Generate 7-day mini timeline for visualization
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Flame className="w-6 h-6 text-brand-amber" />
            <span>Habit Mastery & Streak Engine</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            "You do not rise to the level of your goals. You fall to the level of your systems."
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-amber to-orange-500 text-white text-xs font-semibold shadow-glow hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Daily Habit</span>
        </button>
      </div>

      {/* Habit Consistency Heatmap Card */}
      <div className="glass-panel rounded-2xl p-6 border border-surface-border space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-surface-border">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-brand-cyan" />
            <span>Habit Consistency Heatmap</span>
          </h3>
          <span className="text-[11px] text-gray-400">Past 14 Days Activity Matrix</span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto py-2">
          {last7Days.map((dateStr) => {
            const count = heatmap[dateStr] || 0;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            return (
              <div
                key={dateStr}
                className={`flex-1 p-3 rounded-xl border flex flex-col items-center justify-center min-w-[70px] ${
                  isToday
                    ? 'bg-brand-blue/15 border-brand-blue/40 text-blue-300'
                    : count > 0
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                    : 'bg-surface-50 border-surface-border text-gray-500'
                }`}
              >
                <span className="text-[10px] font-mono uppercase">
                  {new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
                <span className="text-base font-bold my-0.5">
                  {count > 0 ? `✓` : `—`}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {dateStr.slice(5)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Habit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="glass-card p-5 border border-surface-border flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-surface-50 border border-surface-border text-gray-400 uppercase">
                  {habit.frequency}
                </span>
                <span className="flex items-center space-x-1 text-xs text-brand-amber font-mono font-bold">
                  <Flame className="w-4 h-4 text-brand-amber" />
                  <span>{habit.current_streak} Streak</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-white mt-3">{habit.title}</h3>
              {habit.description && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{habit.description}</p>
              )}
            </div>

            <div className="pt-3 border-t border-surface-border flex items-center justify-between">
              <span className="text-[11px] text-gray-500">
                Personal Record: <strong className="text-gray-300 font-mono">{habit.longest_streak} days</strong>
              </span>

              <button
                onClick={() => handleCheckin(habit.id)}
                className="px-3.5 py-1.5 rounded-xl bg-surface-50 hover:bg-brand-emerald hover:text-black border border-surface-border text-xs font-semibold text-emerald-400 transition-all flex items-center space-x-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Check-in</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Habit Creation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Establish New Habit">
        <form onSubmit={handleCreateHabit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Habit Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 90-Minute Uninterrupted Coding Sprint"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 border border-surface-border text-white text-sm focus:outline-none focus:border-brand-amber"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Intent / Motivation</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why does this habit matter to your identity?"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-50 border border-surface-border text-white text-sm focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Target Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-border text-white text-sm focus:outline-none"
            >
              <option value="daily">Every Single Day (Compounding)</option>
              <option value="weekdays">Monday - Friday (Professional)</option>
              <option value="weekends">Weekends Only</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-surface-border">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-amber to-orange-500 text-white text-xs font-semibold shadow-glow hover:brightness-110"
            >
              Anchor Habit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
