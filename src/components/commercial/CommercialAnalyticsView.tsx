import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Bot, 
  Layers, 
  CreditCard, 
  Activity, 
  AlertCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  X
} from 'lucide-react';
import { api } from '../../api/client';
import { CommercialAnalytics } from '../../types/econos';

interface CommercialAnalyticsViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommercialAnalyticsView: React.FC<CommercialAnalyticsViewProps> = ({ isOpen, onClose }) => {
  const [analytics, setAnalytics] = useState<CommercialAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    loadAnalytics();
  }, [isOpen]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCommercialAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load commercial analytics', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-5xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="border-b border-slate-100 p-6 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                SOVEREIGN TELEMETRY
              </span>
              <span className="text-slate-400 text-xs font-mono">• Zero Synthetic Fabrication</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
              Commercial Analytics & Unit Economics
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live economic metrics derived strictly from authoritative database billing events.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAnalytics}
              disabled={isLoading}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono transition flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="p-16 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-slate-900" />
              <div className="text-xs font-mono">Aggregating Authoritative Commercial Ledger...</div>
            </div>
          ) : !analytics ? (
            <div className="p-12 text-center text-slate-400 font-mono text-xs">
              UNABLE TO RETRIEVE COMMERCIAL ANALYTICS
            </div>
          ) : (
            <>
              {/* Primary Financial KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* MRR */}
                <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>Monthly Recurring Rev (MRR)</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
                    ${analytics.mrr.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Normalized active subscriptions
                  </div>
                </div>

                {/* ARR */}
                <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>Annual Run Rate (ARR)</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
                    ${analytics.arr.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Annual contract & run rate
                  </div>
                </div>

                {/* ARPU */}
                <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>ARPU (Paid Accounts)</span>
                    <CreditCard className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
                    {analytics.arpu !== null ? `$${analytics.arpu.toFixed(2)}` : (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                        INSUFFICIENT DATA
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Average revenue per paying tenant
                  </div>
                </div>

                {/* Churn Rate */}
                <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>Monthly Churn Rate</span>
                    <Activity className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
                    {analytics.churnRate === null ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                        INSUFFICIENT DATA
                      </span>
                    ) : (
                      `${analytics.churnRate.toFixed(1)}%`
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Requires ≥10 subscription cycles
                  </div>
                </div>

              </div>

              {/* Conversion & Subscription Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-5 space-y-3">
                  <h4 className="font-bold text-xs font-mono uppercase text-slate-500 tracking-wider">
                    Customer Funnel
                  </h4>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Total Registered Tenants:</span>
                      <span className="font-bold text-slate-900">{analytics.totalSignups}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Active Trials:</span>
                      <span className="font-bold text-amber-700">{analytics.trialStarts}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Paying Subscriptions:</span>
                      <span className="font-bold text-emerald-700">{analytics.paidSubscriptions}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Trial Conversion Rate:</span>
                      <span className="font-bold text-slate-900">
                        {analytics.trialStarts > 0 ? (
                          `${((analytics.trialConversions / analytics.trialStarts) * 100).toFixed(1)}%`
                        ) : (
                          <span className="text-[10px] text-amber-600 font-sans">INSUFFICIENT DATA</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Total Cancellations:</span>
                      <span className="font-bold text-rose-600">{analytics.cancellations}</span>
                    </div>
                  </div>
                </div>

                {/* Plan Distribution */}
                <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-5 space-y-3">
                  <h4 className="font-bold text-xs font-mono uppercase text-slate-500 tracking-wider">
                    Subscription Tier Distribution
                  </h4>
                  <div className="space-y-2.5 text-xs font-mono">
                    <div>
                      <div className="flex justify-between text-slate-700 mb-1">
                        <span>Free Tier</span>
                        <span className="font-bold">{analytics.planDistribution?.free ?? 0}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className="h-full bg-slate-400 rounded-full" 
                          style={{ width: `${Math.min(100, ((analytics.planDistribution?.free ?? 0) / Math.max(1, analytics.totalSignups)) * 100)}%` }} 
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-700 mb-1">
                        <span>Pro Tier ($39/mo)</span>
                        <span className="font-bold text-amber-700">{analytics.planDistribution?.pro ?? 0}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full" 
                          style={{ width: `${Math.min(100, ((analytics.planDistribution?.pro ?? 0) / Math.max(1, analytics.totalSignups)) * 100)}%` }} 
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-700 mb-1">
                        <span>Business Tier ($199/mo)</span>
                        <span className="font-bold text-indigo-700">{analytics.planDistribution?.business ?? 0}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full" 
                          style={{ width: `${Math.min(100, ((analytics.planDistribution?.business ?? 0) / Math.max(1, analytics.totalSignups)) * 100)}%` }} 
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-700 mb-1">
                        <span>Enterprise (Custom)</span>
                        <span className="font-bold text-purple-700">{analytics.planDistribution?.enterprise ?? 0}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className="h-full bg-purple-600 rounded-full" 
                          style={{ width: `${Math.min(100, ((analytics.planDistribution?.enterprise ?? 0) / Math.max(1, analytics.totalSignups)) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unit Economics & Cloud Gross Margin */}
                <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-5 space-y-3">
                  <h4 className="font-bold text-xs font-mono uppercase text-slate-500 tracking-wider">
                    Unit Economics & Cloud Costs
                  </h4>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Active AI Agents:</span>
                      <span className="font-bold text-slate-900">{analytics.activeAgents}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Monthly AI Tokens / Queries:</span>
                      <span className="font-bold text-slate-900">{analytics.totalAiUsage.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Active Organizations:</span>
                      <span className="font-bold text-slate-900">{analytics.activeOrganizations}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Estimated API Cloud Cost:</span>
                      <span className="font-bold text-rose-600">${analytics.totalUsageCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Gross Software Margin:</span>
                      <span className="font-bold text-emerald-700">
                        {analytics.grossMarginEstimate === null ? (
                          <span className="text-[10px] text-amber-600 font-sans">INSUFFICIENT DATA</span>
                        ) : (
                          `${analytics.grossMarginEstimate.toFixed(1)}%`
                        )}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Data Integrity Attestation */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 leading-relaxed font-mono">
                  <span className="font-bold text-slate-900">Sovereign Data Attestation:</span> All figures above represent exact transactional state aggregated from the multi-tenant database ledger. In strict adherence to our commercial integrity policy, zero synthetic extrapolation is applied. Fields marked <span className="text-amber-700 font-bold">INSUFFICIENT DATA</span> require broader longitudinal cohorts before computing statistical ratios.
                </div>
              </div>

            </>
          )}
        </div>

      </div>
    </div>
  );
};
