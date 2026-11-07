import React, { useState } from 'react';
import { BookOpen, Lock, Send, Sparkles, Smile, Heart, Star } from 'lucide-react';
import { useSound } from '../contexts/SoundContext.js';

export const JournalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'journal' | 'future_me'>('journal');
  const [journalContent, setJournalContent] = useState('');
  const [mood, setMood] = useState(5);
  const [futureTitle, setFutureTitle] = useState('');
  const [futureBody, setFutureBody] = useState('');
  const [unlockDate, setUnlockDate] = useState('2027-01-01');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const { playComplete, playClick } = useSound();

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalContent.trim()) return;
    playComplete();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    setJournalContent('');
  };

  const handleSaveFutureMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!futureTitle.trim() || !futureBody.trim()) return;
    playComplete();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    setFutureTitle('');
    setFutureBody('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-brand-purple" />
            <span>Journal & Future Self Time Capsule</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Capture daily mental reflections, breakthroughs, and send sealed letters to your future self.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-xl bg-surface-100 border border-surface-border">
          <button
            onClick={() => { playClick(); setActiveTab('journal'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'journal'
                ? 'bg-brand-purple text-white shadow-glow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Daily Reflection
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('future_me'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'future_me'
                ? 'bg-brand-purple text-white shadow-glow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Dear Future Me ✉️
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Successfully sealed and recorded in your permanent ledger.</span>
        </div>
      )}

      {activeTab === 'journal' ? (
        <div className="glass-panel rounded-2xl p-6 border border-surface-border space-y-4">
          <h3 className="text-sm font-bold text-white">Daily Stoic Reflection & Synthesis</h3>

          {/* Mood Selector */}
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-400">Mental Clarity Score:</span>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMood(val)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                    mood === val
                      ? 'bg-brand-purple text-white shadow-glow'
                      : 'bg-surface-50 text-gray-400 border border-surface-border hover:border-brand-purple/40'
                  }`}
                >
                  {val}★
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSaveJournal} className="space-y-4">
            <textarea
              rows={8}
              value={journalContent}
              onChange={(e) => setJournalContent(e.target.value)}
              placeholder="What went well today? What challenges arose? What will you do 1% better tomorrow?"
              className="w-full p-4 rounded-xl bg-surface-50 border border-surface-border text-white text-sm focus:outline-none focus:border-brand-purple leading-relaxed resize-none"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-semibold shadow-glow hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Entry</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Dear Future Me */
        <div className="glass-panel rounded-2xl p-6 border border-surface-border space-y-4">
          <div className="p-4 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-start space-x-3">
            <Lock className="w-5 h-5 text-brand-purple mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-purple-300">Sealed Horizon Capsule</h4>
              <p className="text-xs text-gray-300 mt-0.5">
                Letters written here are encrypted and locked. They cannot be opened in the UI until the arrival of the unlock date you designate.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveFutureMe} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-1">Letter Subject</label>
                <input
                  type="text"
                  required
                  value={futureTitle}
                  onChange={(e) => setFutureTitle(e.target.value)}
                  placeholder="e.g. A message to myself when Mission OS scales to 10k users"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-50 border border-surface-border text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Unlock Target Date</label>
                <input
                  type="date"
                  required
                  value={unlockDate}
                  onChange={(e) => setUnlockDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-50 border border-surface-border text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            <textarea
              rows={7}
              required
              value={futureBody}
              onChange={(e) => setFutureBody(e.target.value)}
              placeholder="Dear Future Me, today I took the first step towards..."
              className="w-full p-4 rounded-xl bg-surface-50 border border-surface-border text-white text-sm focus:outline-none focus:border-brand-purple resize-none"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 text-white text-xs font-semibold shadow-glow hover:brightness-110 flex items-center space-x-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Seal Letter into Vault</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
