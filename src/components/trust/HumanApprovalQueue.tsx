import React, { useState } from 'react';
import { AgentApprovalRequest } from '../../types/econos';
import { api } from '../../api/client';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  DollarSign, 
  ShieldAlert, 
  UserCheck 
} from 'lucide-react';

interface HumanApprovalQueueProps {
  approvals: AgentApprovalRequest[];
  onRefresh: () => void;
}

export const HumanApprovalQueue: React.FC<HumanApprovalQueueProps> = ({
  approvals,
  onRefresh
}) => {
  const [decidingId, setDecidingId] = useState<string | null>(null);
  const [decisionType, setDecisionType] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pendingList = approvals.filter(a => a.status === 'PENDING');
  const historicalList = approvals.filter(a => a.status !== 'PENDING');

  const handleOpenDecision = (id: string, type: 'APPROVED' | 'REJECTED') => {
    setDecidingId(id);
    setDecisionType(type);
    setNotes(type === 'APPROVED' ? 'Verified operational ROI and risk parameters.' : 'Escalation rejected due to budget risk.');
  };

  const handleSubmitDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decidingId) return;
    setIsSubmitting(true);
    try {
      await api.decideApproval(decidingId, decisionType, notes);
      setDecidingId(null);
      onRefresh();
    } catch (err: any) {
      alert('Failed to submit decision: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">Autonomous Escalation Gateway</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">Human-in-the-Loop Approval Queue</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              High-value transactions, contract executions, and elevated risk operations require explicit principal authorization.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono text-xs font-bold">
              {pendingList.length} Pending Actions
            </span>
          </div>
        </div>
      </div>

      {/* Pending Approvals List */}
      <div className="space-y-3">
        {pendingList.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 text-xs font-mono shadow-xs">
            No actions currently awaiting human approval. All autonomous actions within baseline limits.
          </div>
        ) : (
          pendingList.map(req => (
            <div key={req.id} className="bg-white border border-amber-300/80 rounded-2xl p-5 shadow-xs font-mono text-xs">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>PENDING AUTHORIZATION</span>
                    </span>
                    <span className="text-[10px] text-slate-600">Agent: <strong>{req.agentName}</strong> ({req.agentId})</span>
                    <span className="text-[10px] text-slate-400">Requested {new Date(req.requestedAt).toLocaleTimeString()}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-sans">{req.actionName}</h3>
                  <div className="mt-1 text-slate-700 font-sans text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-mono text-[10px] block uppercase">Stated Intent:</span>
                    {req.intent}
                  </div>

                  <div className="mt-2 text-slate-600 text-[11px] flex flex-wrap gap-3">
                    <span>Permission Required: <strong className="text-slate-900">{req.requestedPermission}</strong></span>
                    <span>Resource: <strong className="text-slate-900">{req.affectedResource}</strong></span>
                    <span>Risk Tier: <strong className="text-amber-800">{req.riskTier}</strong></span>
                  </div>
                </div>

                {/* Right Box: Impact & Action Buttons */}
                <div className="lg:w-64 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Financial Impact</span>
                    <div className="text-2xl font-black text-amber-800">
                      ${req.financialImpact.toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenDecision(req.id, 'APPROVED')}
                      className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-1 text-xs shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => handleOpenDecision(req.id, 'REJECTED')}
                      className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-700 border border-rose-200 font-bold transition flex items-center justify-center gap-1 text-xs"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Historical Approvals */}
      {historicalList.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          <h3 className="text-xs font-bold font-mono text-slate-800 uppercase mb-3">Decision History ({historicalList.length})</h3>
          <div className="space-y-2 font-mono text-xs">
            {historicalList.map(h => (
              <div key={h.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      h.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>{h.status}</span>
                    <span className="text-slate-800 font-semibold">{h.actionName}</span>
                    <span className="text-slate-400 text-[10px]">by {h.agentName}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5 font-sans">{h.decisionNotes}</div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-900">${h.financialImpact.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block">{h.decidedAt ? new Date(h.decidedAt).toLocaleTimeString() : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Confirm Decision */}
      {decidingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl font-mono text-xs">
            <h3 className="text-base font-bold text-slate-900 font-sans mb-1">
              Confirm Action {decisionType}
            </h3>
            <p className="text-slate-500 mb-4 font-sans text-xs">
              Provide fiduciary rationale for audit log registration.
            </p>

            <form onSubmit={handleSubmitDecision} className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1">Decision Rationale / Notes</label>
                <textarea
                  rows={3}
                  required
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setDecidingId(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-1.5 rounded-lg font-bold text-white ${
                    decisionType === 'APPROVED' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {isSubmitting ? 'Signing Decision...' : `Confirm ${decisionType}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
