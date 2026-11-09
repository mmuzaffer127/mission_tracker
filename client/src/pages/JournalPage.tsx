import React, { useState } from 'react';
import { BookOpen, Lock, Send, Sparkles } from 'lucide-react';
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
          <h1
            className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-2"
            style={{ letterSpacing: '-0.06em' }}
          >
            <BookOpen className="w-6 h-6 text-white" />
            <span>Journal & Future Self Time Capsule</span>
          </h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.60)' }}>
            Capture daily mental reflections, breakthroughs, and send sealed letters to your future self.
          </p>
        </div>

        {/* Tab switch */}
        <div
          className="flex items-center p-1 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
          }}
        >
          <button
            onClick={() => { playClick(); setActiveTab('journal'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'journal'
                ? 'bg-white text-[#1129e2] shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Daily Reflection
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('future_me'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'future_me'
                ? 'bg-white text-[#1129e2] shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Dear Future Me ✉️
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div
          className="p-3 rounded-xl text-xs flex items-center space-x-2 text-white"
          style={{
            background: 'rgba(255,255,255,0.18)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.30)'
          }}
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>Successfully sealed and recorded in your permanent ledger.</span>
        </div>
      )}

      {activeTab === 'journal' ? (
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: 'rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
          }}
        >
          <h3 className="text-sm font-bold text-white">Daily Stoic Reflection & Synthesis</h3>

          {/* Mood Selector */}
          <div className="flex items-center space-x-3">
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>
              Mental Clarity Score:
            </span>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMood(val)}
                  className="w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all"
                  style={{
                    background: mood === val ? '#ffffff' : 'rgba(255,255,255,0.08)',
                    color: mood === val ? '#1129e2' : '#ffffff',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
                  }}
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
              className="glass-textarea leading-relaxed text-sm"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2 text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Entry</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Dear Future Me */
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: 'rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
          }}
        >
          <div
            className="p-4 rounded-xl flex items-start space-x-3"
            style={{
              background: 'rgba(255,255,255,0.06)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)'
            }}
          >
            <Lock className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">Sealed Horizon Capsule</h4>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.60)' }}>
                Letters written here are encrypted and locked. They cannot be opened in the UI until the arrival of the unlock date you designate.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveFutureMe} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="glass-label">Letter Subject</label>
                <input
                  type="text"
                  required
                  value={futureTitle}
                  onChange={(e) => setFutureTitle(e.target.value)}
                  placeholder="e.g. A message to myself when Mission OS scales to 10k users"
                  className="glass-input text-xs"
                />
              </div>

              <div>
                <label className="glass-label">Unlock Target Date</label>
                <input
                  type="date"
                  required
                  value={unlockDate}
                  onChange={(e) => setUnlockDate(e.target.value)}
                  className="glass-input text-xs"
                />
              </div>
            </div>

            <textarea
              rows={7}
              required
              value={futureBody}
              onChange={(e) => setFutureBody(e.target.value)}
              placeholder="Dear Future Me, today I took the first step towards..."
              className="glass-textarea text-sm"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2 text-xs"
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
