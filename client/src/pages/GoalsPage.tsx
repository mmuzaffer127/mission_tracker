import React, { useEffect, useState } from 'react';
import { Compass, Plus, CheckCircle2, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
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

  const handleDeleteGoal = async (goalId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this master goal?')) return;
    try {
      playClick();
      await api.deleteGoal(goalId);
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

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
          <h1
            className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-2"
            style={{ letterSpacing: '-0.06em' }}
          >
            <Compass className="w-6 h-6 text-white" />
            <span>Master Goal Architecture</span>
          </h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.60)' }}>
            Define multi-year and quarterly master targets. Connect milestones directly to tactical missions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-1.5 text-xs"
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
              className="rounded-2xl p-6 transition-all space-y-4"
              style={{
                background: 'rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
              }}
            >
              <div
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                    style={{
                      background: 'rgba(255,255,255,0.14)',
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.22)'
                    }}
                  >
                    🎯
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{goal.title}</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      Horizon: <span className="capitalize font-mono text-white/90">{goal.timeframe}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-base font-mono font-bold text-white">
                      {goal.progress_percentage}%
                    </span>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.50)' }}>
                      Master Progress
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteGoal(goal.id, e)}
                    className="p-1.5 text-white/40 hover:text-red-400 transition-colors rounded-lg hover:bg-white/10"
                    title="Delete Master Goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-white/70" /> : <ChevronDown className="w-5 h-5 text-white/70" />}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-track h-2">
                <div
                  className="progress-fill h-full"
                  style={{ width: `${goal.progress_percentage}%` }}
                />
              </div>

              {/* Milestones Accordion */}
              {isExpanded && (
                <div
                  className="pt-4 space-y-3"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <h4
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    Sequential Milestones ({goal.milestones?.filter((m) => m.is_completed).length || 0} / {goal.milestones?.length || 0})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {goal.milestones?.map((ms, index) => (
                      <div
                        key={ms.id}
                        onClick={() => handleMilestoneToggle(goal.id, ms.id, ms.is_completed)}
                        className="p-3 rounded-xl flex items-center space-x-3 cursor-pointer select-none transition-all"
                        style={{
                          background: ms.is_completed ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)',
                          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)'
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            background: ms.is_completed ? '#ffffff' : 'rgba(255,255,255,0.15)',
                            color: ms.is_completed ? '#1129e2' : '#ffffff'
                          }}
                        >
                          {index + 1}
                        </div>
                        <span
                          className={`text-xs flex-1 ${
                            ms.is_completed ? 'line-through' : ''
                          }`}
                          style={{
                            color: ms.is_completed ? 'rgba(255,255,255,0.45)' : '#ffffff'
                          }}
                        >
                          {ms.title}
                        </span>
                        {ms.is_completed && <CheckCircle2 className="w-4 h-4 text-white" />}
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
            <label className="glass-label">Goal Vision *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Architect an AI Operating System & reach $10k MRR"
              className="glass-input text-sm"
            />
          </div>

          <div>
            <label className="glass-label">Time Horizon</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="glass-select text-sm"
            >
              <option value="quarterly">Quarterly Target (3 Months)</option>
              <option value="annual">Annual Vision (12 Months)</option>
              <option value="monthly">Monthly Sprint</option>
              <option value="long_term">Long-Term North Star (3-5 Years)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="glass-label mb-0">Ordered Milestones</label>
              <button
                type="button"
                onClick={() => setMilestones([...milestones, ''])}
                className="text-xs text-white/80 hover:text-white transition-opacity"
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
                  className="glass-input text-xs"
                />
              ))}
            </div>
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
              Lock In Master Goal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
