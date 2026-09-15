import React, { useState } from 'react';
import { AuditLogEntry } from '../../types/econos';
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertOctagon, 
  ShieldCheck, 
  Download 
} from 'lucide-react';

interface AuditLogViewerProps {
  logs: AuditLogEntry[];
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDecision, setFilterDecision] = useState<string>('ALL');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  const filtered = logs.filter(l => {
    const matchesSearch = 
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.agentName && l.agentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.details && l.details.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDecision = filterDecision === 'ALL' || l.decision === filterDecision;
    const matchesRisk = filterRisk === 'ALL' || l.riskTier === filterRisk;

    return matchesSearch && matchesDecision && matchesRisk;
  });

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Search & Filter Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search immutable audit trail by agent, action, or resource..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none focus:border-slate-800 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterDecision}
            onChange={e => setFilterDecision(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none"
          >
            <option value="ALL">All Decisions</option>
            <option value="ALLOWED">ALLOWED Only</option>
            <option value="BLOCKED">BLOCKED Only</option>
          </select>

          <select
            value={filterRisk}
            onChange={e => setFilterRisk(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none"
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor / Agent</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Risk Tier</th>
                <th className="py-3 px-4">Firewall Decision</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filtered.map(log => {
                  const isAllowed = log.decision === 'ALLOWED';
                  const isBlocked = log.decision === 'BLOCKED';

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900">{log.agentName || log.actorName}</span>
                        {log.agentId && <span className="text-[9px] text-slate-400 block">{log.agentId}</span>}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-800 whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 text-slate-600 truncate max-w-xs">
                        {log.resource}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.riskTier === 'CRITICAL' 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                            : log.riskTier === 'HIGH' 
                              ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                              : 'bg-slate-100 text-slate-600'
                        }`}>
                          {log.riskTier}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${
                          isAllowed 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {isAllowed ? <CheckCircle2 className="w-3 h-3" /> : <AlertOctagon className="w-3 h-3" />}
                          <span>{log.decision}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-sm truncate" title={log.details}>
                        {log.details || 'Verified'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
