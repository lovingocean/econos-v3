import React, { useState } from 'react';
import { WealthEngineItem, WealthEngineCategory } from '../../types/econos';
import { 
  Sparkles, 
  Cpu, 
  TrendingUp, 
  ShieldAlert, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Filter,
  Sliders
} from 'lucide-react';

interface WealthEnginesGridProps {
  engines: WealthEngineItem[];
  onSelectEngine?: (engine: WealthEngineItem) => void;
  onLaunchAdvisor?: () => void;
}

export const WealthEnginesGrid: React.FC<WealthEnginesGridProps> = ({
  engines,
  onSelectEngine,
  onLaunchAdvisor
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeEngineModal, setActiveEngineModal] = useState<WealthEngineItem | null>(null);

  const categories: WealthEngineCategory[] = [
    'INTELLIGENCE',
    'EXPANSION',
    'ACCELERATION',
    'DEFENSE',
    'OPTIMIZATION'
  ];

  const filteredEngines = engines.filter(
    e => selectedCategory === 'ALL' || e.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-600" />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">20 Autonomous Wealth Engines</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">Interconnected Sovereign Wealth Architecture</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Coordinated mathematical intelligence continuously maximizing compounding velocity, asset security, and cash allocation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-700 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 font-medium">
              Active Engines: <span className="text-emerald-700 font-bold">{engines.length}/20 Operational</span>
            </span>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono no-scrollbar">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-lg transition ${
            selectedCategory === 'ALL'
              ? 'bg-slate-900 text-white font-bold shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All 20 Engines
        </button>

        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white font-bold shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 20 Engines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEngines.map(eng => {
          const isHigh = eng.score >= 80;
          const isOptimal = eng.status === 'OPTIMAL';

          return (
            <div
              key={eng.id}
              onClick={() => setActiveEngineModal(eng)}
              className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 transition cursor-pointer shadow-xs hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    {eng.code} • #{eng.id}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    isOptimal
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {eng.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{eng.name}</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {eng.description}
                </p>

                {/* Metric Strip */}
                <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs flex justify-between items-center">
                  <span className="text-[11px] text-slate-500 truncate max-w-[150px]">{eng.metricLabel}:</span>
                  <span className="font-bold text-slate-900">{eng.metricValue}</span>
                </div>

                {/* Key Finding Preview */}
                <div className="mt-2 text-[11px] text-slate-600 bg-[#f0f7f3]/50 p-2.5 rounded-xl border border-[#d7e9dc] line-clamp-2">
                  <span className="text-emerald-800 font-mono text-[10px] font-bold block mb-0.5">Finding:</span>
                  {eng.keyFinding}
                </div>
              </div>

              {/* Action trigger footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500">Score: <strong className={isHigh ? 'text-emerald-700' : 'text-amber-700'}>{eng.score}/100</strong></span>
                <span className="text-slate-800 hover:text-slate-950 flex items-center gap-1 font-semibold">
                  <span>Inspect Engine</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Engine Detail Modal */}
      {activeEngineModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Engine {activeEngineModal.code}</span>
                <h3 className="text-base font-bold text-slate-900 font-sans">{activeEngineModal.name}</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px]">
                Category: {activeEngineModal.category}
              </span>
            </div>

            <p className="text-slate-600 font-sans text-xs leading-relaxed mb-4">
              {activeEngineModal.description}
            </p>

            <div className="space-y-3 mb-5">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block mb-0.5">Primary Key Metric</span>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">{activeEngineModal.metricLabel}</span>
                  <span className="text-base font-bold text-slate-900">{activeEngineModal.metricValue}</span>
                </div>
              </div>

              <div className="bg-[#f0f7f3] p-3 rounded-xl border border-[#d7e9dc]">
                <span className="text-[10px] text-emerald-800 font-bold block mb-0.5">Identified Fiduciary Finding</span>
                <p className="text-slate-800 font-sans text-xs">{activeEngineModal.keyFinding}</p>
              </div>

              <div className="bg-[#fdf9f1] p-3 rounded-xl border border-[#f4ebda]">
                <span className="text-[10px] text-amber-800 font-bold block mb-0.5">Highest-Leverage Recommended Action</span>
                <p className="text-slate-800 font-sans text-xs">{activeEngineModal.recommendedAction}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setActiveEngineModal(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                Close
              </button>
              {onLaunchAdvisor && (
                <button
                  onClick={() => {
                    setActiveEngineModal(null);
                    onLaunchAdvisor();
                  }}
                  className="px-4 py-1.5 rounded-lg bg-[#132338] hover:bg-[#0c1827] text-white font-bold transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Consult AI Advisor on this Engine</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
