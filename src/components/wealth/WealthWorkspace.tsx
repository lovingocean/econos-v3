import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../api/client';
import { WealthProfile, WealthEngineItem } from '../../types/econos';
import { useAuth } from '../../context/AuthContext';
import { WealthDashboard } from './WealthDashboard';
import { WealthEnginesGrid } from './WealthEnginesGrid';
import { AIWealthAdvisorView } from './AIWealthAdvisorView';
import { 
  TrendingUp, 
  Cpu, 
  BrainCircuit, 
  RefreshCw 
} from 'lucide-react';

type WealthSubTab = 'DASHBOARD' | 'ENGINES' | 'ADVISOR';

export const WealthWorkspace: React.FC = () => {
  const { currentOrg } = useAuth();
  const [subTab, setSubTab] = useState<WealthSubTab>('DASHBOARD');
  const [wealthProfile, setWealthProfile] = useState<WealthProfile | null>(null);
  const [engines, setEngines] = useState<WealthEngineItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWealthData = useCallback(async () => {
    try {
      setLoading(true);
      const [wpRes, engRes] = await Promise.all([
        api.getWealthProfile().catch(() => null),
        api.getWealthEngines().catch(() => [])
      ]);
      setWealthProfile(wpRes);
      setEngines(engRes || []);
    } catch (err) {
      console.error('Failed to load wealth data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWealthData();
  }, [loadWealthData, currentOrg?.id]);

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/90 shadow-2xs overflow-x-auto no-scrollbar">
          <button
            id="wealth-subtab-dashboard"
            onClick={() => setSubTab('DASHBOARD')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              subTab === 'DASHBOARD' 
                ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. Wealth Dashboard & Balance Sheet</span>
          </button>

          <button
            id="wealth-subtab-engines"
            onClick={() => setSubTab('ENGINES')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              subTab === 'ENGINES' 
                ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-sky-600" />
            <span>2. 20 Wealth Engines ({engines.length})</span>
          </button>

          <button
            id="wealth-subtab-advisor"
            onClick={() => setSubTab('ADVISOR')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              subTab === 'ADVISOR' 
                ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-purple-600" />
            <span>3. AI Wealth Advisor (Gemini)</span>
          </button>
        </div>

        <button
          onClick={loadWealthData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-mono transition self-end sm:self-auto shadow-2xs"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Wealth State</span>
        </button>
      </div>

      {subTab === 'DASHBOARD' && (
        <WealthDashboard
          profile={wealthProfile}
          onRefresh={loadWealthData}
          onOpenAdvisor={() => setSubTab('ADVISOR')}
        />
      )}

      {subTab === 'ENGINES' && (
        <WealthEnginesGrid
          engines={engines}
          onLaunchAdvisor={() => setSubTab('ADVISOR')}
        />
      )}

      {subTab === 'ADVISOR' && (
        <AIWealthAdvisorView />
      )}
    </div>
  );
};
