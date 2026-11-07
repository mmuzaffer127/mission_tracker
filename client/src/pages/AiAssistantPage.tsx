import React, { useState } from 'react';
import { Sparkles, Send, BrainCircuit, ArrowRight, CheckCircle2, Target } from 'lucide-react';
import { api } from '../lib/api.js';
import { useSound } from '../contexts/SoundContext.js';

export const AiAssistantPage: React.FC = () => {
  const [ambitionInput, setAmbitionInput] = useState('');
  const [contextInput, setContextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState<any | null>(null);
  const [committedSuccess, setCommittedSuccess] = useState(false);

  const { playComplete, playClick } = useSound();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ambitionInput.trim()) return;

    try {
      setLoading(true);
      playClick();
      setGeneratedRoadmap(null);
      setCommittedSuccess(false);

      const res = await api.generateRoadmap(ambitionInput, contextInput);
      setGeneratedRoadmap(res);
      playComplete();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommitToDatabase = async () => {
    if (!generatedRoadmap) return;
    try {
      playClick();
      // 1. Create master goal with milestones
      await api.createGoal({
        title: generatedRoadmap.goalTitle,
        timeframe: generatedRoadmap.timeframe || 'quarterly',
        milestones: generatedRoadmap.milestones?.map((m: any) => m.title) || []
      });

      // 2. Create actionable tactical missions
      for (const m of generatedRoadmap.actionableMissions || []) {
        await api.createMission({
          title: m.title,
          priority: m.priority || 'high',
          subtasks: m.subtasks || []
        });
      }

      playComplete();
      setCommittedSuccess(true);
    } catch (err) {
      console.error('Failed to commit generated roadmap:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <BrainCircuit className="w-6 h-6 text-brand-purple" />
          <span>Gemini AI Growth Architect</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Turn vague ambitions into structured, ordered milestones and tactical missions powered by Gemini 2.5.
        </p>
      </div>

      {/* Generator Prompt Panel */}
      <div className="glass-panel rounded-2xl p-6 border border-surface-border space-y-4">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Your Big Ambition / Target Outcome *
            </label>
            <input
              type="text"
              required
              value={ambitionInput}
              onChange={(e) => setAmbitionInput(e.target.value)}
              placeholder="e.g. Master Distributed Systems Engineering & Deploy Full-Stack Microservices"
              className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-border text-white text-sm focus:outline-none focus:border-brand-purple"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Personal Context / Constraints / Timeline (Optional)
            </label>
            <textarea
              rows={2}
              value={contextInput}
              onChange={(e) => setContextInput(e.target.value)}
              placeholder="e.g. I have 2 hours per day, basic React knowledge, aiming for a 90-day execution sprint."
              className="w-full px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-border text-white text-xs focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple via-indigo-600 to-brand-blue text-white text-xs font-semibold shadow-glow hover:brightness-110 active:scale-95 disabled:opacity-50 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Synthesizing Roadmap...' : 'Generate Master Roadmap'}</span>
            </button>
          </div>
        </form>
      </div>

      {committedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Successfully committed this goal, all milestones, and missions into your live operating system!</span>
          </div>
        </div>
      )}

      {/* Generated Roadmap Preview */}
      {generatedRoadmap && (
        <div className="glass-panel rounded-2xl p-6 border border-purple-500/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-border gap-3">
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase">
                AI Architected Plan
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{generatedRoadmap.goalTitle}</h2>
            </div>

            <button
              onClick={handleCommitToDatabase}
              disabled={committedSuccess}
              className="px-5 py-2.5 rounded-xl bg-brand-emerald text-black text-xs font-bold shadow-glow hover:brightness-110 active:scale-95 disabled:opacity-50 flex items-center space-x-2"
            >
              <Target className="w-4 h-4" />
              <span>{committedSuccess ? 'Committed to OS' : 'Commit All to Database'}</span>
            </button>
          </div>

          {/* Sequential Milestones */}
          <div>
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
              1. Sequential Goal Milestones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {generatedRoadmap.milestones?.map((ms: any, i: number) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-surface-50 border border-surface-border flex items-center space-x-3"
                >
                  <span className="w-6 h-6 rounded-full bg-brand-purple/20 text-brand-purple font-mono font-bold text-xs flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-xs text-gray-200">{ms.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Tactical Missions */}
          <div>
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
              2. Tactical Launch Missions & Subtasks
            </h3>
            <div className="space-y-3">
              {generatedRoadmap.actionableMissions?.map((m: any, i: number) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-surface-50 border border-surface-border space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">{m.title}</h4>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {m.priority} priority
                    </span>
                  </div>
                  {m.subtasks && (
                    <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                      {m.subtasks.map((st: string, idx: number) => (
                        <li key={idx}>{st}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
