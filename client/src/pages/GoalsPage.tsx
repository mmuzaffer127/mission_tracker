import React, { useEffect, useState } from 'react';
import { Compass, Plus, Sparkles, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../lib/api.js';
import { Goal } from '../types/index.js';
import { Modal } from '../components/ui/Modal.js';
import { useSound } from '../contexts/SoundContext.js';

export const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [timeframe, setTimeframe] = useState<any>('quarterly');
  const [milestones, setMilestones] = useState<string[]>(['']);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);

  const { playComplete, playClick } = useSound();

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.getGoals();
      setGoals(res);
      if (res.length > 0 && !expandedGoalId) {
        setExpandedGoalId(res[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleMilestoneToggle = async (goalId: string, milestoneId: string, current: boolean) => {
    try {
      playClick();
      await api.toggleMilestone(goalId, milestoneId, !current);
      if (!current) playComplete();
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      playClick();
      await api.createGoal({
        title,
        timeframe,
        milestones: milestones.filter((m) => m.trim().length > 0)
      });
      playComplete();
      setIsModalOpen(false);
      setTitle('');
      setMilestones(['']);
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Compass className="w-6 h-6 text-brand-blue" />
            <span>Master Goal Architecture</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Define multi-year and quarterly master targets. Connect milestones directly to tactical missions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 text-white text-xs font-semibold shadow-glow hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Master Goal</span>
        </button>
      </div>

      {/* Goal Cards List */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const isExpanded = expandedGoalId === goal.id;
          return (
            <div
              key={goal.id}
              className="glass-panel rounded-2xl p-6 border border-surface-border transition-all space-y-4"
            >
              <div
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center text-brand-blue font-bold">
                    🎯
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{goal.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Horizon: <span className="capitalize text-brand-cyan font-mono">{goal.timeframe}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-brand-cyan">
                      {goal.progress_percentage}%
                    </span>
                    <p className="text-[10px] text-gray-500 uppercase">Master Progress</p>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-surface-50 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-blue to-brand-cyan h-full rounded-full transition-all duration-500"
                  style={{ width: `${goal.progress_percentage}%` }}
                />
              </div>

              {/* Milestones Accordion */}
              {isExpanded && (
                <div className="pt-4 border-t border-surface-border space-y-3">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Sequential Milestones ({goal.milestones?.filter((m) => m.is_completed).length || 0} / {goal.milestones?.length || 0})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {goal.milestones?.map((ms, index) => (
                      <div
                        key={ms.id}
                        onClick={() => handleMilestoneToggle(goal.id, ms.id, ms.is_completed)}
                        className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer select-none transition-all ${
                          ms.is_completed
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                            : 'bg-surface-50/70 border-surface-border text-gray-300 hover:border-brand-blue/30'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            ms.is_completed ? 'bg-emerald-500 text-black' : 'bg-surface-100 border border-surface-border text-gray-400'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className={`text-xs flex-1 ${ms.is_completed ? 'line-through text-gray-400' : ''}`}>
                          {ms.title}
                        </span>
                        {ms.is_completed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Goal Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Master Goal">
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Goal Vision *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Architect an AI Operating System & reach \$10k MRR"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 border border-surface-border text-white text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Time Horizon</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-border text-white text-sm focus:outline-none"
            >
              <option value="quarterly">Quarterly Target (3 Months)</option>
              <option value="annual">Annual Vision (12 Months)</option>
              <option value="monthly">Monthly Sprint</option>
              <option value="long_term">Long-Term North Star (3-5 Years)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-300">Ordered Milestones</label>
              <button
                type="button"
                onClick={() => setMilestones([...milestones, ''])}
                className="text-xs text-brand-cyan hover:underline"
              >
                + Add Milestone
              </button>
            </div>
            <div className="space-y-2">
              {milestones.map((ms, i) => (
                <input
                  key={i}
                  type="text"
                  value={ms}
                  onChange={(e) => {
                    const next = [...milestones];
                    next[i] = e.target.value;
                    setMilestones(next);
                  }}
                  placeholder={`Milestone #${i + 1}`}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-50 border border-surface-border text-white text-xs focus:outline-none"
                />
              ))}
            </div>
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
              className="px-5 py-2 rounded-xl bg-brand-blue text-white text-xs font-semibold shadow-glow hover:brightness-110"
            >
              Lock In Master Goal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
