import React, { useEffect, useState } from 'react';
import { Trophy, Plus, ExternalLink, Calendar, Award, Sparkles } from 'lucide-react';
import { api } from '../lib/api.js';
import { Achievement } from '../types/index.js';
import { Modal } from '../components/ui/Modal.js';
import { useSound } from '../contexts/SoundContext.js';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [externalUrl, setExternalUrl] = useState('');

  const { playComplete, playClick } = useSound();

  const fetchAchievements = async () => {
    try {
      const res = await api.getAchievements(selectedMonth);
      setAchievements(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [selectedMonth]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      playClick();
      await api.createAchievement({
        title,
        description,
        year_month: selectedMonth,
        xp_awarded: 150
      });
      playComplete();
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setExternalUrl('');
      fetchAchievements();
    } catch (err) {
      console.error(err);
    }
  };

  // Generate historical past 6 months options
  const monthOptions = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    return { val, label };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-brand-amber" />
            <span>Achievement Wall of Fame</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Historical records are permanent. Every month builds your lifetime resume of accomplishments.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Historical Month Selector */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-surface-100 border border-surface-border text-xs text-gray-300">
            <Calendar className="w-4 h-4 text-brand-blue" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent focus:outline-none text-white font-mono cursor-pointer"
            >
              {monthOptions.map((m) => (
                <option key={m.val} value={m.val} className="bg-surface-200">
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-amber to-orange-500 text-white text-xs font-semibold shadow-glow hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Breakthrough</span>
          </button>
        </div>
      </div>

      {/* Grid of Verified Breakthroughs */}
      {achievements.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center text-gray-400">
          <Trophy className="w-10 h-10 mx-auto mb-3 text-gray-600" />
          <h3 className="text-base font-bold text-gray-300">No achievements recorded for this month yet.</h3>
          <p className="text-xs text-gray-500 mt-1">Complete your tactical missions to unlock verified entries on your Wall of Fame.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="glass-card p-6 border border-surface-border flex flex-col justify-between space-y-4 hover:border-brand-amber/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    +{ach.xp_awarded} XP
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {new Date(ach.unlocked_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-3">{ach.title}</h3>
                {ach.description && (
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">{ach.description}</p>
                )}
              </div>

              {ach.evidence && ach.evidence.length > 0 && (
                <div className="pt-3 border-t border-surface-border space-y-1">
                  {ach.evidence.map((ev) => (
                    <a
                      key={ev.id}
                      href={ev.external_url || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-1.5 text-xs text-brand-cyan hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{ev.caption || 'Verified Evidence Link'}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Record Breakthrough Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Major Breakthrough">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Breakthrough Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Published Mission OS to Production / Read 300 pages"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 border border-surface-border text-white text-sm focus:outline-none focus:border-brand-amber"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Synthesized Impact / Story</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this a milestone accomplishment? What challenges did you overcome?"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-50 border border-surface-border text-white text-sm focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Proof of Work URL (GitHub / Demo / Doc)</label>
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://github.com/your-repo"
              className="w-full px-3.5 py-2 rounded-xl bg-surface-50 border border-surface-border text-white text-xs focus:outline-none"
            />
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
              Add to Wall of Fame
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
