import React, { useState } from 'react';
import { Scenario, EconomicProfile, Opportunity } from '../../types/econos';
import { api } from '../../api/client';
import { 
  Sliders, 
  TrendingUp, 
  DollarSign, 
  HelpCircle, 
  ShieldCheck, 
  Bookmark, 
  Layers, 
  AlertTriangle,
  ArrowRight,
  Info
} from 'lucide-react';

interface ScenarioEngineProps {
  profile: EconomicProfile | null;
  scenarios: Scenario[];
  onRefresh: () => void;
  prefillOpportunity?: Opportunity | null;
}

export const ScenarioEngine: React.FC<ScenarioEngineProps> = ({
  profile,
  scenarios,
  onRefresh,
  prefillOpportunity
}) => {
  // Baseline inputs
  const baseRevenue = profile?.monthlyRevenue || 100000;
  const baseCogs = profile?.monthlyCogs || 30000;
  const baseOpex = profile?.monthlyOpex || 40000;
  const baseCash = profile?.cashOnHand || 500000;
  const baseNetProfit = baseRevenue - baseCogs - baseOpex;

  // Sensitivity Sliders
  const [scenarioName, setScenarioName] = useState(prefillOpportunity ? `Simulation: ${prefillOpportunity.title}` : 'Strategic Expansion & Efficiency Simulation');
  const [revAdjustment, setRevAdjustment] = useState(prefillOpportunity?.category === 'REVENUE_EXPANSION' ? 15 : 0);
  const [cogsAdjustment, setCogsAdjustment] = useState(prefillOpportunity?.category === 'COST_OPTIMIZATION' ? -10 : 0);
  const [opexAdjustment, setOpexAdjustment] = useState(0);
  const [newHires, setNewHires] = useState(0);
  const [avgSalary, setAvgSalary] = useState(120000);
  const [capitalInvestment, setCapitalInvestment] = useState(prefillOpportunity?.capitalRequired || 0);
  const [priceIncrease, setPriceIncrease] = useState(prefillOpportunity?.category === 'PRICING_STRATEGY' ? 5 : 0);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Mathematical Real-time Calculation
  const projectedRevenue = Math.round(baseRevenue * (1 + (revAdjustment + priceIncrease) / 100));
  const projectedCogs = Math.round(baseCogs * (1 + cogsAdjustment / 100));
  const addedMonthlySalary = Math.round((newHires * avgSalary) / 12);
  const projectedOpex = Math.round(baseOpex * (1 + opexAdjustment / 100) + addedMonthlySalary);
  const projectedNetProfit = projectedRevenue - projectedCogs - projectedOpex;
  const profitDelta = projectedNetProfit - baseNetProfit;
  const remainingCash = Math.max(0, baseCash - capitalInvestment);
  const projectedRunway = projectedNetProfit >= 0 ? 99 : Number((remainingCash / Math.abs(projectedNetProfit)).toFixed(1));

  const handleSaveScenario = async () => {
    setIsSaving(true);
    try {
      await api.createScenario({
        name: scenarioName,
        revenueAdjustmentPct: revAdjustment,
        cogsAdjustmentPct: cogsAdjustment,
        opexAdjustmentPct: opexAdjustment,
        newHiresCount: newHires,
        averageSalary: avgSalary,
        capitalInvestment,
        priceIncreasePct: priceIncrease
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      onRefresh();
    } catch (err) {
      alert('Failed to save scenario: ' + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">What-If Economic Simulation Engine</span>
            </div>
            <h2 className="text-lg font-bold text-zinc-100 mt-1">Multi-Variable Sensitivity Modeling</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Simulate cash flow, profitability, and runway variations prior to deploying autonomous agent execution.
            </p>
          </div>

          <button
            id="save-scenario-btn"
            onClick={handleSaveScenario}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition self-start sm:self-auto"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : savedSuccess ? 'Scenario Saved!' : 'Save Scenario'}</span>
          </button>
        </div>
      </div>

      {/* Main Simulation Panel: Controls (Left) & Real-Time Projections (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sensitivity Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-5">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">Scenario Identifier</label>
              <input
                type="text"
                value={scenarioName}
                onChange={e => setScenarioName(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-xs text-zinc-100 outline-none focus:border-amber-400"
              />
            </div>

            {/* Slider 1: Top-line Organic Volume Growth */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <span className="text-zinc-300">Organic Sales Volume Growth:</span>
                <span className={`font-bold ${revAdjustment >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {revAdjustment > 0 ? `+${revAdjustment}%` : `${revAdjustment}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="100"
                step="5"
                value={revAdjustment}
                onChange={e => setRevAdjustment(Number(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-zinc-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-0.5">
                <span>-50% (Contraction)</span>
                <span>0% (Baseline)</span>
                <span>+100% (Doubling)</span>
              </div>
            </div>

            {/* Slider 2: Pricing Strategy Adjustment */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <span className="text-zinc-300">Price Increase / Pricing Power:</span>
                <span className="font-bold text-amber-300">+{priceIncrease}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={priceIncrease}
                onChange={e => setPriceIncrease(Number(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-zinc-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-0.5">
                <span>0%</span>
                <span>+15%</span>
                <span>+30%</span>
              </div>
            </div>

            {/* Slider 3: COGS Optimization */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <span className="text-zinc-300">COGS / Direct Cost Delta:</span>
                <span className={`font-bold ${cogsAdjustment <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {cogsAdjustment > 0 ? `+${cogsAdjustment}%` : `${cogsAdjustment}%`}
                </span>
              </div>
              <input
                type="range"
                min="-40"
                max="40"
                step="5"
                value={cogsAdjustment}
                onChange={e => setCogsAdjustment(Number(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-zinc-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-0.5">
                <span>-40% (Optimization)</span>
                <span>0%</span>
                <span>+40% (Inflation)</span>
              </div>
            </div>

            {/* Headcount Hiring & CapEx Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-800">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">New Hires</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={newHires}
                  onChange={e => setNewHires(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-xs text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Avg Salary ($)</label>
                <input
                  type="number"
                  step="5000"
                  value={avgSalary}
                  onChange={e => setAvgSalary(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-xs text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">One-Time CapEx ($)</label>
                <input
                  type="number"
                  step="5000"
                  value={capitalInvestment}
                  onChange={e => setCapitalInvestment(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-xs text-zinc-100 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical Projection & Epistemic Categorization (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Real-Time Mathematical Delta */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
            <div className="text-xs font-mono uppercase text-zinc-400 mb-2 font-semibold">
              Simulated Financial Outcome
            </div>

            <div className="space-y-3 font-mono">
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <div className="flex justify-between text-xs text-zinc-400 mb-0.5">
                  <span>Projected Monthly Revenue</span>
                  <span className="text-zinc-500">Baseline: ${baseRevenue.toLocaleString()}</span>
                </div>
                <div className="text-xl font-bold text-zinc-100">
                  ${projectedRevenue.toLocaleString()}
                </div>
              </div>

              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <div className="flex justify-between text-xs text-zinc-400 mb-0.5">
                  <span>Projected Net Monthly Profit</span>
                  <span className="text-zinc-500">Delta: {profitDelta >= 0 ? `+$${profitDelta.toLocaleString()}` : `-$${Math.abs(profitDelta).toLocaleString()}`}</span>
                </div>
                <div className={`text-xl font-bold ${projectedNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${projectedNetProfit.toLocaleString()}
                </div>
              </div>

              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <div className="flex justify-between text-xs text-zinc-400 mb-0.5">
                  <span>Cash Runway</span>
                  <span className="text-zinc-500">Liquid: ${remainingCash.toLocaleString()}</span>
                </div>
                <div className="text-lg font-bold text-indigo-300">
                  {projectedRunway >= 99 ? 'Infinite (Cash Flow Positive)' : `${projectedRunway} Months`}
                </div>
              </div>
            </div>
          </div>

          {/* Strict Epistemic Boundaries Banner (Prompt requirement: distinguish Fact, Assumption, Estimate, Projection, Recommendation) */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs font-mono space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold border-b border-zinc-800 pb-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Epistemic Data Classification</span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div>
                <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold mr-1">FACT</span>
                <span className="text-zinc-400">Current baseline revenue is ${baseRevenue.toLocaleString()} and cash is ${baseCash.toLocaleString()}.</span>
              </div>

              <div>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold mr-1">ASSUMPTION</span>
                <span className="text-zinc-400">Churn rate remains below 2% despite +{priceIncrease}% pricing adjustment.</span>
              </div>

              <div>
                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold mr-1">ESTIMATE</span>
                <span className="text-zinc-400">Hiring {newHires} personnel costs ~${addedMonthlySalary.toLocaleString()}/mo in fully loaded OpEx.</span>
              </div>

              <div>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold mr-1">PROJECTION</span>
                <span className="text-zinc-400">Simulated monthly profit of ${projectedNetProfit.toLocaleString()} (Not guaranteed).</span>
              </div>

              <div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold mr-1">RECOMMENDATION</span>
                <span className="text-zinc-400">
                  {projectedNetProfit > 0 
                    ? 'Accretive to working capital. Authorize agent negotiation within $15,000 threshold.' 
                    : 'Causes cash burn. Require board review before deployment.'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Saved Scenarios History */}
      {scenarios.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-zinc-200 mb-3 font-mono">Saved Scenario Catalog ({scenarios.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {scenarios.map(scen => (
              <div key={scen.id} className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800 font-mono text-xs">
                <div className="font-bold text-zinc-100 truncate mb-1">{scen.name}</div>
                <div className="text-zinc-400 text-[11px] mb-2">{scen.description}</div>
                <div className="space-y-1 text-[10px] border-t border-zinc-850 pt-2 text-zinc-400">
                  <div className="flex justify-between">
                    <span>Projected Profit:</span>
                    <span className="text-emerald-400 font-bold">${scen.projectedNetProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Runway:</span>
                    <span>{scen.projectedRunwayMonths >= 99 ? 'Infinite' : `${scen.projectedRunwayMonths} mo`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
