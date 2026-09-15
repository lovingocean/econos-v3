import React, { useState } from 'react';
import { WealthProfile } from '../../types/econos';
import { api } from '../../api/client';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  PieChart, 
  ShieldCheck, 
  Edit3, 
  Clock, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface WealthDashboardProps {
  profile: WealthProfile | null;
  onRefresh: () => void;
  onOpenAdvisor: () => void;
}

export const WealthDashboard: React.FC<WealthDashboardProps> = ({ profile, onRefresh, onOpenAdvisor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<WealthProfile>>({});

  const liquid = profile?.liquidAssets || 0;
  const illiquid = profile?.illiquidAssets || 0;
  const equity = profile?.businessEquityValue || 0;
  const debt = profile?.totalPersonalDebt || 0;
  const totalNetWorth = (liquid + illiquid + equity) - debt;
  const target = profile?.targetNetWorth || 10000000;
  const wealthGap = Math.max(0, target - totalNetWorth);
  const percentToTarget = Math.min(100, Math.round((totalNetWorth / target) * 100));

  const activeIncome = profile?.activeMonthlyIncome || 0;
  const passiveIncome = profile?.passiveMonthlyIncome || 0;
  const monthlyExpenses = profile?.monthlyPersonalExpenses || 0;
  const netMonthlySurplus = (activeIncome + passiveIncome) - monthlyExpenses;

  const handleOpenEdit = () => {
    if (profile) {
      setFormData({
        liquidAssets: profile.liquidAssets,
        illiquidAssets: profile.illiquidAssets,
        businessEquityValue: profile.businessEquityValue,
        totalPersonalDebt: profile.totalPersonalDebt,
        activeMonthlyIncome: profile.activeMonthlyIncome,
        passiveMonthlyIncome: profile.passiveMonthlyIncome,
        monthlyPersonalExpenses: profile.monthlyPersonalExpenses,
        targetNetWorth: profile.targetNetWorth,
        targetRetirementAge: profile.targetRetirementAge,
        currentAge: profile.currentAge
      });
    }
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateWealthProfile(formData);
      setIsEditing(false);
      onRefresh();
    } catch (err) {
      alert('Failed to update wealth profile: ' + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Net Worth & Wealth Gap */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">Personal & Enterprise Wealth Architecture</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                Risk Profile: {profile?.riskTolerance || 'MODERATE'}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-baseline gap-5">
              <div>
                <span className="text-xs font-mono text-slate-400 block">Total Estimated Net Worth</span>
                <span className="text-3xl font-black font-mono text-slate-900 tracking-tight">${totalNetWorth.toLocaleString()}</span>
              </div>

              <div className="h-8 w-px bg-slate-200 hidden sm:block" />

              <div>
                <span className="text-xs font-mono text-slate-400 block">Wealth Gap to Target</span>
                <span className="text-2xl font-black font-mono text-amber-600 tracking-tight">${wealthGap.toLocaleString()}</span>
              </div>

              <div className="h-8 w-px bg-slate-200 hidden sm:block" />

              <div>
                <span className="text-xs font-mono text-slate-400 block">Target Goal</span>
                <span className="text-xl font-bold font-mono text-slate-700">
                  ${target.toLocaleString()} <span className="text-xs text-slate-400 font-normal">by age {profile?.targetRetirementAge || 52}</span>
                </span>
              </div>
            </div>

            {/* Progress Bar towards Target */}
            <div className="mt-4 max-w-xl">
              <div className="flex justify-between text-xs font-mono text-slate-500 mb-1.5">
                <span>Milestone Trajectory Progress</span>
                <span className="text-emerald-700 font-bold">{percentToTarget}% Complete</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentToTarget}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 self-start lg:self-center">
            <button
              onClick={onOpenAdvisor}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#132338] hover:bg-[#0c1827] text-white font-bold text-xs font-mono transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Launch AI Wealth Advisor</span>
            </button>

            <button
              onClick={handleOpenEdit}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium font-mono transition shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-400" />
              <span>Adjust Targets & Balances</span>
            </button>
          </div>
        </div>
      </div>

      {/* Balance Sheet Composition & Cash Flow Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Assets & Liabilities */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <span className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider">Asset & Liability Distribution</span>
            <span className="text-[10px] font-mono text-slate-400">Current Valuation</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Liquid Reserves & Securities</span>
              <span className="font-bold text-emerald-700">${liquid.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Operating Business Equity</span>
              <span className="font-bold text-slate-900">${equity.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Illiquid Assets (Real Estate, IP)</span>
              <span className="font-bold text-slate-700">${illiquid.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Total Liabilities & Debt</span>
              <span className="font-bold text-rose-600">-${debt.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Personal Cash Flow Velocity */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <span className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider">Personal Cash Velocity</span>
            <span className="text-[10px] font-mono text-slate-400">Monthly Run-Rate</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Active Income (Distributions / Salary)</span>
              <span className="font-bold text-slate-800">${activeIncome.toLocaleString()}/mo</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Passive Capital Yields</span>
              <span className="font-bold text-emerald-700">+${passiveIncome.toLocaleString()}/mo</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Household Living Expenses</span>
              <span className="font-bold text-rose-600">-${monthlyExpenses.toLocaleString()}/mo</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-[#f0f7f3] border border-[#d7e9dc] text-emerald-800 font-bold">
              <span>Reinvestable Free Cash Flow Surplus</span>
              <span>+${netMonthlySurplus.toLocaleString()}/mo</span>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Wealth Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Adjust Wealth Profile & Goals</h3>
            <p className="text-xs text-slate-500 mb-4 font-mono">Calibrate personal balance sheet and financial targets.</p>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-mono mb-1">Liquid Assets ($)</label>
                  <input
                    type="number"
                    value={formData.liquidAssets ?? 0}
                    onChange={e => setFormData({ ...formData, liquidAssets: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-mono mb-1">Business Equity ($)</label>
                  <input
                    type="number"
                    value={formData.businessEquityValue ?? 0}
                    onChange={e => setFormData({ ...formData, businessEquityValue: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-mono mb-1">Illiquid Assets ($)</label>
                  <input
                    type="number"
                    value={formData.illiquidAssets ?? 0}
                    onChange={e => setFormData({ ...formData, illiquidAssets: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-mono mb-1">Personal Debt ($)</label>
                  <input
                    type="number"
                    value={formData.totalPersonalDebt ?? 0}
                    onChange={e => setFormData({ ...formData, totalPersonalDebt: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-mono mb-1">Target Net Worth ($)</label>
                  <input
                    type="number"
                    value={formData.targetNetWorth ?? 10000000}
                    onChange={e => setFormData({ ...formData, targetNetWorth: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-mono mb-1">Target Age</label>
                  <input
                    type="number"
                    value={formData.targetRetirementAge ?? 50}
                    onChange={e => setFormData({ ...formData, targetRetirementAge: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 font-mono">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 rounded-lg bg-[#132338] hover:bg-[#0c1827] text-white font-bold transition"
                >
                  {isSaving ? 'Recalculating...' : 'Update Wealth State'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
