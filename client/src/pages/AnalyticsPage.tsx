import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  FileText, 
  Filter, 
  ExternalLink,
  X,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid,
  ComposedChart
} from 'recharts';
import { api } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [trends, setTrends] = useState<any[]>([]);
  const [mines, setMines] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('All');
  const [investigatingAnomaly, setInvestigatingAnomaly] = useState<any | null>(null);

  useEffect(() => {
    Promise.all([
      api.getProductionTrends(),
      api.getMines(),
      api.getAnomalies()
    ]).then(([trendData, mineData, anomalyData]) => {
      setTrends(trendData);
      setMines(mineData);
      setAnomalies(anomalyData);
    }).catch(console.error);
  }, []);

  const filteredMines = selectedSubsidiary === 'All' 
    ? mines 
    : mines.filter(m => m.subsidiary === selectedSubsidiary);

  const formattedTrends = trends.map(t => ({
    year: t.financialYear.replace(' (Projected/YTD)', ''),
    Actual: t.actual,
    Target: t.target,
    OBR: Math.round(t.overburdenMcuM / 10) / 10,
    Dispatch: t.dispatch
  }));

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-coal-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-widest">
              Historical Intelligence
            </span>
            <span className="text-coal-400">•</span>
            <span className="text-xs text-coal-400 font-mono">10-Year Decadal Corpus</span>
          </div>
          <h1 className="text-2xl font-extrabold text-coal-50 mt-1">
            Production, Target & Overburden Analytics
          </h1>
          <p className="text-xs text-coal-400 mt-1">
            Decadal trends, target vs actual variances, subsidiary benchmarks, and operational anomaly detection.
          </p>
        </div>

        {/* Subsidiary Filter */}
        <div className="flex items-center gap-2 bg-coal-900 border border-coal-800 p-1.5 rounded-lg text-xs self-start sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-coal-400 ml-1" />
          <select
            value={selectedSubsidiary}
            onChange={(e) => setSelectedSubsidiary(e.target.value)}
            className="bg-transparent text-coal-200 focus:outline-none pr-2 font-semibold"
          >
            <option value="All">All Subsidiaries</option>
            <option value="SECL">SECL (Chhattisgarh)</option>
            <option value="MCL">MCL (Odisha)</option>
            <option value="NCL">NCL (Singrauli)</option>
            <option value="CCL">CCL (Jharkhand)</option>
            <option value="BCCL">BCCL (Jharia)</option>
          </select>
        </div>
      </div>

      {/* ANOMALY DETECTION INTELLIGENCE PANEL (Section 27) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-coal-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Operational Anomalies Detected by Engine ({anomalies.length})
          </h3>
          <span className="text-[11px] font-mono text-coal-400">
            Multi-Source Corroboration Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {anomalies.map(anom => (
            <div 
              key={anom.id}
              className="p-4 rounded-xl bg-coal-900 border border-red-900/40 hover:border-red-700/80 transition-all space-y-3 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-gold-400 text-[11px] font-bold">
                    {anom.mine} • FY {anom.financialYear}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 font-mono font-bold text-[10px] border border-red-800">
                    {anom.deviation}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-coal-100">{anom.title}</h4>
                <p className="text-[11px] text-coal-400 leading-snug line-clamp-2">
                  {anom.description}
                </p>
              </div>

              <div className="pt-2 border-t border-coal-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-coal-400">
                  {anom.supportingDocsCount} Supporting Docs
                </span>
                <button
                  onClick={() => setInvestigatingAnomaly(anom)}
                  className="px-3 py-1 rounded bg-red-950/80 hover:bg-red-900 text-red-300 font-bold text-xs border border-red-800 transition-colors"
                >
                  Investigate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Charts: 10-Year Production & Target Achievement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Production vs Target Composed Curve */}
        <div className="bg-coal-900 border border-coal-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-coal-800 pb-2">
            <div>
              <h3 className="text-xs font-bold text-coal-100 uppercase tracking-wider">
                Production Target vs Actual Achievement (MT)
              </h3>
              <p className="text-[11px] text-coal-400">10-Year historical variance tracking</p>
            </div>
            <span className="text-xs font-mono font-bold text-gold-400">+53.2% Decadal Growth</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={formattedTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232d3e" vertical={false} />
                <XAxis dataKey="year" stroke="#7e8b9f" fontSize={11} />
                <YAxis stroke="#7e8b9f" fontSize={11} domain={[450, 850]} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1117', borderColor: '#232d3e', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Target" fill="#323e53" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="Actual" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={16} />
                <Line type="monotone" dataKey="Dispatch" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Overburden Removal (OBR) Scaling */}
        <div className="bg-coal-900 border border-coal-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-coal-800 pb-2">
            <div>
              <h3 className="text-xs font-bold text-coal-100 uppercase tracking-wider">
                Overburden Removal (M.Cu.M) Evolution
              </h3>
              <p className="text-[11px] text-coal-400">Stripping advance enabling future seam exposure</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">1,965.2 M.Cu.M in FY24</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232d3e" vertical={false} />
                <XAxis dataKey="year" stroke="#7e8b9f" fontSize={11} />
                <YAxis stroke="#7e8b9f" fontSize={11} domain={[100, 220]} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1117', borderColor: '#232d3e', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="OBR" name="Overburden (Tens of M.Cu.M)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Mine-Level Drilldown Benchmark Table */}
      <div className="bg-coal-900 border border-coal-800 rounded-xl overflow-hidden shadow-sm space-y-3 p-5">
        <div className="flex items-center justify-between border-b border-coal-800 pb-3">
          <div>
            <h3 className="text-xs font-bold text-coal-100 uppercase tracking-wider">
              Mine-Level Operational & Stripping Benchmarking (FY 2023-24)
            </h3>
            <p className="text-[11px] text-coal-400">
              Corroborated against Form IV statutory monthly returns
            </p>
          </div>
          <span className="font-mono text-xs text-gold-400">{filteredMines.length} Megaprojects</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-coal-200">
            <thead>
              <tr className="border-b border-coal-800 bg-coal-950/60 text-[10px] uppercase font-bold text-coal-400">
                <th className="py-2.5 px-3">Mine / Project</th>
                <th className="py-2.5 px-3">Subsidiary</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Production (MT)</th>
                <th className="py-2.5 px-3">Target (MT)</th>
                <th className="py-2.5 px-3">Overburden (M.Cu.M)</th>
                <th className="py-2.5 px-3">Stripping Ratio</th>
                <th className="py-2.5 px-3">Proven Reserve</th>
                <th className="py-2.5 px-3">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coal-800 font-mono text-[11px]">
              {filteredMines.map(m => (
                <tr key={m.mine} className="hover:bg-coal-850/60 transition-colors font-sans">
                  <td className="py-2.5 px-3 font-bold text-coal-100">{m.mine}</td>
                  <td className="py-2.5 px-3 text-gold-400 font-semibold">{m.subsidiary}</td>
                  <td className="py-2.5 px-3 text-coal-400">{m.type}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-coal-100">{m.productionFY24}</td>
                  <td className="py-2.5 px-3 font-mono text-coal-400">{m.targetFY24}</td>
                  <td className="py-2.5 px-3 font-mono text-coal-300">{m.obrFY24}</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">{m.strippingRatio}</td>
                  <td className="py-2.5 px-3 font-mono text-coal-300">{m.reserveMT} MT</td>
                  <td className="py-2.5 px-3 font-mono text-gold-300 font-bold">{m.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anomaly Investigation Modal (Section 27) */}
      {investigatingAnomaly && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-coal-900 border border-coal-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden space-y-4 p-6">
            <div className="flex items-start justify-between border-b border-coal-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-red-400 font-mono">
                  ANOMALY INVESTIGATION DOSSIER
                </span>
                <h3 className="text-base font-bold text-coal-100 mt-0.5">
                  {investigatingAnomaly.title}
                </h3>
              </div>
              <button 
                onClick={() => setInvestigatingAnomaly(null)}
                className="text-coal-400 hover:text-coal-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-coal-950 border border-coal-800 text-xs">
              <div>
                <span className="text-[10px] text-coal-400 uppercase font-bold">MoU Target</span>
                <p className="font-mono font-bold text-coal-100 mt-0.5">{investigatingAnomaly.expected}</p>
              </div>
              <div>
                <span className="text-[10px] text-coal-400 uppercase font-bold">Actual Output</span>
                <p className="font-mono font-bold text-red-400 mt-0.5">{investigatingAnomaly.actual}</p>
              </div>
              <div>
                <span className="text-[10px] text-coal-400 uppercase font-bold">Variance</span>
                <p className="font-mono font-bold text-red-400 mt-0.5">{investigatingAnomaly.deviation}</p>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-coal-300 block mb-1">
                Corroborated Document Extract Analysis:
              </span>
              <p className="p-3 rounded-lg bg-coal-950 border border-coal-800 text-xs text-coal-200 leading-relaxed font-sans">
                {investigatingAnomaly.description}
              </p>
            </div>

            {/* Safety Rule 10 Notice (Section 27) */}
            <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Causation Verification Notice
              </div>
              <p className="text-[11px] text-amber-200/80 leading-normal">
                CoalIntelligence AI does not assume automatic causation. Document citations explicitly substantiate rainfall records, pit inundation measurements, and water pumping logs.
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-coal-400 block mb-1">
                Supporting Archival Documents Found ({investigatingAnomaly.corroboratingDocuments.length})
              </span>
              <div className="space-y-1.5">
                {investigatingAnomaly.corroboratingDocuments.map((docName: string, idx: number) => (
                  <div key={idx} className="p-2 rounded bg-coal-950 border border-coal-800 text-xs flex items-center justify-between">
                    <span className="text-coal-200 truncate">{docName}</span>
                    <span className="text-gold-400 text-[11px] font-mono">Verified Form IV</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInvestigatingAnomaly(null)}
                className="px-4 py-2 rounded-lg bg-coal-800 hover:bg-coal-750 text-xs font-semibold text-coal-200 border border-coal-700"
              >
                Close Investigation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
