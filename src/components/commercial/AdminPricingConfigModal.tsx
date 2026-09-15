import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Save, 
  History, 
  ShieldAlert, 
  AlertTriangle, 
  Check, 
  RefreshCw, 
  X,
  Edit3
} from 'lucide-react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { PricingPlan, AdminPricingAudit, PlanId } from '../../types/econos';

interface AdminPricingConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPricingConfigModal: React.FC<AdminPricingConfigModalProps> = ({ isOpen, onClose }) => {
  const { user, refreshSubscription } = useAuth();
  
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [audits, setAudits] = useState<AdminPricingAudit[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('pro');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [monthlyPrice, setMonthlyPrice] = useState<number>(39);
  const [annualPrice, setAnnualPrice] = useState<number>(390);
  const [trialDays, setTrialDays] = useState<number>(14);
  const [maxAgents, setMaxAgents] = useState<number>(3);
  const [maxSeats, setMaxSeats] = useState<number>(1);
  const [maxMonthlyAiCalls, setMaxMonthlyAiCalls] = useState<number>(250);
  const [maxMonthlySimulations, setMaxMonthlySimulations] = useState<number>(25);
  const [aiFirewall, setAiFirewall] = useState<boolean>(false);
  const [humanApprovalWorkflow, setHumanApprovalWorkflow] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('Standard commercial tuning');

  useEffect(() => {
    if (!isOpen) return;
    loadData();
  }, [isOpen]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allPlans, allAudits] = await Promise.all([
        api.getPricingPlans(),
        api.getAdminPricingAudits()
      ]);
      setPlans(allPlans);
      setAudits(allAudits);
      
      const defaultPlan = allPlans.find(p => p.id === selectedPlanId) || allPlans[1];
      if (defaultPlan) {
        populateForm(defaultPlan);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load pricing configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const populateForm = (plan: PricingPlan) => {
    setSelectedPlanId(plan.id);
    setMonthlyPrice(plan.monthlyPrice ?? 0);
    setAnnualPrice(plan.annualPrice ?? 0);
    setTrialDays(plan.trialDays);
    setMaxAgents(plan.entitlements.maxAgents);
    setMaxSeats(plan.entitlements.maxSeats);
    setMaxMonthlyAiCalls(plan.entitlements.maxMonthlyAiCalls);
    setMaxMonthlySimulations(plan.entitlements.maxMonthlySimulations);
    setAiFirewall(plan.entitlements.aiFirewall);
    setHumanApprovalWorkflow(plan.entitlements.humanApprovalWorkflow);
  };

  const handlePlanSelect = (planId: PlanId) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      populateForm(plan);
      setSaveSuccess(false);
      setErrorMessage(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMessage('A mandatory change justification reason is required for immutable audit logging.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const existingPlan = plans.find(p => p.id === selectedPlanId);
      const updates: Partial<PricingPlan> = {
        monthlyPrice: selectedPlanId === 'enterprise' ? null : Number(monthlyPrice),
        annualPrice: selectedPlanId === 'enterprise' ? null : Number(annualPrice),
        trialDays: Number(trialDays),
        entitlements: {
          ...(existingPlan?.entitlements || {
            advancedTrust: selectedPlanId !== 'free',
            advancedAuditLogs: selectedPlanId === 'business' || selectedPlanId === 'enterprise',
            customPolicies: selectedPlanId === 'enterprise',
            apiAccess: selectedPlanId === 'business' || selectedPlanId === 'enterprise',
            ssoSaml: selectedPlanId === 'enterprise',
            dedicatedInfrastructure: selectedPlanId === 'enterprise'
          }),
          maxAgents: Number(maxAgents),
          maxSeats: Number(maxSeats),
          maxMonthlyAiCalls: Number(maxMonthlyAiCalls),
          maxMonthlySimulations: Number(maxMonthlySimulations),
          aiFirewall: Boolean(aiFirewall),
          humanApprovalWorkflow: Boolean(humanApprovalWorkflow),
          wealthEngines: selectedPlanId === 'free' ? 'limited' : 'full',
          aiAdvisorLevel: selectedPlanId === 'free' ? 'limited' : 'enabled'
        }
      };

      await api.updateAdminPricing(selectedPlanId, updates, reason);
      await refreshSubscription();
      await loadData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save pricing configuration');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const isAuthorized = user?.role === 'OWNER' || user?.role === 'ADMIN';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-5xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="border-b border-slate-100 p-6 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                GOVERNANCE CONTROL
              </span>
              <span className="text-slate-400 text-xs font-mono">• Sovereign Pricing Engine</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
              Admin Pricing & Entitlement Configuration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dynamically calibrate subscription tiers, resource quotas, and pricing limits with immutable audit records.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthorized ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <ShieldAlert className="w-8 h-8 text-rose-600 mx-auto" />
            <div className="text-sm font-bold text-slate-900">Access Restricted</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Only principals with <span className="font-mono text-slate-800">OWNER</span> or <span className="font-mono text-slate-800">ADMIN</span> roles are authorized to calibrate commercial pricing rules.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Plan Selector Pills */}
            <div className="flex gap-2 border-b border-slate-100 pb-4">
              {plans.map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePlanSelect(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                    selectedPlanId === p.id 
                      ? 'bg-slate-900 text-white font-bold shadow-xs' 
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Notification messages */}
            {saveSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Configuration changes successfully committed and audit logged.</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Config Form */}
            <form onSubmit={handleSave} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Pricing Fields */}
                <div className="bg-slate-50/60 border border-slate-200 rounded-xl p-4 space-y-4">
                  <h4 className="text-xs font-mono uppercase text-amber-800 font-bold tracking-wider flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Price & Trial Calibration</span>
                  </h4>

                  <div>
                    <label className="block text-xs font-mono text-slate-600 mb-1">
                      Monthly Price ($ USD)
                    </label>
                    <input
                      type="number"
                      value={monthlyPrice}
                      onChange={e => setMonthlyPrice(Number(e.target.value))}
                      disabled={selectedPlanId === 'free' || selectedPlanId === 'enterprise'}
                      className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-900 font-mono focus:border-slate-800 focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-600 mb-1">
                      Annual Price ($ USD)
                    </label>
                    <input
                      type="number"
                      value={annualPrice}
                      onChange={e => setAnnualPrice(Number(e.target.value))}
                      disabled={selectedPlanId === 'free' || selectedPlanId === 'enterprise'}
                      className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-900 font-mono focus:border-slate-800 focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-600 mb-1">
                      Free Trial Duration (Days)
                    </label>
                    <input
                      type="number"
                      value={trialDays}
                      onChange={e => setTrialDays(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-900 font-mono focus:border-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Resource Limits */}
                <div className="bg-slate-50/60 border border-slate-200 rounded-xl p-4 space-y-4">
                  <h4 className="text-xs font-mono uppercase text-indigo-800 font-bold tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Resource Limits</span>
                  </h4>

                  <div>
                    <label className="block text-xs font-mono text-slate-600 mb-1">
                      Max Autonomous Agents (-1 for unlimited)
                    </label>
                    <input
                      type="number"
                      value={maxAgents}
                      onChange={e => setMaxAgents(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-900 font-mono focus:border-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-600 mb-1">
                      Max Team Seats (-1 for unlimited)
                    </label>
                    <input
                      type="number"
                      value={maxSeats}
                      onChange={e => setMaxSeats(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-900 font-mono focus:border-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-600 mb-1">
                      Monthly AI Advisor Queries
                    </label>
                    <input
                      type="number"
                      value={maxMonthlyAiCalls}
                      onChange={e => setMaxMonthlyAiCalls(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-900 font-mono focus:border-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Governance Feature Toggles */}
                <div className="bg-slate-50/60 border border-slate-200 rounded-xl p-4 space-y-4">
                  <h4 className="text-xs font-mono uppercase text-emerald-800 font-bold tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" />
                    <span>Governance Capabilities</span>
                  </h4>

                  <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={aiFirewall}
                      onChange={e => setAiFirewall(e.target.checked)}
                      className="rounded bg-white border-slate-300 text-slate-900 focus:ring-0"
                    />
                    <span className="text-xs text-slate-800 font-medium">Enforce AI Firewall Gate</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={humanApprovalWorkflow}
                      onChange={e => setHumanApprovalWorkflow(e.target.checked)}
                      className="rounded bg-white border-slate-300 text-slate-900 focus:ring-0"
                    />
                    <span className="text-xs text-slate-800 font-medium">Human Approval Escalations</span>
                  </label>

                  <div>
                    <label className="block text-xs font-mono text-slate-600 mb-1">
                      Scenario Simulation Limit
                    </label>
                    <input
                      type="number"
                      value={maxMonthlySimulations}
                      onChange={e => setMaxMonthlySimulations(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-900 font-mono focus:border-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

              </div>

              {/* Mandatory Reason Note */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <label className="block text-xs font-mono text-slate-800 font-bold">
                  Mandatory Audit Trail Justification:
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="E.g., Q3 Pricing Calibration & AI quota elevation"
                  className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 font-mono focus:border-slate-800 focus:outline-none"
                  required
                />
                <p className="text-[11px] text-slate-500 font-mono">
                  This note is immutably committed alongside your user ID and timestamp to the sovereign audit log.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs font-mono transition flex items-center gap-2 shadow-xs"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Commit Pricing Updates</span>
                </button>
              </div>

            </form>

            {/* Audit History Log */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mt-8 shadow-xs">
              <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center justify-between">
                <h4 className="font-bold text-xs font-mono uppercase text-slate-700">
                  Immutable Commercial Audit Log ({audits.length} entries)
                </h4>
              </div>

              <div className="max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50/50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Timestamp</th>
                      <th className="p-2.5">Plan</th>
                      <th className="p-2.5">Field</th>
                      <th className="p-2.5">Previous</th>
                      <th className="p-2.5">New Value</th>
                      <th className="p-2.5">Admin</th>
                      <th className="p-2.5">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {audits.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50/60">
                        <td className="p-2.5 text-slate-500">{a.timestamp.slice(0, 16).replace('T', ' ')}</td>
                        <td className="p-2.5 font-bold uppercase text-slate-900">{a.planId}</td>
                        <td className="p-2.5 text-slate-700">{a.field}</td>
                        <td className="p-2.5 text-slate-500">{JSON.stringify(a.oldValue)}</td>
                        <td className="p-2.5 text-emerald-700 font-bold">{JSON.stringify(a.newValue)}</td>
                        <td className="p-2.5 text-slate-500">{a.changedBy}</td>
                        <td className="p-2.5 text-slate-500 truncate max-w-xs">{a.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
