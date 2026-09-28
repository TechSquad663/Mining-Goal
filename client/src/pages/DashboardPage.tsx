import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Layers, 
  Database, 
  ShieldCheck, 
  FileSpreadsheet, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight,
  Upload,
  Plus
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import { KpiCard } from '../components/common/KpiCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { api } from '../services/api';
import { ReportItem, AIQueryHistory, ValidationIssue } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [productionData, setProductionData] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<ReportItem[]>([]);
  const [recentQueries, setRecentQueries] = useState<AIQueryHistory[]>([]);
  const [conflicts, setConflicts] = useState<ValidationIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getProductionTrends(),
      api.getReports(),
      api.getAiHistory(),
      api.getValidationIssues()
    ]).then(([trends, reports, queries, issues]) => {
      setProductionData(trends);
      setRecentReports(reports.slice(0, 4));
      setRecentQueries(queries.slice(0, 4));
      setConflicts(issues.filter(i => i.status === 'PENDING'));
      setLoading(false);
    }).catch(console.error);
  }, []);

  const chartFormattedData = productionData.map(p => ({
    year: p.financialYear.replace(' (Projected/YTD)', '').replace('20', "'"),
    Actual: p.actual,
    Target: p.target,
    OBR: Math.round(p.overburdenMcuM / 10) / 10
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-coal-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-widest">
              Executive Command Center
            </span>
            <span className="text-coal-400">•</span>
            <span className="text-xs text-coal-400 font-mono">CMPDI RI-I to VII & CIL Subsidiaries</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-coal-50 mt-1 tracking-tight">
            COALINTELLIGENCE AI
          </h1>
          <p className="text-xs md:text-sm text-coal-400 mt-1">
            Enterprise Geological, Mining & Reporting Intelligence Platform
          </p>
        </div>

        {/* Quick Action Buttons (Section 41) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/documents')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-coal-900 hover:bg-coal-800 text-coal-200 border border-coal-700 text-xs font-semibold transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            Upload Document
          </button>
          <button
            onClick={() => navigate('/ai')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gold-600 hover:bg-gold-500 text-coal-950 text-xs font-bold transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ask AI Engine
          </button>
          <button
            onClick={() => navigate('/reports/create')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-coal-900 hover:bg-coal-800 text-coal-200 border border-coal-700 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            Generate Report
          </button>
          <button
            onClick={() => navigate('/validation')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/60 text-xs font-semibold transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Review Conflicts ({conflicts.length})
          </button>
        </div>
      </div>

      {/* KPI Cards (Section 7) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard
          title="Documents Processed"
          value="128,452"
          change="+1,240 this month"
          isPositive={true}
          icon={FileText}
          accentColor="blue"
        />
        <KpiCard
          title="Pages Indexed"
          value="2.4M"
          subtitle="OCR & Form IV Logs"
          icon={Layers}
          accentColor="gold"
        />
        <KpiCard
          title="Structured Records"
          value="4.8M"
          change="+4.2% YoY"
          isPositive={true}
          icon={Database}
          accentColor="emerald"
        />
        <KpiCard
          title="Verified Data"
          value="97.8%"
          change="0.4% conflict rate"
          isPositive={true}
          icon={ShieldCheck}
          accentColor="emerald"
        />
        <KpiCard
          title="Reports Generated"
          value="2,841"
          subtitle="Parliamentary & DPR"
          icon={FileSpreadsheet}
          accentColor="gold"
        />
        <KpiCard
          title="AI Queries"
          value="17,493"
          change="Avg Latency: 740ms"
          isPositive={true}
          icon={Sparkles}
          accentColor="blue"
        />
      </div>

      {/* Operational Alerts Drawer (Section 7.F) */}
      <div className="p-4 rounded-xl bg-coal-900 border border-coal-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-800/80 text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-coal-100 uppercase tracking-wider">
              Operational Attention Needed
            </h4>
            <div className="flex flex-wrap items-center gap-3 text-xs text-coal-300 mt-1">
              <span className="text-red-400 font-semibold">• 3 data conflicts require review</span>
              <span className="text-coal-400">• 12 documents queued for OCR</span>
              <span className="text-amber-400 font-semibold">• 4 reports awaiting Officer sign-off</span>
              <span className="text-coal-400">• 1 production deviation logged in Kusmunda</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/validation')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-coal-800 hover:bg-coal-750 text-xs font-semibold text-coal-200 border border-coal-700 transition-colors self-start md:self-auto"
        >
          Resolve Conflicts
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Middle Section: A. Production Intelligence + B. Data Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* A. Production Intelligence (2 Cols) */}
        <div className="lg:col-span-2 bg-coal-900 border border-coal-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-coal-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-coal-100 uppercase tracking-wider flex items-center gap-2">
                Production Intelligence & Target Achievement
                <span className="text-[10px] px-2 py-0.5 rounded bg-coal-800 font-mono text-gold-400 border border-coal-700">
                  10-Year Decadal Curve
                </span>
              </h3>
              <p className="text-xs text-coal-400 mt-0.5">
                Coal India Limited Annual Target vs Actual Raw Coal Extraction (MT)
              </p>
            </div>
            <button
              onClick={() => navigate('/analytics')}
              className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-1 transition-colors self-start"
            >
              Full Analytics
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
            <div className="p-3 rounded-lg bg-coal-950/80 border border-coal-800/80">
              <span className="text-[10px] uppercase font-bold text-coal-400">Total Production (FY24)</span>
              <p className="text-lg font-mono font-bold text-coal-100 mt-0.5">773.6 MT</p>
              <span className="text-[11px] text-emerald-400 font-medium">+10.0% YoY</span>
            </div>
            <div className="p-3 rounded-lg bg-coal-950/80 border border-coal-800/80">
              <span className="text-[10px] uppercase font-bold text-coal-400">MoU Target (FY24)</span>
              <p className="text-lg font-mono font-bold text-coal-100 mt-0.5">780.0 MT</p>
              <span className="text-[11px] text-coal-400">99.2% Achieved</span>
            </div>
            <div className="p-3 rounded-lg bg-coal-950/80 border border-coal-800/80">
              <span className="text-[10px] uppercase font-bold text-coal-400">Overburden (OBR)</span>
              <p className="text-lg font-mono font-bold text-coal-100 mt-0.5">1,965.2 M.Cu.M</p>
              <span className="text-[11px] text-emerald-400 font-medium">+18.6% YoY</span>
            </div>
            <div className="p-3 rounded-lg bg-coal-950/80 border border-coal-800/80">
              <span className="text-[10px] uppercase font-bold text-coal-400">Top Subsidiary</span>
              <p className="text-lg font-mono font-bold text-gold-400 mt-0.5">MCL (206.1 MT)</p>
              <span className="text-[11px] text-coal-400">First &gt;200 MT</span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartFormattedData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232d3e" vertical={false} />
                <XAxis dataKey="year" stroke="#7e8b9f" fontSize={11} tickLine={false} />
                <YAxis stroke="#7e8b9f" fontSize={11} tickLine={false} domain={[400, 900]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d1117', borderColor: '#232d3e', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Target" fill="#4a576e" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="Actual" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* B. Data Quality & Repository Health (1 Col) */}
        <div className="bg-coal-900 border border-coal-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="border-b border-coal-800 pb-3">
            <h3 className="text-sm font-bold text-coal-100 uppercase tracking-wider flex items-center justify-between">
              Data Quality Assurance
              <span className="text-xs font-mono font-bold text-emerald-400">97.8% High Integrity</span>
            </h3>
            <p className="text-xs text-coal-400 mt-0.5">
              Multi-source reconciliation against statutory Form IV & Annual Accounts
            </p>
          </div>

          {/* Progress Indicators (Section 7.B) */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Verified Records
                </span>
                <span className="font-mono text-coal-200">4,694,400 (97.8%)</span>
              </div>
              <div className="h-2 w-full bg-coal-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '97.8%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-red-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Conflicting Records
                </span>
                <span className="font-mono text-coal-200">67,200 (1.4%)</span>
              </div>
              <div className="h-2 w-full bg-coal-950 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '1.4%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Pending Review
                </span>
                <span className="font-mono text-coal-200">38,400 (0.8%)</span>
              </div>
              <div className="h-2 w-full bg-coal-950 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '0.8%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-coal-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-coal-600" />
                  Extraction / OCR Anomalies
                </span>
                <span className="font-mono text-coal-200">0.02%</span>
              </div>
              <div className="h-2 w-full bg-coal-950 rounded-full overflow-hidden">
                <div className="h-full bg-coal-600 rounded-full" style={{ width: '0.02%' }} />
              </div>
            </div>
          </div>

          {/* E. Top Topics Pill Cloud (Section 7.E) */}
          <div className="pt-3 border-t border-coal-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-coal-400 block mb-2">
              Topic Intelligence Index
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'Production', count: '31%' },
                { name: 'Mechanization', count: '24%' },
                { name: 'Safety', count: '16%' },
                { name: 'Exploration', count: '12%' },
                { name: 'Environment', count: '8%' },
                { name: 'Automation', count: '5%' },
                { name: 'Sustainability', count: '4%' },
              ].map(t => (
                <span
                  key={t.name}
                  onClick={() => navigate('/topics')}
                  className="px-2 py-1 rounded bg-coal-950 hover:bg-coal-800 text-coal-300 text-xs border border-coal-800 cursor-pointer transition-colors"
                >
                  {t.name} <span className="font-mono text-[10px] text-gold-400">{t.count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: C. Recent Reports & D. Recent AI Queries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* C. Recent Reports */}
        <div className="bg-coal-900 border border-coal-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-coal-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-coal-100 uppercase tracking-wider flex items-center gap-2">
                Recent Automated Reports
              </h3>
              <p className="text-xs text-coal-400 mt-0.5">
                Official ministerial responses & mine performance reviews
              </p>
            </div>
            <button
              onClick={() => navigate('/reports')}
              className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-1 transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {recentReports.map(report => (
              <div
                key={report.id}
                onClick={() => navigate(`/reports/${report.id}`)}
                className="p-3.5 rounded-lg bg-coal-950/70 border border-coal-800/80 hover:border-coal-700 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-coal-100 group-hover:text-gold-400 transition-colors line-clamp-1">
                    {report.title}
                  </h4>
                  <StatusBadge status={report.status} size="sm" />
                </div>
                <div className="flex flex-wrap items-center justify-between text-[11px] text-coal-400">
                  <span className="font-mono">{report.referenceNumber}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-mono font-medium">
                      Coverage: {report.evidenceCoverage}%
                    </span>
                    <span>{report.sourcesCount} Sources</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* D. Recent AI Queries */}
        <div className="bg-coal-900 border border-coal-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-coal-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-coal-100 uppercase tracking-wider flex items-center gap-2">
                Recent AI Intelligence Queries
              </h3>
              <p className="text-xs text-coal-400 mt-0.5">
                Audited evidence-backed queries executed by analysts
              </p>
            </div>
            <button
              onClick={() => navigate('/ai')}
              className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-1 transition-colors"
            >
              Open Query Engine
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {recentQueries.map(q => (
              <div
                key={q.id}
                onClick={() => navigate('/ai')}
                className="p-3.5 rounded-lg bg-coal-950/70 border border-coal-800/80 hover:border-coal-700 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-coal-200 group-hover:text-gold-400 transition-colors line-clamp-1">
                    "{q.query}"
                  </p>
                  <ConfidenceBadge confidence={q.confidence} dataStatus={q.dataStatus} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-coal-400 font-mono">
                  <span>User: {q.user}</span>
                  <div className="flex items-center gap-3">
                    <span>{q.responseTimeMs}ms</span>
                    <span className="text-coal-300">{q.evidenceCount} Citations</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
