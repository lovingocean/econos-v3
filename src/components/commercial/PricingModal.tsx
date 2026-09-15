import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  Lock, 
  Clock, 
  CreditCard, 
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  FileText,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { PricingPlan, Subscription, PlanId, BillingInterval, Invoice } from '../../types/econos';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminConfig?: () => void;
  onOpenAnalytics?: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ 
  isOpen, 
  onClose, 
  onOpenAdminConfig,
  onOpenAnalytics
}) => {
  const { currentOrg, user, subscription, activePlan, refreshSubscription, changePlan } = useAuth();
  
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'warning' | 'error'; message: string; details?: string[] } | null>(null);
  const [activeTab, setActiveTab] = useState<'plans' | 'invoices'>('plans');

  const [downgradeConfirmPlan, setDowngradeConfirmPlan] = useState<PricingPlan | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    loadPlansAndInvoices();
  }, [isOpen]);

  const loadPlansAndInvoices = async () => {
    setIsLoading(true);
    try {
      const [allPlans, allInvoices] = await Promise.all([
        api.getPricingPlans(),
        api.getInvoices()
      ]);
      setPlans(allPlans);
      setInvoices(allInvoices);
    } catch (err) {
      console.error('Failed to load commercial data', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentPlanId = subscription?.planId || 'free';
  const isTrialing = subscription?.status === 'TRIALING';
  const isCanceledAtPeriodEnd = subscription?.cancelAtPeriodEnd;

  const handleStartTrial = async (plan: PricingPlan) => {
    setActionLoading(plan.id);
    setNotice(null);
    try {
      const res = await api.startTrial(plan.id);
      await refreshSubscription();
      setNotice({
        type: 'success',
        message: res.message || `${plan.name} 14-day free trial activated successfully!`
      });
    } catch (err: any) {
      setNotice({
        type: 'error',
        message: err.message || 'Failed to initiate free trial'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpgrade = async (plan: PricingPlan) => {
    setActionLoading(plan.id);
    setNotice(null);
    try {
      const res = await api.upgradeSubscription(plan.id, billingInterval);
      await refreshSubscription();
      await loadPlansAndInvoices();
      setNotice({
        type: 'success',
        message: res.message || `Upgraded to ${plan.name} plan successfully!`
      });
    } catch (err: any) {
      setNotice({
        type: 'error',
        message: err.message || 'Upgrade processing failed'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmDowngrade = async () => {
    if (!downgradeConfirmPlan) return;
    setActionLoading('downgrade');
    setNotice(null);
    try {
      const res = await api.downgradeSubscription(downgradeConfirmPlan.id);
      await refreshSubscription();
      setNotice({
        type: 'warning',
        message: res.message,
        details: res.affectedCapabilities
      });
      setDowngradeConfirmPlan(null);
    } catch (err: any) {
      setNotice({
        type: 'error',
        message: err.message || 'Downgrade failed'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    setActionLoading('cancel');
    setNotice(null);
    try {
      const res = await api.cancelSubscription(true);
      await refreshSubscription();
      setNotice({
        type: 'warning',
        message: res.message
      });
      setCancelConfirm(false);
    } catch (err: any) {
      setNotice({
        type: 'error',
        message: err.message || 'Cancellation failed'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleResumeSubscription = async () => {
    setActionLoading('resume');
    setNotice(null);
    try {
      const res = await api.resumeSubscription();
      await refreshSubscription();
      setNotice({
        type: 'success',
        message: res.message
      });
    } catch (err: any) {
      setNotice({
        type: 'error',
        message: err.message || 'Resume failed'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const isUserAdmin = user?.role === 'OWNER' || user?.role === 'ADMIN' || user?.email === 'meekifti@gmail.com';

  const handleAdminInstantSwitch = async (plan: PricingPlan) => {
    setActionLoading(plan.id);
    setNotice(null);
    try {
      await changePlan(plan.id, billingInterval);
      await refreshSubscription();
      await loadPlansAndInvoices();
      setNotice({
        type: 'success',
        message: `Sovereign Admin instant activation: Plan changed to ${plan.name} successfully!`
      });
    } catch (err: any) {
      setNotice({
        type: 'error',
        message: err.message || 'Failed to switch plan'
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-6xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="border-b border-zinc-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-zinc-900/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                COMMERCIAL MODEL & PRICING
              </span>
              <span className="text-zinc-500 text-xs font-mono">• Sovereign License</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-100 mt-1">
              ECONOS Pricing & Entitlements
            </h2>
            <p className="text-sm text-zinc-400 mt-0.5">
              Configurable subscription architecture powering sovereign AI economic governance.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            {isUserAdmin && onOpenAnalytics && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAnalytics();
                }}
                className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-mono transition"
              >
                Commercial Analytics
              </button>
            )}

            {isUserAdmin && onOpenAdminConfig && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdminConfig();
                }}
                className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/30 text-xs font-mono transition flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Admin Config</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status / Notice Banner */}
        {notice && (
          <div className={`px-6 py-3 border-b text-xs flex items-start justify-between gap-3 ${
            notice.type === 'success' ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300' :
            notice.type === 'warning' ? 'bg-amber-950/40 border-amber-800/50 text-amber-300' :
            'bg-rose-950/40 border-rose-800/50 text-rose-300'
          }`}>
            <div>
              <div className="font-semibold">{notice.message}</div>
              {notice.details && notice.details.length > 0 && (
                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px] text-zinc-300">
                  {notice.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
            <button onClick={() => setNotice(null)} className="text-zinc-400 hover:text-zinc-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Current Active Plan Status Bar */}
        <div className="bg-zinc-900/70 border-b border-zinc-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-zinc-400">ORGANIZATION:</span>
            <span className="font-bold text-zinc-200">{currentOrg?.name}</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">ACTIVE PLAN:</span>
            <span className="px-2 py-0.5 rounded font-bold uppercase bg-zinc-800 text-amber-400 border border-zinc-700">
              {activePlan?.name || currentPlanId}
            </span>
            {isTrialing && (
              <span className="px-2 py-0.5 rounded font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>14-Day Free Trial (Ends {subscription?.trialEnd?.slice(0, 10)})</span>
              </span>
            )}
            {isCanceledAtPeriodEnd && (
              <span className="px-2 py-0.5 rounded font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Cancels on {subscription?.currentPeriodEnd?.slice(0, 10)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isCanceledAtPeriodEnd ? (
              <button
                onClick={handleResumeSubscription}
                disabled={Boolean(actionLoading)}
                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs transition"
              >
                Resume Subscription
              </button>
            ) : currentPlanId !== 'free' && (
              <button
                onClick={() => setCancelConfirm(true)}
                disabled={Boolean(actionLoading)}
                className="text-zinc-400 hover:text-rose-400 text-xs transition"
              >
                Cancel Subscription
              </button>
            )}

            <div className="flex border border-zinc-800 rounded bg-zinc-950 p-0.5">
              <button
                onClick={() => setActiveTab('plans')}
                className={`px-2.5 py-1 rounded text-xs transition ${activeTab === 'plans' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400'}`}
              >
                Plans
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`px-2.5 py-1 rounded text-xs transition ${activeTab === 'invoices' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400'}`}
              >
                Invoices ({invoices.length})
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {activeTab === 'plans' ? (
            <>
              {/* Billing Cycle Toggle */}
              <div className="flex justify-center items-center gap-3">
                <span className={`text-xs font-mono ${billingInterval === 'monthly' ? 'text-zinc-200 font-bold' : 'text-zinc-400'}`}>
                  Monthly Billing
                </span>
                <button
                  onClick={() => setBillingInterval(prev => prev === 'monthly' ? 'annual' : 'monthly')}
                  className="relative w-12 h-6 rounded-full bg-zinc-800 border border-zinc-700 p-0.5 transition"
                >
                  <div className={`w-5 h-5 rounded-full bg-amber-400 transition-transform ${billingInterval === 'annual' ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-mono ${billingInterval === 'annual' ? 'text-zinc-200 font-bold' : 'text-zinc-400'}`}>
                    Annual Billing
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    2 MONTHS FREE (~17% SAVINGS)
                  </span>
                </div>
              </div>

              {/* Pricing Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {plans.map((plan) => {
                  const isCurrent = currentPlanId === plan.id;
                  const isFree = plan.id === 'free';
                  const isPro = plan.id === 'pro';
                  const isBusiness = plan.id === 'business';
                  const isEnterprise = plan.id === 'enterprise';

                  const price = billingInterval === 'annual' ? plan.annualPrice : plan.monthlyPrice;
                  const priceFormatted = isEnterprise 
                    ? 'Custom' 
                    : price !== null 
                      ? `$${price}` 
                      : '$0';
                  
                  const periodSuffix = isEnterprise 
                    ? '' 
                    : billingInterval === 'annual' 
                      ? '/year' 
                      : '/month';

                  return (
                    <div
                      key={plan.id}
                      className={`rounded-xl border flex flex-col relative transition ${
                        isCurrent
                          ? 'border-amber-500 bg-amber-950/10 shadow-lg shadow-amber-500/5'
                          : isBusiness
                          ? 'border-indigo-500/50 bg-indigo-950/10'
                          : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                      }`}
                    >
                      {/* Badge */}
                      {plan.isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-zinc-950 shadow">
                          MOST POPULAR
                        </div>
                      )}
                      {isBusiness && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500 text-white shadow">
                          GOVERNANCE & TEAM
                        </div>
                      )}

                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-zinc-100">{plan.name}</h3>
                          {isCurrent && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 min-h-[32px]">{plan.description}</p>

                        {/* Price */}
                        <div className="mt-4 pb-4 border-b border-zinc-800">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-zinc-100 tracking-tight">
                              {priceFormatted}
                            </span>
                            <span className="text-xs text-zinc-400 font-mono">{periodSuffix}</span>
                          </div>
                          {billingInterval === 'annual' && !isEnterprise && !isFree && (
                            <div className="text-[11px] text-emerald-400 font-mono mt-1">
                              Equivalent to ~${Math.round((plan.annualPrice || 0) / 12)}/mo
                            </div>
                          )}
                          {plan.trialDays > 0 && !isCurrent && (
                            <div className="text-[11px] text-amber-400 font-mono mt-1 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>{plan.trialDays}-Day Free Trial Included</span>
                            </div>
                          )}
                        </div>

                        {/* Feature Highlights */}
                        <div className="mt-4 flex-1 space-y-2.5 text-xs text-zinc-300">
                          <div className="font-mono text-[10px] uppercase text-zinc-400 tracking-wider">Entitlements:</div>
                          
                          <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>
                              {plan.entitlements.maxAgents === -1 ? 'Unlimited' : plan.entitlements.maxAgents} Autonomous AI Agent{plan.entitlements.maxAgents === 1 ? '' : 's'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>
                              {plan.entitlements.maxSeats === -1 ? 'Custom Seats' : `${plan.entitlements.maxSeats} Team Seat${plan.entitlements.maxSeats === 1 ? '' : 's'}`}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {plan.entitlements.aiFirewall ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                            )}
                            <span className={plan.entitlements.aiFirewall ? 'text-zinc-200' : 'text-zinc-500'}>
                              AI Firewall Governance Gate
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {plan.entitlements.humanApprovalWorkflow ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                            )}
                            <span className={plan.entitlements.humanApprovalWorkflow ? 'text-zinc-200' : 'text-zinc-500'}>
                              Human Approval Escalations
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>
                              {plan.entitlements.maxMonthlyAiCalls === -1 ? 'Unlimited' : plan.entitlements.maxMonthlyAiCalls} AI Advisor Calls/mo
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>
                              {plan.entitlements.maxScenarios === -1 ? 'Unlimited' : plan.entitlements.maxScenarios} Scenario Simulations
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="capitalize">{plan.entitlements.supportLevel} Support</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-6 pt-3 space-y-2">
                          {isCurrent ? (
                            <button
                              disabled
                              className="w-full py-2 px-3 rounded-lg bg-zinc-800 text-zinc-400 text-xs font-semibold cursor-default"
                            >
                              Current Plan
                            </button>
                          ) : isEnterprise ? (
                            <div className="space-y-2">
                              <a
                                href="mailto:enterprise@econos.internal?subject=Enterprise%20Sovereign%20Licensing"
                                className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                              >
                                <span>Contact Sales</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              {isUserAdmin && (
                                <button
                                  onClick={() => handleAdminInstantSwitch(plan)}
                                  disabled={Boolean(actionLoading)}
                                  className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Instant Admin Activate</span>
                                </button>
                              )}
                            </div>
                          ) : isFree ? (
                            <div className="space-y-2">
                              <button
                                onClick={() => setDowngradeConfirmPlan(plan)}
                                disabled={Boolean(actionLoading)}
                                className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition"
                              >
                                Downgrade to Free
                              </button>
                              {isUserAdmin && (
                                <button
                                  onClick={() => handleAdminInstantSwitch(plan)}
                                  disabled={Boolean(actionLoading)}
                                  className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Instant Admin Switch</span>
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {currentPlanId === 'free' && !isTrialing && (
                                <button
                                  onClick={() => handleStartTrial(plan)}
                                  disabled={Boolean(actionLoading)}
                                  className="w-full py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition flex items-center justify-center gap-1"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Start 14-Day Free Trial</span>
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  // If downgrading from business to pro
                                  if (currentPlanId === 'business' && plan.id === 'pro') {
                                    setDowngradeConfirmPlan(plan);
                                  } else {
                                    handleUpgrade(plan);
                                  }
                                }}
                                disabled={Boolean(actionLoading)}
                                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                                  currentPlanId === 'business' && plan.id === 'pro'
                                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                                    : 'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-md shadow-amber-500/20'
                                }`}
                              >
                                {actionLoading === plan.id ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : currentPlanId === 'business' && plan.id === 'pro' ? (
                                  <span>Downgrade to Pro</span>
                                ) : (
                                  <>
                                    <span>Upgrade to {plan.name}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </>
                                )}
                              </button>

                              {isUserAdmin && (
                                <button
                                  onClick={() => handleAdminInstantSwitch(plan)}
                                  disabled={Boolean(actionLoading)}
                                  className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Instant Admin Switch</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Comprehensive Entitlement Comparison Matrix */}
              <div className="mt-10 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="bg-zinc-900/70 p-4 border-b border-zinc-800">
                  <h4 className="font-bold text-sm text-zinc-200">Full Capabilities & Limits Matrix</h4>
                  <p className="text-xs text-zinc-400">Server-authoritative feature matrix applied across all sovereign tenants.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-900/40 border-b border-zinc-800 text-zinc-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Capability / Feature</th>
                        <th className="p-3">Free</th>
                        <th className="p-3">Pro</th>
                        <th className="p-3">Business</th>
                        <th className="p-3">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                      <tr>
                        <td className="p-3 font-semibold text-zinc-200 font-sans">Monthly Price</td>
                        <td className="p-3">$0</td>
                        <td className="p-3 font-bold text-amber-400">$39</td>
                        <td className="p-3 font-bold text-indigo-400">$199</td>
                        <td className="p-3">Custom</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-zinc-200 font-sans">Annual Price (2 Months Free)</td>
                        <td className="p-3">$0</td>
                        <td className="p-3 text-emerald-400">$390/yr</td>
                        <td className="p-3 text-emerald-400">$1,990/yr</td>
                        <td className="p-3">Custom SLA</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-zinc-200 font-sans">Autonomous AI Agents</td>
                        <td className="p-3">1 (Supervised)</td>
                        <td className="p-3">3 Agents</td>
                        <td className="p-3">20 Agents</td>
                        <td className="p-3">Custom (500+)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-zinc-200 font-sans">Team Seats</td>
                        <td className="p-3">1 Member</td>
                        <td className="p-3">1 Member</td>
                        <td className="p-3">10 Seats</td>
                        <td className="p-3">Unlimited</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-zinc-200 font-sans">AI Firewall Multi-Stage Gate</td>
                        <td className="p-3 text-zinc-600">No</td>
                        <td className="p-3 text-zinc-600">No</td>
                        <td className="p-3 text-emerald-400 font-bold">Yes (Enforced)</td>
                        <td className="p-3 text-emerald-400 font-bold">Yes (Custom Rules)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-zinc-200 font-sans">Human Approval Escalation</td>
                        <td className="p-3 text-zinc-600">No</td>
                        <td className="p-3 text-zinc-600">No</td>
                        <td className="p-3 text-emerald-400 font-bold">Yes (Full Matrix)</td>
                        <td className="p-3 text-emerald-400 font-bold">Yes (Multi-Sig)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-zinc-200 font-sans">AI Advisor Monthly Calls</td>
                        <td className="p-3">15 Calls</td>
                        <td className="p-3">250 Calls</td>
                        <td className="p-3">2,000 Calls</td>
                        <td className="p-3">Dedicated Pool</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-zinc-200 font-sans">Scenario Simulations</td>
                        <td className="p-3">5 Scenarios</td>
                        <td className="p-3">25 Scenarios</td>
                        <td className="p-3">500 Scenarios</td>
                        <td className="p-3">Unlimited</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800 font-sans">Wealth Engines (20 Categories)</td>
                        <td className="p-3">Limited (3 Engines)</td>
                        <td className="p-3">Full Access (All 20)</td>
                        <td className="p-3">Full Access + Custom</td>
                        <td className="p-3">Bespoke Modeling</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800 font-sans">Audit Trail Retention</td>
                        <td className="p-3">7 Days</td>
                        <td className="p-3">30 Days</td>
                        <td className="p-3">365 Days</td>
                        <td className="p-3">Indefinite (WORM)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* Invoices Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Billing History & Invoices</h3>
                  <p className="text-xs text-slate-500">All payment transactions and receipts generated for this tenant.</p>
                </div>
              </div>

              {invoices.length === 0 ? (
                <div className="border border-slate-200 rounded-xl p-12 text-center text-slate-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <div className="font-mono text-xs">NO BILLING INVOICES RECORDED YET</div>
                  <p className="text-xs text-slate-500 mt-1">Paid invoices will automatically appear here following plan upgrades or monthly renewals.</p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Invoice ID</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Reason</th>
                        <th className="p-3">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/60">
                          <td className="p-3 font-bold text-slate-900">{inv.id}</td>
                          <td className="p-3 text-slate-500">{inv.createdAt.slice(0, 10)}</td>
                          <td className="p-3 font-semibold text-emerald-700">
                            ${inv.amountPaid.toFixed(2)} {inv.currency}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {inv.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500 capitalize">{inv.billingReason.replace('_', ' ')}</td>
                          <td className="p-3">
                            <a
                              href={inv.invoicePdfUrl || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-900 hover:text-slate-700 underline text-[11px] font-medium"
                            >
                              Download PDF
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Downgrade Safety Confirmation Modal */}
        {downgradeConfirmPlan && (
          <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-amber-200 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-base text-slate-900">Confirm Plan Downgrade</h4>
              </div>
              
              <p className="text-xs text-slate-600 leading-relaxed">
                You are requesting to downgrade to <span className="font-bold text-slate-900">{downgradeConfirmPlan.name}</span>.
              </p>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1.5 font-mono">
                <div className="text-emerald-700 font-bold font-sans">Data Safety Guarantee:</div>
                <div>• Zero Data Deletion: All existing agents, businesses, and logs are preserved.</div>
                <div>• Capacity Restriction: You will not be able to deploy new agents or team seats beyond the new plan limit.</div>
                <div>• Governance: AI Firewall and high-risk approval workflows will be throttled.</div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setDowngradeConfirmPlan(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 transition font-medium"
                >
                  Keep Current Plan
                </button>
                <button
                  onClick={handleConfirmDowngrade}
                  disabled={actionLoading === 'downgrade'}
                  className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-white font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  {actionLoading === 'downgrade' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Downgrade</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Subscription Confirmation Modal */}
        {cancelConfirm && (
          <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-rose-200 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-rose-800">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h4 className="font-bold text-base text-slate-900">Cancel Paid Subscription</h4>
              </div>
              
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to cancel automated renewal?
              </p>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1.5 font-mono">
                <div>• Access Remains Active until <span className="text-slate-900 font-semibold">{subscription?.currentPeriodEnd?.slice(0, 10)}</span>.</div>
                <div>• You will not be billed for subsequent cycles.</div>
                <div>• All historical tenant data is retained according to data preservation policies.</div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setCancelConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 transition font-medium"
                >
                  Never Mind
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={actionLoading === 'cancel'}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs text-white font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  {actionLoading === 'cancel' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Cancellation</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
