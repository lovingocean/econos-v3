import React, { useState } from 'react';
import { OutcomeVerification, Opportunity } from '../../types/econos';
import { api } from '../../api/client';
import { 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  FileCheck, 
  Plus, 
  Hash, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface OutcomeVerificationProps {
  verifications: OutcomeVerification[];
  opportunities: Opportunity[];
  onRefresh: () => void;
  prefillOpportunity?: Opportunity | null;
}

export const OutcomeVerificationView: React.FC<OutcomeVerificationProps> = ({
  verifications,
  opportunities,
  onRefresh,
  prefillOpportunity
}) => {
  const [showAddModal, setShowAddModal] = useState(Boolean(prefillOpportunity));
  const [selectedOppId, setSelectedOppId] = useState(prefillOpportunity?.id || '');
  const [recommendationTitle, setRecommendationTitle] = useState(prefillOpportunity?.title || '');
  const [actionTaken, setActionTaken] = useState('');
  const [expectedImpact, setExpectedImpact] = useState(prefillOpportunity?.estimatedImpact || 50000);
  const [actualImpact, setActualImpact] = useState(50000);
  const [evidence, setEvidence] = useState('Reconciled with monthly general ledger and bank statements');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createOutcomeVerification({
        opportunityId: selectedOppId || undefined,
        recommendationTitle: recommendationTitle || 'Execution Outcome',
        actionTaken,
        expectedFinancialImpact: Number(expectedImpact),
        actualFinancialImpact: Number(actualImpact),
        verificationEvidence: evidence
      });
      setShowAddModal(false);
      setActionTaken('');
      onRefresh();
    } catch (err) {
      alert('Failed to log outcome verification: ' + (err as any).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">Outcome Verification & Feedback Engine</span>
            </div>
            <h2 className="text-lg font-bold text-zinc-100 mt-1">Ground Truth vs Projection Audit</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Strict audit loop comparing actual financial impact against projected assumptions to calibrate future model precision.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs font-mono transition self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Verify New Outcome</span>
          </button>
        </div>
      </div>

      {/* Outcome Cards */}
      <div className="space-y-4">
        {verifications.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-500 text-xs font-mono">
            No outcome verifications logged yet. Complete an opportunity and verify real results.
          </div>
        ) : (
          verifications.map(v => {
            const isPositiveVariance = v.variance >= 0;

            return (
              <div key={v.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm font-mono text-xs">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  
                  {/* Left Column: Recommendation & Action Description */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>AUDITED VERIFICATION</span>
                      </span>
                      <span className="text-[10px] text-zinc-500">ID: {v.id}</span>
                      <span className="text-[10px] text-zinc-400">Verified {new Date(v.verifiedAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-base font-bold text-zinc-100 font-sans">{v.recommendationTitle}</h3>
                    
                    <div className="mt-2 text-zinc-300 font-sans text-xs bg-zinc-950 p-2.5 rounded border border-zinc-850">
                      <span className="text-zinc-500 font-mono text-[10px] block mb-0.5 uppercase">Action Taken:</span>
                      {v.actionTaken}
                    </div>

                    {/* Verification Evidence & Learning Insight */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-zinc-950 p-2.5 rounded border border-zinc-850">
                        <span className="text-zinc-400 font-bold block mb-0.5 flex items-center gap-1">
                          <Hash className="w-3 h-3 text-zinc-400" />
                          <span>Verification Evidence</span>
                        </span>
                        <p className="text-zinc-300 text-[10px] font-sans">{v.verificationEvidence}</p>
                      </div>

                      <div className="bg-zinc-950 p-2.5 rounded border border-zinc-850">
                        <span className="text-amber-400 font-bold block mb-0.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>System Learning Calibration</span>
                        </span>
                        <p className="text-zinc-300 text-[10px] font-sans">{v.learningInsights}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Variance Computation Box */}
                  <div className="lg:w-72 bg-zinc-950 p-4 rounded-lg border border-zinc-800 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between text-zinc-400 text-[11px]">
                        <span>Expected Impact:</span>
                        <span className="text-zinc-200">${v.expectedFinancialImpact.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between text-zinc-400 text-[11px]">
                        <span>Actual Audited Impact:</span>
                        <span className="text-zinc-100 font-bold">${v.actualFinancialImpact.toLocaleString()}</span>
                      </div>

                      <div className="pt-2 border-t border-zinc-850">
                        <div className="text-[10px] text-zinc-400 uppercase">Financial Variance</div>
                        <div className={`text-xl font-bold flex items-center gap-1 ${
                          isPositiveVariance ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {isPositiveVariance ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>
                            {isPositiveVariance ? `+$${v.variance.toLocaleString()}` : `-$${Math.abs(v.variance).toLocaleString()}`}
                          </span>
                        </div>
                        <div className={`text-[10px] mt-0.5 ${
                          isPositiveVariance ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {isPositiveVariance ? `+${v.variancePercentage}%` : `${v.variancePercentage}%`} vs expected
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-zinc-850 text-[10px] text-zinc-400">
                      Sign-off Principal: {v.verifiedBy}
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Verify Outcome */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="text-base font-bold text-zinc-100 mb-1">Log & Verify Real Outcome</h3>
            <p className="text-xs text-zinc-400 mb-4 font-mono">Record audited financial reality against prior models.</p>

            <form onSubmit={handleCreateVerification} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Related Opportunity</label>
                <select
                  value={selectedOppId}
                  onChange={e => {
                    setSelectedOppId(e.target.value);
                    const found = opportunities.find(o => o.id === e.target.value);
                    if (found) {
                      setRecommendationTitle(found.title);
                      setExpectedImpact(found.estimatedImpact);
                    }
                  }}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-zinc-100 outline-none"
                >
                  <option value="">-- Ad-Hoc / Custom Recommendation --</option>
                  {opportunities.map(o => (
                    <option key={o.id} value={o.id}>{o.title} (${o.estimatedImpact.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono mb-1">Recommendation / Target Action Title</label>
                <input
                  type="text"
                  required
                  value={recommendationTitle}
                  onChange={e => setRecommendationTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono mb-1">Action Actually Taken</label>
                <textarea
                  rows={2}
                  required
                  value={actionTaken}
                  onChange={e => setActionTaken(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-zinc-100 outline-none"
                  placeholder="Detail exact operational execution..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono mb-1">Expected Impact ($)</label>
                  <input
                    type="number"
                    required
                    value={expectedImpact}
                    onChange={e => setExpectedImpact(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono mb-1">Actual Audited Impact ($)</label>
                  <input
                    type="number"
                    required
                    value={actualImpact}
                    onChange={e => setActualImpact(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-zinc-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono mb-1">Audited Evidence / Ledger Hash</label>
                <input
                  type="text"
                  required
                  value={evidence}
                  onChange={e => setEvidence(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-zinc-100 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800 font-mono">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition"
                >
                  {isSubmitting ? 'Verifying...' : 'Log Audited Outcome'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
