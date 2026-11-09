import React, { useState } from 'react';
import { Sparkles, BrainCircuit, CheckCircle2, Target } from 'lucide-react';
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
        <h1
          className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-2"
          style={{ letterSpacing: '-0.06em' }}
        >
          <BrainCircuit className="w-6 h-6 text-white" />
          <span>Gemini AI Growth Architect</span>
        </h1>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.60)' }}>
          Turn vague ambitions into structured, ordered milestones and tactical missions powered by Gemini 2.5.
        </p>
      </div>

      {/* Generator Prompt Panel */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{
          background: 'rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
        }}
      >
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="glass-label">
              Your Big Ambition / Target Outcome *
            </label>
            <input
              type="text"
              required
              value={ambitionInput}
              onChange={(e) => setAmbitionInput(e.target.value)}
              placeholder="e.g. Master Distributed Systems Engineering & Deploy Full-Stack Microservices"
              className="glass-input text-sm py-3"
            />
          </div>

          <div>
            <label className="glass-label">
              Personal Context / Constraints / Timeline (Optional)
            </label>
            <textarea
              rows={2}
              value={contextInput}
              onChange={(e) => setContextInput(e.target.value)}
              placeholder="e.g. I have 2 hours per day, basic React knowledge, aiming for a 90-day execution sprint."
              className="glass-textarea text-xs"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2 text-xs disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Synthesizing Roadmap...' : 'Generate Master Roadmap'}</span>
            </button>
          </div>
        </form>
      </div>

      {committedSuccess && (
        <div
          className="p-4 rounded-xl text-xs flex items-center justify-between text-white"
          style={{
            background: 'rgba(255,255,255,0.16)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.28)'
          }}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>Successfully committed this goal, all milestones, and missions into your live operating system!</span>
          </div>
        </div>
      )}

      {/* Generated Roadmap Preview */}
      {generatedRoadmap && (
        <div
          className="rounded-2xl p-6 space-y-6"
          style={{
            background: 'rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
          }}
        >
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}
          >
            <div>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-md uppercase text-white font-bold"
                style={{
                  background: 'rgba(255,255,255,0.14)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.22)'
                }}
              >
                AI Architected Plan
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{generatedRoadmap.goalTitle}</h2>
            </div>

            <button
              onClick={handleCommitToDatabase}
              disabled={committedSuccess}
              className="btn-primary flex items-center space-x-2 text-xs disabled:opacity-50"
            >
              <Target className="w-4 h-4" />
              <span>{committedSuccess ? 'Committed to OS' : 'Commit All to Database'}</span>
            </button>
          </div>

          {/* Sequential Milestones */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: 'rgba(255,255,255,0.60)' }}
            >
              1. Sequential Goal Milestones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {generatedRoadmap.milestones?.map((ms: any, i: number) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl flex items-center space-x-3"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)'
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-full font-mono font-bold text-xs flex items-center justify-center"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      color: '#ffffff'
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-xs text-white">{ms.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Tactical Missions */}
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: 'rgba(255,255,255,0.60)' }}
            >
              2. Tactical Launch Missions & Subtasks
            </h3>
            <div className="space-y-3">
              {generatedRoadmap.actionableMissions?.map((m: any, i: number) => (
                <div
                  key={i}
                  className="p-4 rounded-xl space-y-2"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">{m.title}</h4>
                    <span
                      className="text-[10px] font-mono uppercase px-2 py-0.5 rounded text-white"
                      style={{
                        background: 'rgba(255,255,255,0.12)',
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
                      }}
                    >
                      {m.priority} priority
                    </span>
                  </div>
                  {m.subtasks && (
                    <ul className="text-xs space-y-1 list-disc list-inside" style={{ color: 'rgba(255,255,255,0.65)' }}>
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
