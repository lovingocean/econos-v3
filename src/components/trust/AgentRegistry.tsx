import React, { useState } from 'react';
import { Agent, AgentStatus, RiskTier } from '../../types/econos';
import { api } from '../../api/client';
import { 
  Bot, 
  ShieldCheck, 
  ShieldAlert, 
  Pause, 
  Play, 
  Snowflake, 
  Trash2, 
  Award, 
  Plus, 
  DollarSign,
  AlertCircle,
  Activity
} from 'lucide-react';
import { AgentEconomicPassportModal } from './AgentEconomicPassportModal';

interface AgentRegistryProps {
  agents: Agent[];
  onRefresh: () => void;
  onSelectAgentForGateway?: (agent: Agent) => void;
}

export const AgentRegistry: React.FC<AgentRegistryProps> = ({
  agents,
  onRefresh,
  onSelectAgentForGateway
}) => {
  const [selectedAgentForPassport, setSelectedAgentForPassport] = useState<Agent | null>(null);
  const [passportData, setPassportData] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Agent Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [riskTier, setRiskTier] = useState<RiskTier>('LOW');
  const [spendingLimit, setSpendingLimit] = useState(15000);
  const [capabilities, setCapabilities] = useState('Financial Modeling, Invoice Reconciliation');
  const [permissions, setPermissions] = useState('READ_BUSINESS_DATA');

  const handleStatusChange = async (agentId: string, newStatus: AgentStatus) => {
    try {
      await api.updateAgentStatus(agentId, newStatus);
      onRefresh();
    } catch (err: any) {
      alert('Failed to update agent status: ' + err.message);
    }
  };

  const handleViewPassport = async (agent: Agent) => {
    try {
      const p = await api.getAgentPassport(agent.id);
      setPassportData(p);
      setSelectedAgentForPassport(agent);
    } catch (err: any) {
      alert('Could not retrieve passport: ' + err.message);
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createAgent({
        name,
        description,
        riskTier,
        spendingLimitMonthly: Number(spendingLimit),
        capabilities: capabilities.split(',').map(s => s.trim()),
        permissions: permissions.split(',').map(s => s.trim() as any)
      });
      setShowAddModal(false);
      setName('');
      setDescription('');
      onRefresh();
    } catch (err: any) {
      alert('Failed to create agent: ' + err.message);
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
              <Bot className="w-4 h-4 text-sky-600" />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">Autonomous Agent Authority Registry</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">Autonomous Economic Fleet ({agents.length})</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified identity, cryptographic passports, spending authority limits, and lifecycle kill switches.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#132338] hover:bg-[#0c1827] text-white font-bold text-xs font-mono transition self-start sm:self-auto shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register New Agent</span>
          </button>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => {
          const isActive = agent.status === 'ACTIVE';
          const isFrozen = agent.status === 'FROZEN';
          const isPaused = agent.status === 'PAUSED';

          return (
            <div
              key={agent.id}
              className={`bg-white border rounded-2xl p-5 transition shadow-xs flex flex-col justify-between ${
                isFrozen
                  ? 'border-rose-300 bg-rose-50/20'
                  : isPaused
                    ? 'border-amber-300'
                    : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    {agent.id}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : isFrozen
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {agent.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{agent.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{agent.description}</p>

                {/* Authority & Limits */}
                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Trust Score:</span>
                    <span className="font-bold text-slate-800">
                      {agent.trustScore !== null ? `${agent.trustScore}/100` : 'INSUFFICIENT DATA'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Spending Cap:</span>
                    <span className="font-bold text-emerald-700">${agent.spendingLimitMonthly.toLocaleString()}/mo</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Risk Tier:</span>
                    <span className={`font-bold ${
                      agent.riskTier === 'HIGH' ? 'text-amber-700' : 'text-slate-700'
                    }`}>{agent.riskTier}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Autonomy:</span>
                    <span className="text-slate-700">{agent.autonomyLevel}</span>
                  </div>
                </div>

                {/* Permissions pills */}
                <div className="mt-3">
                  <span className="text-[10px] font-mono text-slate-500 block mb-1">Granted Permissions:</span>
                  <div className="flex flex-wrap gap-1">
                    {agent.permissions.map((p, idx) => (
                      <span key={idx} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Controls Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <button
                    onClick={() => handleViewPassport(agent)}
                    className="flex items-center gap-1 text-slate-800 hover:text-slate-950 transition font-bold"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>View Passport</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {isActive ? (
                      <button
                        onClick={() => handleStatusChange(agent.id, 'PAUSED')}
                        title="Pause Agent"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-amber-700"
                      >
                        <Pause className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(agent.id, 'ACTIVE')}
                        title="Activate Agent"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-emerald-700"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleStatusChange(agent.id, isFrozen ? 'ACTIVE' : 'FROZEN')}
                      title={isFrozen ? 'Unfreeze Agent' : 'EMERGENCY FREEZE'}
                      className={`p-1.5 rounded-lg ${
                        isFrozen 
                          ? 'bg-rose-600 text-white' 
                          : 'bg-slate-100 hover:bg-rose-50 text-rose-600'
                      }`}
                    >
                      <Snowflake className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: View Passport */}
      {selectedAgentForPassport && (
        <AgentEconomicPassportModal
          agent={selectedAgentForPassport}
          passport={passportData}
          onClose={() => setSelectedAgentForPassport(null)}
        />
      )}

      {/* Modal: Register Agent */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl font-mono text-xs">
            <h3 className="text-base font-bold text-slate-900 font-sans mb-1">Provision New Autonomous Agent</h3>
            <p className="text-slate-500 text-xs mb-4 font-sans">Establish sovereign economic identity and firewall parameters.</p>

            <form onSubmit={handleCreateAgent} className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1">Agent Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
                  placeholder="e.g. Cerberus Capital Allocation Unit"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Mandate & Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
                  placeholder="Specialized operations..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Risk Tier</label>
                  <select
                    value={riskTier}
                    onChange={e => setRiskTier(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Monthly Spending Cap ($)</label>
                  <input
                    type="number"
                    value={spendingLimit}
                    onChange={e => setSpendingLimit(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Capabilities (comma-separated)</label>
                <input
                  type="text"
                  value={capabilities}
                  onChange={e => setCapabilities(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Permissions (comma-separated)</label>
                <input
                  type="text"
                  value={permissions}
                  onChange={e => setPermissions(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-800"
                  placeholder="READ_BUSINESS_DATA, MODIFY_RECORDS"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-[#132338] hover:bg-[#0c1827] text-white font-bold transition"
                >
                  {isSubmitting ? 'Registering...' : 'Provision Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
