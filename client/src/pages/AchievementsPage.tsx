import React, { useEffect, useState } from 'react';
import { Trophy, Plus, ExternalLink, Calendar } from 'lucide-react';
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
          <h1
            className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-2"
            style={{ letterSpacing: '-0.06em' }}
          >
            <Trophy className="w-6 h-6 text-white" />
            <span>Achievement Wall of Fame</span>
          </h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.60)' }}>
            Historical records are permanent. Every month builds your lifetime resume of accomplishments.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Historical Month Selector */}
          <div
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs text-white"
            style={{
              background: 'rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
            }}
          >
            <Calendar className="w-4 h-4 text-white/70" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent focus:outline-none text-white font-mono cursor-pointer"
            >
              {monthOptions.map((m) => (
                <option key={m.val} value={m.val} className="bg-[#1129e2] text-white">
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center space-x-1.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Record Breakthrough</span>
          </button>
        </div>
      </div>

      {/* Grid of Verified Breakthroughs */}
      {achievements.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: 'rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
          }}
        >
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30 text-white" />
          <h3 className="text-base font-bold text-white">No achievements recorded for this month yet.</h3>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.60)' }}>
            Complete your tactical missions to unlock verified entries on your Wall of Fame.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="glass-card p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md font-bold text-white"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)'
                    }}
                  >
                    +{ach.xp_awarded} XP
                  </span>
                  <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {new Date(ach.unlocked_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-3">{ach.title}</h3>
                {ach.description && (
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {ach.description}
                  </p>
                )}
              </div>

              {ach.evidence && ach.evidence.length > 0 && (
                <div
                  className="pt-3 space-y-1"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}
                >
                  {ach.evidence.map((ev) => (
                    <a
                      key={ev.id}
                      href={ev.external_url || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-1.5 text-xs text-white/80 hover:text-white hover:underline transition-opacity"
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
            <label className="glass-label">Breakthrough Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Published Mission OS to Production / Read 300 pages"
              className="glass-input text-sm"
            />
          </div>

          <div>
            <label className="glass-label">Synthesized Impact / Story</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this a milestone accomplishment? What challenges did you overcome?"
              className="glass-textarea text-sm"
            />
          </div>

          <div>
            <label className="glass-label">Proof of Work URL (GitHub / Demo / Doc)</label>
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://github.com/your-repo"
              className="glass-input text-xs"
            />
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
              Add to Wall of Fame
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
