import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../api/client';
import { Agent, AgentApprovalRequest, AgentIncident, AuditLogEntry, PolicyRule } from '../../types/econos';
import { useAuth } from '../../context/AuthContext';
import { AgentRegistry } from './AgentRegistry';
import { AIFirewallGateway } from './AIFirewallGateway';
import { HumanApprovalQueue } from './HumanApprovalQueue';
import { IncidentManager } from './IncidentManager';
import { AuditLogViewer } from './AuditLogViewer';
import { 
  ShieldAlert, 
  Bot, 
  UserCheck, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  RefreshCw,
  Activity
} from 'lucide-react';

type TrustSubTab = 'REGISTRY' | 'FIREWALL' | 'APPROVALS' | 'INCIDENTS' | 'AUDIT';

export const TrustWorkspace: React.FC = () => {
  const { currentOrg } = useAuth();
  const [subTab, setSubTab] = useState<TrustSubTab>('REGISTRY');

  const [agents, setAgents] = useState<Agent[]>([]);
  const [approvals, setApprovals] = useState<AgentApprovalRequest[]>([]);
  const [incidents, setIncidents] = useState<AgentIncident[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [policies, setPolicies] = useState<PolicyRule[]>([]);
  const [overview, setOverview] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTrustData = useCallback(async () => {
    try {
      setLoading(true);
      const [overviewRes, agentsRes, appRes, incRes, logsRes, polRes] = await Promise.all([
        api.getTrustOverview().catch(() => null),
        api.getAgents().catch(() => []),
        api.getApprovals().catch(() => []),
        api.getIncidents().catch(() => []),
        api.getAuditLogs().catch(() => []),
        api.getPolicies().catch(() => [])
      ]);

      setOverview(overviewRes);
      setAgents(agentsRes || []);
      setApprovals(appRes || []);
      setIncidents(incRes || []);
      setAuditLogs(logsRes || []);
      setPolicies(polRes || []);
    } catch (err) {
      console.error('Failed to load trust data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrustData();
  }, [loadTrustData, currentOrg?.id]);

  const pendingApprovalsCount = approvals.filter(a => a.status === 'PENDING').length;
  const openIncidentsCount = incidents.filter(i => i.status === 'OPEN' || i.status === 'INVESTIGATING').length;

  return (
    <div className="space-y-6">
      {/* Fleet Overview Header Bento Metric Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        
        {/* Fleet Trust Score - Mint */}
        <div className="bg-[#f0f7f3] border border-[#d7e9dc] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-[10px] uppercase font-bold">Fleet Trust Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {overview?.avgTrustScore !== null && overview?.avgTrustScore !== undefined 
              ? `${overview.avgTrustScore}/100` 
              : 'INSUFFICIENT DATA'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-sans">
            Weighted across {agents.length} autonomous agents
          </div>
        </div>

        {/* Active Agents - Soft Blue */}
        <div className="bg-[#eff5fb] border border-[#d9e6f2] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-[10px] uppercase font-bold">Active Fleet</span>
            <Bot className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {overview?.activeAgents || 0} <span className="text-xs font-normal text-slate-500">/ {agents.length}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-sans">
            {agents.filter(a => a.status === 'FROZEN').length} frozen
          </div>
        </div>

        {/* Pending Approvals - Warm Cream */}
        <div className={`border rounded-2xl p-5 shadow-xs transition ${
          pendingApprovalsCount > 0 ? 'bg-[#fdf9f1] border-[#f4ebda]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-[10px] uppercase font-bold">Pending Approvals</span>
            <UserCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600 tracking-tight">
            {pendingApprovalsCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-sans">
            Requires human authorization
          </div>
        </div>

        {/* Open Incidents - Soft Rose or Clean White */}
        <div className={`border rounded-2xl p-5 shadow-xs transition ${
          openIncidentsCount > 0 ? 'bg-[#fef2f2] border-[#fecaca]' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-[10px] uppercase font-bold">Active Incidents</span>
            <AlertTriangle className={`w-4 h-4 ${openIncidentsCount > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
          </div>
          <div className={`text-2xl font-black tracking-tight ${openIncidentsCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {openIncidentsCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-sans">
            {overview?.totalAuditLogs || 0} audit logs recorded
          </div>
        </div>

      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/90 shadow-2xs overflow-x-auto no-scrollbar">
          <button
            id="trust-subtab-registry"
            onClick={() => setSubTab('REGISTRY')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              subTab === 'REGISTRY' 
                ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-sky-600" />
            <span>1. Agent Fleet ({agents.length})</span>
          </button>

          <button
            id="trust-subtab-firewall"
            onClick={() => setSubTab('FIREWALL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              subTab === 'FIREWALL' 
                ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>2. AI Firewall Gateway</span>
          </button>

          <button
            id="trust-subtab-approvals"
            onClick={() => setSubTab('APPROVALS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              subTab === 'APPROVALS' 
                ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>3. Approval Queue</span>
            {pendingApprovalsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px]">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            id="trust-subtab-incidents"
            onClick={() => setSubTab('INCIDENTS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              subTab === 'INCIDENTS' 
                ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>4. Incidents</span>
            {openIncidentsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]">
                {openIncidentsCount}
              </span>
            )}
          </button>

          <button
            id="trust-subtab-audit"
            onClick={() => setSubTab('AUDIT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              subTab === 'AUDIT' 
                ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>5. Immutable Audit ({auditLogs.length})</span>
          </button>
        </div>

        <button
          onClick={loadTrustData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-mono transition self-end sm:self-auto shadow-2xs"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Fleet</span>
        </button>
      </div>

      {/* Subtab Contents */}
      {subTab === 'REGISTRY' && (
        <AgentRegistry
          agents={agents}
          onRefresh={loadTrustData}
        />
      )}

      {subTab === 'FIREWALL' && (
        <AIFirewallGateway
          agents={agents}
          onActionCompleted={loadTrustData}
          onOpenApprovals={() => setSubTab('APPROVALS')}
        />
      )}

      {subTab === 'APPROVALS' && (
        <HumanApprovalQueue
          approvals={approvals}
          onRefresh={loadTrustData}
        />
      )}

      {subTab === 'INCIDENTS' && (
        <IncidentManager
          incidents={incidents}
          onRefresh={loadTrustData}
        />
      )}

      {subTab === 'AUDIT' && (
        <AuditLogViewer
          logs={auditLogs}
        />
      )}
    </div>
  );
};
