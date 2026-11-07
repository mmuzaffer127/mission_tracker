import React, { useState } from 'react';
import { FileText, Download, Sparkles, Printer, Calendar } from 'lucide-react';
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
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <FileText className="w-6 h-6 text-brand-blue" />
            <span>Executive Monthly & Annual Reports</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Grounded retrospective dossiers synthesising verified database metrics into actionable intelligence.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-surface-border text-xs text-gray-300 hover:text-white transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleGenerateSynthesis}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-xs font-semibold shadow-glow hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Synthesizing...' : 'Synthesize AI Briefing'}</span>
          </button>
        </div>
      </div>

      {/* Report Preview Document Canvas */}
      <div className="glass-panel rounded-2xl p-8 border border-surface-border space-y-6 print:bg-white print:text-black">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div>
            <span className="text-[10px] font-mono uppercase text-brand-blue">Mission OS Intelligence Dossier</span>
            <h2 className="text-xl font-bold text-white mt-1">Executive Growth Review — {selectedMonth}</h2>
          </div>
          <span className="text-xs text-gray-400 font-mono">CONFIDENTIAL & VERIFIED</span>
        </div>

        {reportMarkdown ? (
          <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-gray-300 space-y-4">
            <div dangerouslySetInnerHTML={{ __html: reportMarkdown.replace(/\n/g, '<br/>') }} />
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 space-y-3">
            <FileText className="w-12 h-12 mx-auto text-gray-600" />
            <h3 className="text-sm font-bold text-gray-300">No report generated for {selectedMonth} yet.</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Click "Synthesize AI Briefing" to automatically extract completed missions, habit consistency, and breakthroughs into an executive retrospective report.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
