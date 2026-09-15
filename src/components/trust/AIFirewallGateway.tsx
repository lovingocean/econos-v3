import React, { useState } from 'react';
import { Agent, FirewallDecision } from '../../types/econos';
import { api } from '../../api/client';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Play, 
  AlertOctagon, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Layers, 
  Clock, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface AIFirewallGatewayProps {
  agents: Agent[];
  onActionCompleted?: () => void;
  onOpenApprovals?: () => void;
}

export const AIFirewallGateway: React.FC<AIFirewallGatewayProps> = ({
  agents,
  onActionCompleted,
  onOpenApprovals
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || 'agt_mercurius_02');
  const [toolName, setToolName] = useState('read_business_data');
  const [intent, setIntent] = useState('Analyze 90-day invoice records for cost optimization');
  const [financialImpact, setFinancialImpact] = useState<number>(0);
  const [targetResource, setTargetResource] = useState('General Ledger');
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [resultDecision, setResultDecision] = useState<FirewallDecision | null>(null);

  const presets = [
    {
      label: '1. Safe Read (LOW Risk)',
      desc: 'Authorized read operation with zero capital commitment.',
      agentId: 'agt_atlas_04',
      tool: 'read_business_data',
      intent: 'Analyze vendor supply chain metrics',
      impact: 0,
      resource: 'Supply Chain Database'
    },
    {
      label: '2. High-Value Action (ESCALATE)',
      desc: 'Signs contract for $35,000 exceeding $25k autonomous threshold.',
      agentId: 'agt_mercurius_02',
      tool: 'vendor_transaction_sign',
      intent: 'Execute annualized cloud hosting volume contract',
      impact: 35000,
      resource: 'Cloud Infrastructure Contract CI-2026'
    },
    {
      label: '3. Destructive Pattern (BLOCK)',
      desc: 'Banned pattern DROP TABLE intercepted by stage 2 guardrails.',
      agentId: 'agt_mercurius_02',
      tool: 'database_query',
      intent: 'DROP TABLE audit_logs; DELETE FROM users;',
      impact: 0,
      resource: 'Core Database'
    },
    {
      label: '4. Privilege Violation (BLOCK)',
      desc: 'Agent lacks ungranted permission to execute wire transfers.',
      agentId: 'agt_atlas_04', // Atlas does not have EXECUTE_TRANSACTION
      tool: 'wire_transfer_transaction',
      intent: 'Transfer emergency funds to offshore staging account',
      impact: 10000,
      resource: 'Operating Bank Account'
    },
    {
      label: '5. Frozen Agent (LOCKDOWN)',
      desc: 'Execution attempted by Valkyrie-X which has status FROZEN.',
      agentId: 'agt_valkyrie_x',
      tool: 'read_business_data',
      intent: 'Verify inventory stock numbers',
      impact: 0,
      resource: 'Inventory Service'
    }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setSelectedAgentId(p.agentId);
    setToolName(p.tool);
    setIntent(p.intent);
    setFinancialImpact(p.impact);
    setTargetResource(p.resource);
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      const decision = await api.executeFirewallTool({
        agentId: selectedAgentId,
        toolName,
        intent,
        financialImpact: Number(financialImpact),
        targetResource
      });
      setResultDecision(decision);
      if (onActionCompleted) onActionCompleted();
    } catch (err: any) {
      alert('Firewall execution failure: ' + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">8-Stage Autonomous AI Firewall</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">Interactive Tool Execution Gateway</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect how the AI Firewall intercepts, inspects permissions, evaluates financial risk, and routes actions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-slate-50 text-emerald-700 border border-slate-200 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Firewall Engine Active</span>
            </span>
          </div>
        </div>

        {/* Presets Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-2 font-bold">Quick Test Scenarios:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyPreset(p)}
                className="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition shadow-2xs"
              >
                <div className="text-xs font-bold font-mono text-slate-900 truncate">{p.label}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gateway Workspace: Inputs (Left) & Pipeline Decision Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Agent Action Parameters (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4 text-xs font-mono">
          <div className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
            <Play className="w-3.5 h-3.5 text-sky-600" />
            <span>Agent Tool Invocation Payload</span>
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Target Agent</label>
            <select
              value={selectedAgentId}
              onChange={e => setSelectedAgentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
            >
              {agents.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.status} • {a.riskTier} Risk • {a.autonomyLevel})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Tool Function Name</label>
            <input
              type="text"
              value={toolName}
              onChange={e => setToolName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
              placeholder="e.g. vendor_transaction_sign"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Stated Execution Intent</label>
            <textarea
              rows={2}
              value={intent}
              onChange={e => setIntent(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
              placeholder="Detailed reason for invoking this tool..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1">Financial Impact ($)</label>
              <input
                type="number"
                value={financialImpact}
                onChange={e => setFinancialImpact(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Target Resource</label>
              <input
                type="text"
                value={targetResource}
                onChange={e => setTargetResource(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <button
            id="firewall-execute-btn"
            onClick={handleExecute}
            disabled={isExecuting}
            className="w-full py-2.5 px-4 rounded-xl bg-[#132338] hover:bg-[#0c1827] text-white font-bold text-xs font-mono transition flex items-center justify-center gap-2 shadow-xs"
          >
            {isExecuting ? (
              <span>Evaluating 8-Stage Pipeline...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Submit to AI Firewall</span>
              </>
            )}
          </button>
        </div>

        {/* Right Panel: Real-Time Pipeline Evaluation Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
              <span className="font-bold text-slate-800 uppercase">Firewall Pipeline Verification Result</span>
              {resultDecision && (
                <span className={`px-2 py-0.5 rounded-full font-bold ${
                  resultDecision.decisionCode === 'ALLOWED'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : resultDecision.decisionCode === 'ESCALATED'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {resultDecision.decisionCode}
                </span>
              )}
            </div>

            {resultDecision ? (
              <div className="space-y-4">
                {/* Decision Banner */}
                <div className={`p-4 rounded-xl border ${
                  resultDecision.decisionCode === 'ALLOWED'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : resultDecision.decisionCode === 'ESCALATED'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <div className="flex items-start gap-2.5">
                    {resultDecision.decisionCode === 'ALLOWED' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : resultDecision.decisionCode === 'ESCALATED' ? (
                      <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold text-sm">{resultDecision.reason}</div>
                      <div className="text-[11px] opacity-80 mt-1">
                        Risk Tier: <strong>{resultDecision.riskTier}</strong> • Execution: {resultDecision.executed ? 'EXECUTED' : 'NOT EXECUTED'}
                      </div>
                      {resultDecision.approvalRequestId && (
                        <div className="mt-2 text-xs">
                          Approval Request Generated: <strong className="text-amber-900">{resultDecision.approvalRequestId}</strong>
                          {onOpenApprovals && (
                            <button
                              onClick={onOpenApprovals}
                              className="ml-2 underline font-bold text-slate-900 hover:text-black"
                            >
                              Go to Approval Queue →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 8-Stage Inspection Trace */}
                <div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase block mb-2">
                    8-Stage Firewall Trace Pipeline
                  </span>

                  <div className="space-y-1.5">
                    {resultDecision.pipelineStages.map((stage: any) => {
                      const isPassed = stage.status === 'PASSED';
                      const isBlocked = stage.status === 'BLOCKED';
                      const isEscalated = stage.status === 'ESCALATED';

                      return (
                        <div 
                          key={stage.stage} 
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-bold w-4">#{stage.stage}</span>
                            <span className="text-slate-800 font-semibold">{stage.name}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 truncate max-w-xs">{stage.details}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              isPassed 
                                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' 
                                : isEscalated 
                                  ? 'text-amber-700 bg-amber-50 border border-amber-200' 
                                  : 'text-rose-700 bg-rose-50 border border-rose-200'
                            }`}>
                              {stage.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-500 flex justify-between">
                  <span>Immutable Audit Log ID: {resultDecision.auditLogId}</span>
                  <span>Evaluated at {new Date(resultDecision.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-slate-400">
                <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>Select an action payload on the left and submit to view real-time 8-stage pipeline telemetry.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
