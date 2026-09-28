import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, Plus, Search, Eye, Download, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { ReportItem } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    api.getReports().then(data => {
      setReports(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const filtered = filterType === 'All' ? reports : reports.filter(r => r.type === filterType);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-coal-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-widest">
              Statutory Intelligence Synthesis
            </span>
            <span className="text-coal-400">•</span>
            <span className="text-xs text-coal-400 font-mono">2,841 Reports Generated</span>
          </div>
          <h1 className="text-2xl font-extrabold text-coal-50 mt-1">
            Automated Reports & Governance
          </h1>
          <p className="text-xs text-coal-400 mt-1">
            Official parliamentary responses, DPR briefs, annual reviews, and human-in-the-loop review workflows.
          </p>
        </div>

        <button
          onClick={() => navigate('/reports/create')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-600 hover:bg-gold-500 text-coal-950 text-xs font-bold transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Report Wizard
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-coal-900 border border-coal-800 rounded-xl">
        {['All', 'Parliamentary Response', 'Production Report', 'Mining Performance Report', 'Annual Report Analysis'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterType === t 
                ? 'bg-coal-800 text-gold-400 border border-coal-700 font-bold'
                : 'text-coal-400 hover:text-coal-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(report => (
          <div
            key={report.id}
            onClick={() => navigate(`/reports/${report.id}`)}
            className="p-5 rounded-xl bg-coal-900 border border-coal-800 hover:border-coal-700 cursor-pointer transition-all space-y-4 group flex flex-col justify-between shadow-sm"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] uppercase font-bold text-coal-400 font-mono">
                  {report.type}
                </span>
                <StatusBadge status={report.status} size="sm" />
              </div>
              <h3 className="text-sm font-bold text-coal-100 group-hover:text-gold-400 transition-colors line-clamp-2">
                {report.title}
              </h3>
              <p className="text-xs text-coal-400 font-mono">
                Ref: {report.referenceNumber}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-coal-800 text-xs">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-coal-400 block text-[10px] uppercase font-bold">Scope</span>
                  <span className="font-semibold text-coal-200 truncate block">
                    {report.subsidiary} {report.mine ? `• ${report.mine}` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-coal-400 block text-[10px] uppercase font-bold">Time Period</span>
                  <span className="font-mono text-coal-300 truncate block">{report.timePeriod}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-emerald-400 font-mono font-bold">
                  {report.evidenceCoverage}% Evidence
                </span>
                <span className="text-coal-400">{report.sourcesCount} Verified Sources</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
