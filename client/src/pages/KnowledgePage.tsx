import React, { useState, useEffect } from 'react';
import { Network, GitCommit, Layers, ArrowDown, CheckCircle2, FileText, Database, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const KnowledgePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'graph' | 'lineage'>('graph');
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  const [lineage, setLineage] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  useEffect(() => {
    Promise.all([
      api.getKnowledgeGraph(),
      api.getDataLineage()
    ]).then(([gData, lData]) => {
      setGraphData(gData);
      setLineage(lData.lineage);
      if (gData.nodes && gData.nodes.length > 0) {
        setSelectedNode(gData.nodes[0]);
      }
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-coal-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-widest">
              Enterprise Ontology & Lineage
            </span>
            <span className="text-coal-400">•</span>
            <span className="text-xs text-coal-400 font-mono">End-to-End Traceability</span>
          </div>
          <h1 className="text-2xl font-extrabold text-coal-50 mt-1">
            Knowledge Base & Data Lineage
          </h1>
          <p className="text-xs text-coal-400 mt-1">
            Explore interconnected mining entities and trace generated intelligence down to original page scans.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-coal-900 border border-coal-800 p-1 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'graph' ? 'bg-coal-800 text-gold-400 font-bold' : 'text-coal-400 hover:text-coal-200'
            }`}
          >
            Knowledge Graph
          </button>
          <button
            onClick={() => setActiveTab('lineage')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'lineage' ? 'bg-coal-800 text-gold-400 font-bold' : 'text-coal-400 hover:text-coal-200'
            }`}
          >
            End-to-End Data Lineage
          </button>
        </div>
      </div>

      {/* TAB 1: KNOWLEDGE GRAPH (Section 28) */}
      {activeTab === 'graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Visual Graph Canvas (8 Cols) */}
          <div className="lg:col-span-8 bg-coal-900 border border-coal-800 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-coal-800 pb-2">
              <h3 className="text-xs font-bold text-coal-100 uppercase tracking-wider flex items-center gap-2">
                <Network className="w-4 h-4 text-gold-400" />
                Multi-Tier Enterprise Entity Graph
              </h3>
              <span className="text-xs font-mono text-coal-400">Interactive Hierarchy</span>
            </div>

            {/* SVG Visual Graph Simulation */}
            <div className="h-[460px] w-full bg-coal-950 rounded-xl border border-coal-800/80 relative overflow-hidden flex items-center justify-center p-4">
              <div className="w-full max-w-xl space-y-6">
                {/* Level 1: Apex Holding */}
                <div className="flex justify-center">
                  <div 
                    onClick={() => setSelectedNode(graphData.nodes.find(n => n.id === 'cil'))}
                    className="px-4 py-2.5 rounded-lg bg-gold-600/20 border-2 border-gold-500 text-gold-300 font-bold text-xs cursor-pointer shadow-lg hover:scale-105 transition-transform"
                  >
                    Coal India Limited (CIL Apex)
                  </div>
                </div>

                <div className="h-4 w-0.5 bg-coal-700 mx-auto" />

                {/* Level 2: Subsidiaries */}
                <div className="flex justify-center gap-3 flex-wrap">
                  {graphData.nodes.filter(n => n.type === 'Subsidiary').map(sub => (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedNode(sub)}
                      className={`px-3 py-1.5 rounded-md border text-xs font-semibold cursor-pointer transition-all ${
                        selectedNode?.id === sub.id
                          ? 'bg-coal-800 text-gold-400 border-gold-500 scale-105 shadow-md'
                          : 'bg-coal-900 text-coal-200 border-coal-750 hover:border-coal-600'
                      }`}
                    >
                      {sub.label}
                    </div>
                  ))}
                </div>

                <div className="h-4 w-0.5 bg-coal-700 mx-auto" />

                {/* Level 3: Coalfields */}
                <div className="flex justify-center gap-2 flex-wrap">
                  {graphData.nodes.filter(n => n.type === 'Coalfield').map(cf => (
                    <div
                      key={cf.id}
                      onClick={() => setSelectedNode(cf)}
                      className={`px-2.5 py-1 rounded border text-[11px] font-mono cursor-pointer transition-all ${
                        selectedNode?.id === cf.id
                          ? 'bg-coal-800 text-emerald-400 border-emerald-500 scale-105'
                          : 'bg-coal-900/80 text-coal-300 border-coal-800 hover:border-coal-700'
                      }`}
                    >
                      {cf.label}
                    </div>
                  ))}
                </div>

                <div className="h-4 w-0.5 bg-coal-700 mx-auto" />

                {/* Level 4: Megaproject Mines */}
                <div className="flex justify-center gap-2 flex-wrap">
                  {graphData.nodes.filter(n => n.type === 'Mine').map(m => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedNode(m)}
                      className={`px-2 py-1 rounded border text-[11px] font-semibold cursor-pointer transition-all ${
                        selectedNode?.id === m.id
                          ? 'bg-gold-500/20 text-gold-300 border-gold-500 scale-105'
                          : 'bg-coal-900 text-coal-400 border-coal-800 hover:border-coal-700'
                      }`}
                    >
                      {m.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Node Inspector Drawer (4 Cols) */}
          <div className="lg:col-span-4 bg-coal-900 border border-coal-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-coal-100 uppercase tracking-wider border-b border-coal-800 pb-2">
              Entity Attributes & Relationships
            </h3>

            {selectedNode ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gold-400 font-mono">
                    {selectedNode.type} Entity
                  </span>
                  <h4 className="text-base font-bold text-coal-100 mt-0.5">
                    {selectedNode.label}
                  </h4>
                  <span className="text-[11px] text-coal-400 font-mono">Node ID: {selectedNode.id}</span>
                </div>

                <div className="p-3.5 rounded-lg bg-coal-950 border border-coal-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-coal-400 block">
                    Ontological Connections:
                  </span>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    {graphData.edges
                      .filter(e => e.from === selectedNode.id || e.to === selectedNode.id)
                      .map((edge, i) => (
                        <div key={i} className="flex items-center justify-between p-1.5 rounded bg-coal-900 text-coal-300">
                          <span>{edge.label}</span>
                          <span className="text-gold-400">{edge.from === selectedNode.id ? edge.to : edge.from}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-coal-950 border border-coal-800 space-y-1 text-coal-300">
                  <span className="text-[10px] uppercase font-bold text-coal-400 block mb-1">
                    Knowledge Graph Summary:
                  </span>
                  <p className="leading-relaxed">
                    Entity is synchronized with CMPDI borehole logs and Ministry of Coal production directories. High factual integrity corroborated across multiple fiscal cycles.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-coal-400 text-xs">
                Select an entity node on the canvas to inspect its relationships.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DATA LINEAGE VIEWER (Section 29) */}
      {activeTab === 'lineage' && (
        <div className="bg-coal-900 border border-coal-800 rounded-xl p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
          <div className="border-b border-coal-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-coal-100 uppercase tracking-wider flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-emerald-400" />
                Seven-Stage Pixel-to-Report Data Lineage
              </h3>
              <p className="text-xs text-coal-400 mt-0.5">
                Every generated fact can be traced back to its raw statutory page, bounding box, and physical archive carton.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">100% Traceable</span>
          </div>

          <div className="p-3 rounded-lg bg-coal-950 border border-coal-800 text-xs font-mono text-gold-400 flex items-center justify-between">
            <span>Target Traced Record:</span>
            <strong className="text-coal-100">{lineage?.targetMetric}</strong>
          </div>

          {/* Stepper Pipeline Timeline (Section 29) */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-coal-750">
            {lineage?.steps.map((step: any, idx: number) => (
              <div key={idx} className="relative flex items-start gap-4 group">
                {/* Node Dot */}
                <div className="w-6 h-6 rounded-full bg-coal-800 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 z-10 -ml-6">
                  {step.step}
                </div>

                {/* Content Box */}
                <div className="flex-1 p-4 rounded-xl bg-coal-950 border border-coal-800 group-hover:border-coal-700 transition-colors space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-gold-400 font-mono tracking-wider">
                      STAGE {step.step}: {step.stage}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-coal-100">
                    {step.entity}
                  </h4>
                  <p className="text-[11px] text-coal-400 font-mono mt-0.5">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
