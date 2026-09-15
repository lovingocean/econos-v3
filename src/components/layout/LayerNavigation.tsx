import React from 'react';
import { Briefcase, TrendingUp, ShieldAlert, Network, FlaskConical } from 'lucide-react';

export type ActiveLayer = 'BUSINESS' | 'WEALTH' | 'TRUST' | 'GRAPH';

interface LayerNavigationProps {
  activeLayer: ActiveLayer;
  onSelectLayer: (layer: ActiveLayer) => void;
  pendingApprovalsCount?: number;
  openIncidentsCount?: number;
}

export const LayerNavigation: React.FC<LayerNavigationProps> = ({
  activeLayer,
  onSelectLayer,
  pendingApprovalsCount = 0,
  openIncidentsCount = 0
}) => {
  const layers = [
    {
      id: 'BUSINESS' as ActiveLayer,
      name: '1. Business',
      subtitle: 'Economic Reality & Performance',
      question: 'What is happening economically?',
      icon: Briefcase,
      color: 'amber'
    },
    {
      id: 'WEALTH' as ActiveLayer,
      name: '2. Wealth',
      subtitle: '20 Interconnected Engines & Twin',
      question: 'Highest-leverage wealth actions?',
      icon: TrendingUp,
      color: 'emerald'
    },
    {
      id: 'TRUST' as ActiveLayer,
      name: '3. Trust',
      subtitle: 'Agent Authority, Firewall & Passports',
      question: 'What AI can I safely authorize to act?',
      icon: ShieldAlert,
      color: 'indigo',
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} Approvals` : undefined,
      alert: openIncidentsCount > 0
    },
    {
      id: 'GRAPH' as ActiveLayer,
      name: 'Economic Graph',
      subtitle: 'Cross-Layer Relational Fabric',
      question: 'People • Assets • Agents • Outcomes',
      icon: Network,
      color: 'purple'
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2.5 no-scrollbar">
          {layers.map(layer => {
            const Icon = layer.icon;
            const isActive = activeLayer === layer.id;

            return (
              <button
                key={layer.id}
                id={`tab-${layer.id.toLowerCase()}`}
                onClick={() => onSelectLayer(layer.id)}
                className={`flex-1 min-w-[200px] text-left p-3.5 rounded-xl border transition relative ${
                  isActive
                    ? 'bg-white border-slate-300 shadow-sm ring-1 ring-slate-900/5'
                    : 'bg-slate-50/80 hover:bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${
                      isActive 
                        ? layer.color === 'amber' ? 'text-amber-600' 
                          : layer.color === 'emerald' ? 'text-emerald-600' 
                          : layer.color === 'indigo' ? 'text-indigo-600' 
                          : 'text-purple-600'
                        : 'text-slate-400'
                    }`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                      {layer.name}
                    </span>
                  </div>

                  {layer.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      {layer.badge}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 truncate">{layer.subtitle}</div>
                <div className="text-[10px] font-mono text-slate-400 italic mt-0.5 truncate">
                  "{layer.question}"
                </div>

                {isActive && (
                  <div className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full ${
                    layer.color === 'amber' ? 'bg-[#132338]' 
                      : layer.color === 'emerald' ? 'bg-emerald-600' 
                      : layer.color === 'indigo' ? 'bg-indigo-600' 
                      : 'bg-purple-600'
                  }`} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
