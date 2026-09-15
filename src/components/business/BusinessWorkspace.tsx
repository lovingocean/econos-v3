import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../api/client';
import { Business, EconomicProfile, Opportunity, Scenario, OutcomeVerification } from '../../types/econos';
import { useAuth } from '../../context/AuthContext';
import { EconomicSnapshot } from './EconomicSnapshot';
import { OpportunityEngine } from './OpportunityEngine';
import { ScenarioEngine } from './ScenarioEngine';
import { OutcomeVerificationView } from './OutcomeVerification';
import { 
  BarChart3, 
  Sparkles, 
  Sliders, 
  FileCheck,
  RefreshCw
} from 'lucide-react';

type BusinessSubTab = 'SNAPSHOT' | 'OPPORTUNITIES' | 'SCENARIO' | 'OUTCOMES';

export const BusinessWorkspace: React.FC = () => {
  const { currentOrg, currentBusiness } = useAuth();
  const [subTab, setSubTab] = useState<BusinessSubTab>('SNAPSHOT');
  
  const [profile, setProfile] = useState<EconomicProfile | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [outcomes, setOutcomes] = useState<OutcomeVerification[]>([]);
  const [loading, setLoading] = useState(true);

  // Cross-component handoffs
  const [prefilledOppForScenario, setPrefilledOppForScenario] = useState<Opportunity | null>(null);
  const [prefilledOppForOutcome, setPrefilledOppForOutcome] = useState<Opportunity | null>(null);

  const loadBusinessData = useCallback(async () => {
    try {
      setLoading(true);
      const [snapshotRes, oppsRes, scenRes, outRes] = await Promise.all([
        api.getEconomicSnapshot().catch(() => null),
        api.getOpportunities().catch(() => []),
        api.getScenarios().catch(() => []),
        api.getOutcomes().catch(() => [])
      ]);

      if (snapshotRes) {
        setProfile(snapshotRes.profile);
      }
      setOpportunities(oppsRes || []);
      setScenarios(scenRes || []);
      setOutcomes(outRes || []);
    } catch (err) {
      console.error('Failed to load business data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBusinessData();
  }, [loadBusinessData, currentOrg?.id]);

  const handleSimulateInScenario = (opp: Opportunity) => {
    setPrefilledOppForScenario(opp);
    setSubTab('SCENARIO');
  };

  const handleVerifyOutcome = (opp: Opportunity) => {
    setPrefilledOppForOutcome(opp);
    setSubTab('OUTCOMES');
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/90 shadow-xs overflow-x-auto no-scrollbar">
          <button
            id="subtab-snapshot"
            onClick={() => setSubTab('SNAPSHOT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              subTab === 'SNAPSHOT' 
                ? 'bg-[#132338] text-white font-bold shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>1. Economic Snapshot</span>
          </button>

          <button
            id="subtab-opportunities"
            onClick={() => setSubTab('OPPORTUNITIES')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              subTab === 'OPPORTUNITIES' 
                ? 'bg-[#132338] text-white font-bold shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Opportunity Engine ({opportunities.length})</span>
          </button>

          <button
            id="subtab-scenario"
            onClick={() => setSubTab('SCENARIO')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              subTab === 'SCENARIO' 
                ? 'bg-[#132338] text-white font-bold shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>3. What-If Simulation ({scenarios.length})</span>
          </button>

          <button
            id="subtab-outcomes"
            onClick={() => setSubTab('OUTCOMES')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              subTab === 'OUTCOMES' 
                ? 'bg-[#132338] text-white font-bold shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>4. Outcome Verification ({outcomes.length})</span>
          </button>
        </div>

        <button
          onClick={loadBusinessData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-mono transition self-end sm:self-auto shadow-xs"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Active Tab Content */}
      {subTab === 'SNAPSHOT' && (
        <EconomicSnapshot
          business={currentBusiness}
          profile={profile}
          onRefresh={loadBusinessData}
        />
      )}

      {subTab === 'OPPORTUNITIES' && (
        <OpportunityEngine
          opportunities={opportunities}
          onRefresh={loadBusinessData}
          onSimulateInScenario={handleSimulateInScenario}
          onVerifyOutcome={handleVerifyOutcome}
        />
      )}

      {subTab === 'SCENARIO' && (
        <ScenarioEngine
          profile={profile}
          scenarios={scenarios}
          onRefresh={loadBusinessData}
          prefillOpportunity={prefilledOppForScenario}
        />
      )}

      {subTab === 'OUTCOMES' && (
        <OutcomeVerificationView
          verifications={outcomes}
          opportunities={opportunities}
          onRefresh={loadBusinessData}
          prefillOpportunity={prefilledOppForOutcome}
        />
      )}
    </div>
  );
};
