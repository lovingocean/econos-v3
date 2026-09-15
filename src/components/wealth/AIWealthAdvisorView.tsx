import React, { useState } from 'react';
import { api } from '../../api/client';
import { 
  Sparkles, 
  Send, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  Cpu,
  BrainCircuit,
  Lock
} from 'lucide-react';

interface AIWealthAdvisorViewProps {
  onSimulateRecommendation?: () => void;
}

export const AIWealthAdvisorView: React.FC<AIWealthAdvisorViewProps> = ({ onSimulateRecommendation }) => {
  const [query, setQuery] = useState('What is the single highest-leverage way to close my wealth gap and optimize enterprise working capital?');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any | null>(null);

  const suggestedQueries = [
    'What is the single highest-leverage way to close my wealth gap?',
    'How much corporate cash can I safely distribute without hurting runway?',
    'Should I prioritize cost optimization or new customer acquisition first?',
    'What autonomous agent permissions can I safely grant to execute cost cuts?'
  ];

  const handleConsult = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q) return;
    setIsLoading(true);
    try {
      const res = await api.consultWealthAdvisor(q);
      setResponse(res);
    } catch (err: any) {
      alert('AI Advisor consultation failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">Autonomous Sovereign Fiduciary Engine</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">AI Wealth & Enterprise Strategic Advisor</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              10-step fiduciary reasoning loop backed by Gemini 3.8 Flash model abstraction & mathematical ground truth.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 font-mono text-xs border border-slate-200 flex items-center gap-1.5 font-medium">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Model Abstraction Active</span>
            </span>
          </div>
        </div>

        {/* Input & Quick Chips */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleConsult()}
              placeholder="Ask a strategic economic, wealth, or agent delegation question..."
              className="w-full pl-4 pr-28 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-slate-800 font-sans shadow-2xs"
            />
            <button
              onClick={() => handleConsult()}
              disabled={isLoading}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-[#132338] hover:bg-[#0c1827] text-white font-bold text-xs font-mono transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Reasoning...</span>
              ) : (
                <>
                  <span>Consult</span>
                  <Send className="w-3 h-3" />
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-400 text-[10px] uppercase mr-1">Recommended Inquiries:</span>
            {suggestedQueries.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(sq);
                  handleConsult(sq);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition text-[11px] truncate max-w-xs"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Structured Advisor Response */}
      {response && (
        <div className="space-y-6">
          {/* Top Fiduciary Assessment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Goal */}
            <div className="bg-[#eff5fb] border border-[#d9e6f2] rounded-2xl p-5 font-mono text-xs shadow-xs">
              <span className="text-[10px] text-slate-600 block mb-1 uppercase font-bold">1. Target Wealth Goal</span>
              <div className="text-sm font-bold text-slate-900 font-sans">{response.wealthGoal}</div>
            </div>

            {/* 2. Trajectory */}
            <div className="bg-[#f0f7f3] border border-[#d7e9dc] rounded-2xl p-5 font-mono text-xs shadow-xs">
              <span className="text-[10px] text-emerald-800 block mb-1 uppercase font-bold">2. Trajectory Velocity</span>
              <div className="text-sm font-bold text-slate-900 font-sans">{response.currentTrajectory}</div>
            </div>

            {/* 3. Constraint */}
            <div className="bg-[#fdf9f1] border border-[#f4ebda] rounded-2xl p-5 font-mono text-xs shadow-xs">
              <span className="text-[10px] text-amber-800 block mb-1 uppercase font-bold">3. Primary Structural Constraint</span>
              <div className="text-sm font-bold text-slate-900 font-sans">{response.largestConstraint}</div>
            </div>

          </div>

          {/* Highest-Leverage Recommendation Banner */}
          {response.highestLeverageRecommendation && (
            <div className="bg-white border border-amber-300 rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-mono text-[10px] font-bold border border-amber-200">
                      HIGHEST-LEVERAGE ACTIONABLE RECOMMENDATION
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Horizon: {response.highestLeverageRecommendation.timeframe}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {response.highestLeverageRecommendation.actionTitle}
                  </h3>
                  <p className="text-xs text-slate-700 mt-2 whitespace-pre-line leading-relaxed font-mono bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    {response.highestLeverageRecommendation.detailedPlan}
                  </p>
                </div>

                <div className="sm:w-56 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between self-start sm:self-auto">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Projected Net Value</span>
                    <div className="text-xl font-mono font-black text-emerald-700">
                      +${response.highestLeverageRecommendation.projectedImpact.toLocaleString()}
                    </div>
                  </div>

                  {onSimulateRecommendation && (
                    <button
                      onClick={onSimulateRecommendation}
                      className="mt-3 w-full py-1.5 px-3 rounded-lg bg-[#132338] hover:bg-[#0c1827] text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <span>Simulate in What-If</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Ranked Opportunities Generated */}
          {response.rankedOpportunities && response.rankedOpportunities.length > 0 && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <h3 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider mb-3">
                Mathematically Ranked Strategic Opportunities ({response.rankedOpportunities.length})
              </h3>
              <div className="space-y-3 font-mono text-xs">
                {response.rankedOpportunities.map((opp: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-amber-700">RANK #{idx + 1}</span>
                        <span className="font-bold text-slate-900 font-sans text-sm">{opp.title}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{opp.reasonForConfidence}</p>
                      <div className="mt-1 text-slate-500 text-[10px]">Main Risk: {opp.mainRisk}</div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Confidence</span>
                        <span className="text-slate-800 font-bold">{opp.confidencePercent}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Projected Impact</span>
                        <span className="text-emerald-700 font-bold text-sm">+${opp.projectedImpactUsd.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mandatory Epistemic Integrity Classification (FACT vs ASSUMPTION vs ESTIMATE vs PROJECTION) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            {/* FACTS */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold mb-2">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span>VERIFIED FACTS</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                {response.facts?.map((f: string, i: number) => (
                  <li key={i} className="leading-snug">• {f}</li>
                ))}
              </ul>
            </div>

            {/* ASSUMPTIONS */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center gap-1.5 text-sky-800 font-bold mb-2">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span>KEY ASSUMPTIONS</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                {response.assumptions?.map((a: string, i: number) => (
                  <li key={i} className="leading-snug">• {a}</li>
                ))}
              </ul>
            </div>

            {/* ESTIMATES */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center gap-1.5 text-purple-800 font-bold mb-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>MODEL ESTIMATES</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                {response.estimates?.map((e: string, i: number) => (
                  <li key={i} className="leading-snug">• {e}</li>
                ))}
              </ul>
            </div>

            {/* PROJECTIONS */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>PROJECTIONS (UNCERTAIN)</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                {response.projections?.map((p: string, i: number) => (
                  <li key={i} className="leading-snug">• {p}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Fiduciary Disclaimer & Model Attribution */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>{response.disclaimer}</span>
            <span className="text-slate-600 font-medium">Model: {response.aiProvider}</span>
          </div>
        </div>
      )}
    </div>
  );
};
