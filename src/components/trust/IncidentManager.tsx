import React, { useState } from 'react';
import { AgentIncident } from '../../types/econos';
import { api } from '../../api/client';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  Search 
} from 'lucide-react';

interface IncidentManagerProps {
  incidents: AgentIncident[];
  onRefresh: () => void;
}

export const IncidentManager: React.FC<IncidentManagerProps> = ({ incidents, onRefresh }) => {
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('Agent quarantined; policy boundary updated.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingId) return;
    setIsSubmitting(true);
    try {
      await api.updateIncidentStatus(resolvingId, 'RESOLVED', resolutionText);
      setResolvingId(null);
      onRefresh();
    } catch (err: any) {
      alert('Failed to resolve incident: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Autonomous Risk & Incident Response</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-sans mt-1">Agent Security & Deviation Incidents</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-sans">
            Tracks unauthorized boundary breaches, policy trips, and anomalous economic transactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
            {incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length} Active Incidents
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {incidents.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 shadow-xs">
            No security or economic incidents recorded in current organization fleet.
          </div>
        ) : (
          incidents.map(inc => {
            const isResolved = inc.status === 'RESOLVED' || inc.status === 'CLOSED';
            const isCritical = inc.severity === 'CRITICAL';

            return (
              <div 
                key={inc.id}
                className={`bg-white border rounded-2xl p-5 shadow-xs ${
                  isCritical && !isResolved 
                    ? 'border-rose-300 bg-rose-50/20' 
                    : 'border-slate-200/90'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        isCritical ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {inc.severity} SEVERITY
                      </span>
                      <span className="text-slate-400">{inc.id}</span>
                      <span className="text-slate-600">Agent: <strong>{inc.agentName}</strong></span>
                      <span className="text-slate-400">{new Date(inc.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 font-sans">{inc.title}</h3>
                    <p className="text-slate-600 text-xs mt-1 font-sans leading-relaxed">{inc.description}</p>

                    <div className="mt-2 text-[11px] text-slate-500">
                      Policy Tripped: <span className="text-amber-800 font-bold">{inc.policyTripped}</span>
                    </div>

                    {inc.resolution && (
                      <div className="mt-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px]">
                        Resolution: {inc.resolution}
                      </div>
                    )}
                  </div>

                  <div className="lg:w-48 flex flex-col justify-between self-start lg:self-auto">
                    <span className={`px-3 py-1 rounded-full text-center text-xs font-bold ${
                      isResolved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {inc.status}
                    </span>

                    {!isResolved && (
                      <button
                        onClick={() => setResolvingId(inc.id)}
                        className="mt-4 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200"
                      >
                        Resolve Incident
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Resolve Incident */}
      {resolvingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl font-mono text-xs">
            <h3 className="text-base font-bold text-slate-900 font-sans mb-1">Resolve Incident</h3>
            <p className="text-slate-500 mb-4 font-sans text-xs">Document containment steps and root cause resolution.</p>

            <form onSubmit={handleResolve} className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1">Resolution Summary</label>
                <textarea
                  rows={3}
                  required
                  value={resolutionText}
                  onChange={e => setResolutionText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setResolvingId(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  {isSubmitting ? 'Resolving...' : 'Confirm Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
