import React, { useState, useEffect } from 'react';
import { FileClock, Search, Filter, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { AuditLogItem } from '../types';

export const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All Actions');

  const loadLogs = () => {
    setLoading(true);
    api.getAuditLogs({
      search: search.trim() || undefined,
      action: actionFilter !== 'All Actions' ? actionFilter : undefined
    }).then(data => {
      setLogs(data);
      setLoading(false);
    }).catch(console.error);
  };

  useEffect(() => {
    loadLogs();
  }, [actionFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadLogs();
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["Timestamp,User,Role,Action,Target,Document,PreviousValue,NewValue,Rationale,IP"]
      .concat(logs.map(l => `"${l.timestamp}","${l.user}","${l.role}","${l.action}","${l.targetEntity}","${l.documentName || ''}","${l.previousValue || ''}","${l.newValue || ''}","${l.rationale || ''}","${l.ipAddress}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CoalIntelligence_Audit_Log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-coal-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-widest">
              Governance & Statutory Accountability
            </span>
            <span className="text-coal-400">•</span>
            <span className="text-xs text-coal-400 font-mono">Immutable Event Trail</span>
          </div>
          <h1 className="text-2xl font-extrabold text-coal-50 mt-1">
            System Audit Trail & Security Ledger
          </h1>
          <p className="text-xs text-coal-400 mt-1">
            Every document ingestion, conflict override, AI query, and report sign-off is indelibly registered.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-coal-800 hover:bg-coal-750 text-coal-200 border border-coal-700 text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-gold-400" />
          Export Audit Ledger (CSV)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-coal-900 border border-coal-800 flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-coal-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search target entity, user name, or rationale..."
            className="w-full pl-9 pr-4 py-2 bg-coal-950 border border-coal-800 rounded-lg text-xs text-coal-100 placeholder-coal-400 focus:outline-none"
          />
        </form>

        <div className="w-full sm:w-64">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full p-2 bg-coal-950 border border-coal-800 rounded-lg text-xs text-coal-200 focus:outline-none"
          >
            <option>All Actions</option>
            <option value="DOCUMENT_UPLOAD">DOCUMENT_UPLOAD</option>
            <option value="INGESTION_PIPELINE_COMPLETE">INGESTION_PIPELINE_COMPLETE</option>
            <option value="AI_QUERY_EXECUTED">AI_QUERY_EXECUTED</option>
            <option value="GENERATE_REPORT">GENERATE_REPORT</option>
            <option value="APPROVE_REPORT">APPROVE_REPORT</option>
            <option value="RESOLVE_DATA_CONFLICT">RESOLVE_DATA_CONFLICT</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-coal-900 border border-coal-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-coal-850 border-b border-coal-800 flex items-center justify-between text-xs font-bold text-coal-300">
          <span>{logs.length} Immutable Log Entries</span>
          <span className="font-mono text-emerald-400 text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Cryptographically Chained
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-coal-800 bg-coal-950 text-[10px] uppercase font-bold text-coal-400 tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User & Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Value Transition</th>
                <th className="py-3 px-4">Auditor Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coal-800 font-sans text-coal-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-coal-850/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-coal-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-coal-100">{log.user}</p>
                    <span className="text-[10px] font-mono text-gold-400">{log.role}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-coal-950 border border-coal-800 text-[10px] font-mono font-bold text-coal-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-coal-200 truncate max-w-xs">{log.targetEntity}</p>
                    {log.documentName && (
                      <span className="text-[10px] text-coal-400 truncate block font-mono">
                        {log.documentName}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    {log.previousValue && (
                      <span className="text-red-400/80 block line-through truncate max-w-xs">
                        {log.previousValue}
                      </span>
                    )}
                    <span className="text-emerald-400 font-bold block truncate max-w-xs">
                      {log.newValue}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-coal-300 leading-snug max-w-sm">
                    {log.rationale || 'System automated ledger event'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
