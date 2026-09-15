import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { EconomicGraphData, EconomicGraphNode, EconomicGraphEdge } from '../../types/econos';
import { 
  Network, 
  Filter, 
  Layers, 
  Info, 
  RefreshCw, 
  ZoomIn, 
  ZoomOut,
  Maximize2
} from 'lucide-react';

export const EconomicGraphView: React.FC = () => {
  const [graphData, setGraphData] = useState<EconomicGraphData | null>(null);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedNode, setSelectedNode] = useState<EconomicGraphNode | null>(null);
  const [loading, setLoading] = useState(true);

  const loadGraph = async () => {
    setLoading(true);
    try {
      const data = await api.getEconomicGraph();
      setGraphData(data);
      if (data.nodes.length > 0) {
        setSelectedNode(data.nodes[0]);
      }
    } catch (err) {
      console.error('Failed to load graph data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGraph();
  }, []);

  const nodeTypes = ['ALL', 'PERSON', 'ORGANIZATION', 'BUSINESS', 'ASSET', 'OPPORTUNITY', 'AGENT', 'OUTCOME'];

  const filteredNodes = (graphData?.nodes || []).filter(
    n => selectedType === 'ALL' || n.type === selectedType
  );

  const getNodeColor = (type: EconomicGraphNode['type']) => {
    switch (type) {
      case 'PERSON': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'ORGANIZATION': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'BUSINESS': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ASSET': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'LIABILITY': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'OPPORTUNITY': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'AGENT': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'OUTCOME': return 'bg-teal-50 text-teal-700 border-teal-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getConnectedEdges = (nodeId: string) => {
    return (graphData?.edges || []).filter(e => e.source === nodeId || e.target === nodeId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">Relational Economic Fabric</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">Cross-Layer Economic Graph</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Unifying People • Assets • Business Entities • Opportunities • Autonomous Agents • Verified Outcomes.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
            <span className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              Nodes: <strong className="text-slate-900">{graphData?.nodes.length || 0}</strong>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              Edges: <strong className="text-slate-900">{graphData?.edges.length || 0}</strong>
            </span>
            <button
              onClick={loadGraph}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              title="Refresh Graph"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Node Type Filters */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs font-mono no-scrollbar">
          <span className="text-slate-400 text-[10px] uppercase mr-1">Filter Nodes:</span>
          {nodeTypes.map(nt => (
            <button
              key={nt}
              onClick={() => setSelectedType(nt)}
              className={`px-2.5 py-1 rounded-md transition ${
                selectedType === nt
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50'
              }`}
            >
              {nt}
            </button>
          ))}
        </div>
      </div>

      {/* Graph Visual Explorer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Visual Node Cloud (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 min-h-[460px] relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="text-[10px] font-mono text-slate-400 uppercase flex justify-between items-center mb-4">
            <span>Spatial Economic Topology</span>
            <span>Click any node to inspect relational provenance</span>
          </div>

          {/* Node Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 z-10">
            {filteredNodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              const connectedCount = getConnectedEdges(node.id).length;

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3 rounded-lg border text-left font-mono transition relative ${
                    isSelected
                      ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-500/20 shadow-sm'
                      : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase border ${getNodeColor(node.type)}`}>
                      {node.type}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {connectedCount} links
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 truncate font-sans mt-1">
                    {node.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {node.id}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Background Vector Motif */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Multi-Tenant Relational Isolation: VERIFIED</span>
            <span>ECONOS Directed Graph Engine v1.0</span>
          </div>
        </div>

        {/* Node Inspector & Connected Edges (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 font-mono text-xs space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-800 uppercase">Node Inspector</span>
            {selectedNode && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getNodeColor(selectedNode.type)}`}>
                {selectedNode.type}
              </span>
            )}
          </div>

          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Node Label</span>
                <div className="text-base font-bold text-slate-900 font-sans">{selectedNode.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">ID: {selectedNode.id}</div>
              </div>

              {/* Node Metadata / Properties */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                <span className="text-[10px] text-slate-600 font-bold block uppercase mb-1">Attributes</span>
                {Object.entries(selectedNode.properties || {}).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[11px]">
                    <span className="text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-slate-900 font-semibold">{String(v)}</span>
                  </div>
                ))}
              </div>

              {/* Connected Relationships (Edges) */}
              <div>
                <span className="text-[10px] text-slate-600 font-bold block uppercase mb-2">
                  Connected Relational Edges ({getConnectedEdges(selectedNode.id).length})
                </span>

                <div className="space-y-1.5">
                  {getConnectedEdges(selectedNode.id).map(edge => {
                    const isSource = edge.source === selectedNode.id;
                    const counterpartId = isSource ? edge.target : edge.source;
                    const counterpartNode = graphData?.nodes.find(n => n.id === counterpartId);

                    return (
                      <div key={edge.id} className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px]">
                        <div className="flex items-center justify-between text-slate-600 mb-0.5">
                          <span className="text-purple-700 font-bold text-[10px]">{edge.relationship}</span>
                          <span className="text-[9px] text-slate-400">{isSource ? 'Outgoing →' : '← Incoming'}</span>
                        </div>
                        <div className="text-slate-800 font-sans truncate">
                          {counterpartNode?.label || counterpartId}
                        </div>
                        {edge.financialImpact && (
                          <div className="text-emerald-700 font-mono text-[10px] mt-0.5">
                            Financial Volume: ${edge.financialImpact.toLocaleString()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              Select a node in the graph view to inspect its properties and relationships.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
