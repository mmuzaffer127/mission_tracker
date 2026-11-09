import React, { useEffect, useState } from 'react';
import { Flame, Plus, CheckCircle2, Calendar, Trash2 } from 'lucide-react';
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

  const handleDeleteHabit = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return;
    try {
      playClick();
      await api.deleteHabit(habitId);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

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
          <h1
            className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-2"
            style={{ letterSpacing: '-0.06em' }}
          >
            <Flame className="w-6 h-6 text-white" />
            <span>Habit Mastery & Streak Engine</span>
          </h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.60)' }}>
            "You do not rise to the level of your goals. You fall to the level of your systems."
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-1.5 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Daily Habit</span>
        </button>
      </div>

      {/* Habit Consistency Heatmap Card */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: 'rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
        }}
      >
        <div
          className="flex items-center justify-between pb-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}
        >
          <h3
            className="text-sm font-bold text-white flex items-center space-x-2"
            style={{ letterSpacing: '-0.03em' }}
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Habit Consistency Heatmap</span>
          </h3>
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Past 7 Days Activity Matrix
          </span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto py-2">
          {last7Days.map((dateStr) => {
            const count = heatmap[dateStr] || 0;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            return (
              <div
                key={dateStr}
                className="flex-1 p-3 rounded-xl flex flex-col items-center justify-center min-w-[70px] transition-all"
                style={{
                  background: isToday
                    ? 'rgba(255,255,255,0.20)'
                    : count > 0
                    ? 'rgba(255,255,255,0.14)'
                    : 'rgba(255,255,255,0.05)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
                  color: '#ffffff'
                }}
              >
                <span
                  className="text-[10px] font-mono uppercase"
                  style={{ color: 'rgba(255,255,255,0.60)' }}
                >
                  {new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
                <span className="text-base font-bold my-1">
                  {count > 0 ? `✓` : `—`}
                </span>
                <span
                  className="text-[10px] font-mono"
                  style={{ color: 'rgba(255,255,255,0.50)' }}
                >
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
            className="glass-card p-5 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className="text-[11px] font-mono px-2 py-0.5 rounded-md uppercase"
                  style={{
                    background: 'rgba(255,255,255,0.10)',
                    color: 'rgba(255,255,255,0.70)',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)'
                  }}
                >
                  {habit.frequency}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center space-x-1 text-xs font-mono font-bold text-white">
                    <Flame className="w-4 h-4 text-white" />
                    <span>{habit.current_streak} Streak</span>
                  </span>
                  <button
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="p-1 text-white/40 hover:text-red-400 transition-colors rounded"
                    title="Delete Habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mt-3">{habit.title}</h3>
              {habit.description && (
                <p className="text-xs mt-1 line-clamp-2" style={{ color: 'rgba(255,255,255,0.60)' }}>
                  {habit.description}
                </p>
              )}
            </div>

            <div
              className="pt-3 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}
            >
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Best: <strong className="text-white font-mono">{habit.longest_streak} days</strong>
              </span>

              <button
                onClick={() => handleCheckin(habit.id)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.22)'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#ffffff';
                  (e.currentTarget as HTMLElement).style.color = '#1129e2';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)';
                  (e.currentTarget as HTMLElement).style.color = '#ffffff';
                }}
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
            <label className="glass-label">Habit Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 90-Minute Uninterrupted Coding Sprint"
              className="glass-input text-sm"
            />
          </div>

          <div>
            <label className="glass-label">Intent / Motivation</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why does this habit matter to your identity?"
              className="glass-textarea text-sm"
            />
          </div>

          <div>
            <label className="glass-label">Target Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="glass-select text-sm"
            >
              <option value="daily">Every Single Day (Compounding)</option>
              <option value="weekdays">Monday - Friday (Professional)</option>
              <option value="weekends">Weekends Only</option>
            </select>
          </div>

          <div
            className="flex justify-end space-x-3 pt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.14)' }}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-glass text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs"
            >
              Anchor Habit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
