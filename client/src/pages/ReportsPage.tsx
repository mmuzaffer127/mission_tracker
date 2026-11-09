import React, { useState } from 'react';
import { FileText, Sparkles, Printer } from 'lucide-react';
import { api } from '../lib/api.js';
import { useSound } from '../contexts/SoundContext.js';

export const ReportsPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [reportMarkdown, setReportMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { playComplete, playClick } = useSound();

  const handleGenerateSynthesis = async () => {
    try {
      playClick();
      setLoading(true);
      const res = await api.generateMonthlySynthesis(selectedMonth);
      setReportMarkdown(res.reportMarkdown);
      playComplete();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-2"
            style={{ letterSpacing: '-0.06em' }}
          >
            <FileText className="w-6 h-6 text-white" />
            <span>Executive Monthly & Annual Reports</span>
          </h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.60)' }}>
            Grounded retrospective dossiers synthesising verified database metrics into actionable intelligence.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="btn-glass flex items-center space-x-1.5 text-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleGenerateSynthesis}
            disabled={loading}
            className="btn-primary flex items-center space-x-1.5 text-xs disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Synthesizing...' : 'Synthesize AI Briefing'}</span>
          </button>
        </div>
      </div>

      {/* Report Preview Document Canvas */}
      <div
        className="rounded-2xl p-8 space-y-6 print:bg-white print:text-black"
        style={{
          background: 'rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
        }}
      >
        <div
          className="flex items-center justify-between pb-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}
        >
          <div>
            <span className="text-[10px] font-mono uppercase text-white/70">Mission OS Intelligence Dossier</span>
            <h2 className="text-xl font-bold text-white mt-1">Executive Growth Review — {selectedMonth}</h2>
          </div>
          <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.50)' }}>CONFIDENTIAL & VERIFIED</span>
        </div>

        {reportMarkdown ? (
          <div className="max-w-none text-xs sm:text-sm leading-relaxed space-y-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
            <div dangerouslySetInnerHTML={{ __html: reportMarkdown.replace(/\n/g, '<br/>') }} />
          </div>
        ) : (
          <div className="text-center py-12 space-y-3" style={{ color: 'rgba(255,255,255,0.60)' }}>
            <FileText className="w-12 h-12 mx-auto opacity-30 text-white" />
            <h3 className="text-sm font-bold text-white">No report generated for {selectedMonth} yet.</h3>
            <p className="text-xs max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.50)' }}>
              Click "Synthesize AI Briefing" to automatically extract completed missions, habit consistency, and breakthroughs into an executive retrospective report.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
