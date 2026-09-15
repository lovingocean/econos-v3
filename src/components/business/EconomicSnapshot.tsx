import React, { useState, useEffect } from 'react';
import { EconomicProfile, Business } from '../../types/econos';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Edit3, 
  Check, 
  X, 
  ShieldAlert, 
  Layers, 
  Users, 
  Truck, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';

interface EconomicSnapshotProps {
  business: Business | null;
  profile: EconomicProfile | null;
  onRefresh: () => void;
}

export const EconomicSnapshot: React.FC<EconomicSnapshotProps> = ({ business, profile, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<EconomicProfile>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        monthlyRevenue: profile.monthlyRevenue,
        monthlyCogs: profile.monthlyCogs,
        monthlyOpex: profile.monthlyOpex,
        cashOnHand: profile.cashOnHand,
        totalAssets: profile.totalAssets,
        totalLiabilities: profile.totalLiabilities,
        activeCustomersCount: profile.activeCustomersCount,
        activeSuppliersCount: profile.activeSuppliersCount,
        growthRateMoM: profile.growthRateMoM,
        primaryObjective: profile.primaryObjective
      });
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    setIsSaving(true);
    try {
      await api.updateEconomicProfile({
        businessId: business.id,
        ...formData
      });
      setIsEditing(false);
      onRefresh();
    } catch (err) {
      alert('Failed to update economic profile: ' + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (val: number | null | undefined): string => {
    if (val === null || val === undefined) return 'INSUFFICIENT DATA';
    return `$${val.toLocaleString()}`;
  };

  const formatPercent = (val: number | null | undefined): string => {
    if (val === null || val === undefined) return 'INSUFFICIENT DATA';
    return `${val.toFixed(1)}%`;
  };

  const formatNumber = (val: number | null | undefined): string => {
    if (val === null || val === undefined) return 'NOT PROVIDED';
    return val.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Objectives and Update Button */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">Verified Economic Baseline</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                Updated {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'Recent'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {business?.name || 'Primary Business Entity'} — Economic Snapshot
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Primary Objective: <span className="text-slate-800 font-medium">{profile?.primaryObjective || 'NOT PROVIDED'}</span>
            </p>
          </div>

          <button
            id="edit-economic-profile-btn"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium transition self-start sm:self-auto shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-500" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Economic Baseline'}</span>
          </button>
        </div>

        {/* Inline Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-600 mb-1">Monthly Revenue ($)</label>
              <input
                type="number"
                value={formData.monthlyRevenue ?? ''}
                onChange={e => setFormData({ ...formData, monthlyRevenue: e.target.value ? Number(e.target.value) : null })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-slate-800 outline-none"
                placeholder="e.g. 425000"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-600 mb-1">Monthly COGS ($)</label>
              <input
                type="number"
                value={formData.monthlyCogs ?? ''}
                onChange={e => setFormData({ ...formData, monthlyCogs: e.target.value ? Number(e.target.value) : null })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-slate-800 outline-none"
                placeholder="e.g. 132000"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-600 mb-1">Monthly OpEx ($)</label>
              <input
                type="number"
                value={formData.monthlyOpex ?? ''}
                onChange={e => setFormData({ ...formData, monthlyOpex: e.target.value ? Number(e.target.value) : null })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-slate-800 outline-none"
                placeholder="e.g. 198000"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-600 mb-1">Cash On Hand ($)</label>
              <input
                type="number"
                value={formData.cashOnHand ?? ''}
                onChange={e => setFormData({ ...formData, cashOnHand: e.target.value ? Number(e.target.value) : null })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-slate-800 outline-none"
                placeholder="e.g. 1850000"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-600 mb-1">Total Assets ($)</label>
              <input
                type="number"
                value={formData.totalAssets ?? ''}
                onChange={e => setFormData({ ...formData, totalAssets: e.target.value ? Number(e.target.value) : null })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-slate-800 outline-none"
                placeholder="e.g. 4900000"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-600 mb-1">Total Liabilities ($)</label>
              <input
                type="number"
                value={formData.totalLiabilities ?? ''}
                onChange={e => setFormData({ ...formData, totalLiabilities: e.target.value ? Number(e.target.value) : null })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-slate-800 outline-none"
                placeholder="e.g. 1200000"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono text-slate-600 mb-1">Primary Economic Objective</label>
              <input
                type="text"
                value={formData.primaryObjective ?? ''}
                onChange={e => setFormData({ ...formData, primaryObjective: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-slate-800 outline-none"
                placeholder="e.g. Expand ARR to $8M while sustaining 25%+ net margin"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2 px-4 rounded-xl bg-[#132338] hover:bg-[#0c1827] text-white font-bold text-xs transition shadow-xs"
              >
                {isSaving ? 'Calculating...' : 'Save & Recalculate'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Primary Key Metric Tiles (Mathematical & Optical Bento Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Revenue - Mint */}
        <div className="bg-[#f0f7f3] border border-[#d7e9dc] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-[11px] font-mono uppercase font-bold">Monthly Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
            {formatCurrency(profile?.monthlyRevenue)}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-600 mt-1 font-mono">
            {profile?.growthRateMoM ? (
              <span className="text-emerald-700 flex items-center font-bold">
                <ArrowUpRight className="w-3 h-3 inline" /> +{profile.growthRateMoM}% MoM
              </span>
            ) : (
              <span>Annualized: {profile?.monthlyRevenue ? `$${((profile.monthlyRevenue * 12) / 1000000).toFixed(2)}M` : 'INSUFFICIENT DATA'}</span>
            )}
          </div>
        </div>

        {/* Gross Margin - Soft Blue */}
        <div className="bg-[#eff5fb] border border-[#d9e6f2] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-[11px] font-mono uppercase font-bold">Gross Margin</span>
            <Activity className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
            {formatPercent(profile?.grossMarginPct)}
          </div>
          <div className="text-[10px] text-slate-600 mt-1 font-mono">
            COGS: {formatCurrency(profile?.monthlyCogs)}/mo
          </div>
        </div>

        {/* Net Margin - Warm Beige */}
        <div className="bg-[#fdf9f1] border border-[#f4ebda] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-[11px] font-mono uppercase font-bold">Net Profit Margin</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
            {formatPercent(profile?.netMarginPct)}
          </div>
          <div className="text-[10px] text-slate-600 mt-1 font-mono">
            OpEx: {formatCurrency(profile?.monthlyOpex)}/mo
          </div>
        </div>

        {/* Cash Runway - Soft Lilac */}
        <div className="bg-[#f6f3fb] border border-[#ece3f8] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-[11px] font-mono uppercase font-bold">Cash Runway</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
            {profile?.runwayMonths === null || profile?.runwayMonths === undefined
              ? 'INSUFFICIENT DATA'
              : profile.runwayMonths >= 99
                ? 'Profitable (Infinite)'
                : `${profile.runwayMonths} Mo`}
          </div>
          <div className="text-[10px] text-slate-600 mt-1 font-mono">
            Treasury: {formatCurrency(profile?.cashOnHand)}
          </div>
        </div>

      </div>

      {/* Balance Sheet & Operational Counterparties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Balance Sheet Snapshot */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <span className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider">Corporate Balance Sheet</span>
            <span className="text-[10px] font-mono text-slate-400">Book Value Basis</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Total Assets</span>
              <span className="font-bold text-slate-900">{formatCurrency(profile?.totalAssets)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Total Liabilities & Debt</span>
              <span className="font-bold text-slate-700">{formatCurrency(profile?.totalLiabilities)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Liquid Treasury Cash</span>
              <span className="font-bold text-emerald-600">{formatCurrency(profile?.cashOnHand)}</span>
            </div>
            <div className="flex justify-between items-center py-2 text-slate-900 font-bold bg-slate-50 px-3 rounded-lg">
              <span>Corporate Book Equity</span>
              <span className="text-emerald-700">
                {profile?.totalAssets !== null && profile?.totalLiabilities !== null && profile?.totalAssets !== undefined && profile?.totalLiabilities !== undefined
                  ? `$${(profile.totalAssets - profile.totalLiabilities).toLocaleString()}`
                  : 'INSUFFICIENT DATA'}
              </span>
            </div>
          </div>
        </div>

        {/* Counterparties & Network Concentration */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <span className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider">Commercial Counterparties</span>
            <span className="text-[10px] font-mono text-slate-400">Contract Depth</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-600 text-[11px] mb-1">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Active Customers</span>
              </div>
              <div className="text-lg font-mono font-bold text-slate-900">
                {formatNumber(profile?.activeCustomersCount)}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-600 text-[11px] mb-1">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                <span>Active Suppliers</span>
              </div>
              <div className="text-lg font-mono font-bold text-slate-900">
                {formatNumber(profile?.activeSuppliersCount)}
              </div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-mono text-slate-500 mb-2 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-amber-500" />
              <span className="font-semibold">Identified Structural Risks ({profile?.keyRisks?.length || 0})</span>
            </div>
            {profile?.keyRisks && profile.keyRisks.length > 0 ? (
              <ul className="space-y-1.5">
                {profile.keyRisks.map((risk, idx) => (
                  <li key={idx} className="text-[11px] text-slate-700 flex items-start gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-amber-500 font-mono text-[10px]">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl border border-slate-200">
                No acute structural risks recorded.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
