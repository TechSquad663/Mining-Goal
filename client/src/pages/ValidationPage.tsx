import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  Sliders, 
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { api } from '../services/api';
import { ValidationIssue, SourceReliabilityRank } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';

export const ValidationPage: React.FC = () => {
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [hierarchy, setHierarchy] = useState<SourceReliabilityRank[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<ValidationIssue | null>(null);
  const [activeTab, setActiveTab] = useState<'conflicts' | 'hierarchy'>('conflicts');

  // Resolution Form
  const [acceptedSourceId, setAcceptedSourceId] = useState('');
  const [resolutionRationale, setResolutionRationale] = useState('');
  const [resolving, setResolving] = useState(false);

  const loadData = () => {
    Promise.all([
      api.getValidationIssues(),
      api.getSourceHierarchy()
    ]).then(([issueData, hierData]) => {
      setIssues(issueData);
      setHierarchy(hierData);
      if (issueData.length > 0 && !selectedIssue) {
        setSelectedIssue(issueData[0]);
      }
    }).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenResolve = (issue: ValidationIssue) => {
    setSelectedIssue(issue);
    if (issue.sources.length > 0) {
      setAcceptedSourceId(issue.sources[0].sourceId);
    }
    setResolutionRationale('');
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue || !acceptedSourceId) return;

    const chosenSource = selectedIssue.sources.find(s => s.sourceId === acceptedSourceId);
    if (!chosenSource) return;

    setResolving(true);
    try {
      await api.resolveValidationIssue({
        issueId: selectedIssue.id,
        acceptedSourceId,
        acceptedValue: chosenSource.value,
        rationale: resolutionRationale || 'Designated authoritative source based on reliability hierarchy'
      });
      loadData();
      alert('Conflict resolved and permanently committed to the immutable Audit Trail.');
    } catch (err) {
      console.error(err);
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-coal-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
              Data Integrity & Cross-Source Verification
            </span>
            <span className="text-coal-400">•</span>
            <span className="text-xs text-coal-400 font-mono">
              {issues.filter(i => i.status === 'PENDING').length} Unresolved Conflicts
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-coal-50 mt-1">
            Data Validation & Conflict Engine
          </h1>
          <p className="text-xs text-coal-400 mt-1">
            Detect cross-document factual discrepancies, compare multi-source evidence, and enforce statutory reliability hierarchy.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-coal-900 border border-coal-800 p-1 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('conflicts')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'conflicts' ? 'bg-coal-800 text-gold-400 font-bold' : 'text-coal-400 hover:text-coal-200'
            }`}
          >
            Discrepancy Cases ({issues.length})
          </button>
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'hierarchy' ? 'bg-coal-800 text-gold-400 font-bold' : 'text-coal-400 hover:text-coal-200'
            }`}
          >
            Source Reliability Hierarchy
          </button>
        </div>
      </div>

      {activeTab === 'conflicts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Conflict Cases List (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-coal-400 block">
              Flagged Discrepancy Records
            </span>
            <div className="space-y-2.5">
              {issues.map(issue => (
                <div
                  key={issue.id}
                  onClick={() => handleOpenResolve(issue)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                    selectedIssue?.id === issue.id
                      ? 'bg-coal-900 border-gold-500/60 shadow-md'
                      : 'bg-coal-900/60 border-coal-800 hover:border-coal-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-gold-400">
                        {issue.mine} • FY {issue.financialYear}
                      </span>
                      <h4 className="text-xs font-bold text-coal-100 mt-0.5">
                        {issue.metric} Discrepancy
                      </h4>
                    </div>
                    <StatusBadge status={issue.status} size="sm" />
                  </div>
                  <p className="text-[11px] text-coal-400 leading-snug line-clamp-2">
                    {issue.conflictDescription}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-coal-500 pt-1 border-t border-coal-800/60">
                    <span>{issue.sources.length} Competing Documents</span>
                    <span className={issue.severity === 'CRITICAL' ? 'text-red-400 font-bold' : 'text-amber-400'}>
                      {issue.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Side-by-Side Comparison & Resolution Form (7 Cols) */}
          <div className="lg:col-span-7 bg-coal-900 border border-coal-800 rounded-xl p-6 shadow-sm space-y-5">
            {selectedIssue ? (
              <div className="space-y-5">
                {/* Header */}
                <div className="border-b border-coal-800 pb-3 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-red-400 px-2 py-0.5 rounded bg-red-950 border border-red-800">
                        ⚠ DATA CONFLICT DETECTED
                      </span>
                      <span className="text-xs text-coal-400 font-mono">Case #{selectedIssue.id}</span>
                    </div>
                    <h3 className="text-sm font-bold text-coal-100 mt-1">
                      {selectedIssue.metric} — {selectedIssue.mine} (FY {selectedIssue.financialYear})
                    </h3>
                  </div>
                  <StatusBadge status={selectedIssue.status} />
                </div>

                {/* Description */}
                <p className="text-xs text-coal-300 leading-relaxed p-3 rounded-lg bg-coal-950 border border-coal-800">
                  {selectedIssue.conflictDescription}
                </p>

                {/* Side-by-Side Sources Comparison Cards (Section 13) */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-coal-400 block">
                    Competing Document Sources & Extracted Values
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedIssue.sources.map(src => (
                      <div
                        key={src.sourceId}
                        onClick={() => selectedIssue.status === 'PENDING' && setAcceptedSourceId(src.sourceId)}
                        className={`p-4 rounded-xl border transition-all space-y-2 cursor-pointer ${
                          acceptedSourceId === src.sourceId
                            ? 'bg-coal-950 border-gold-500 shadow-md ring-1 ring-gold-500'
                            : 'bg-coal-950/60 border-coal-800 hover:border-coal-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-mono font-bold text-coal-400">
                            {src.documentType}
                          </span>
                          <span className="text-xs font-mono font-bold text-gold-400">
                            Score: {src.reliabilityScore}/100
                          </span>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-coal-100 truncate" title={src.documentName}>
                            {src.documentName}
                          </p>
                          <p className="text-lg font-mono font-black text-emerald-400 mt-1">
                            {src.value} {src.unit || 'MT'}
                          </p>
                          <span className="text-[10px] text-coal-400 font-mono">Page {src.page}</span>
                        </div>

                        <p className="text-[11px] text-coal-300 font-mono bg-coal-900 p-2 rounded border border-coal-800 text-left line-clamp-3">
                          "{src.snippet}"
                        </p>

                        {src.isAuthoritative && (
                          <div className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Designated Authoritative
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resolution Form or Past Resolution Detail */}
                {selectedIssue.status === 'PENDING' ? (
                  <form onSubmit={handleResolveSubmit} className="pt-3 border-t border-coal-800 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-coal-400 block">
                      Analyst Resolution Action
                    </span>

                    <div>
                      <label className="text-xs text-coal-300 block mb-1">
                        Reviewer Rationale & Audit Justification
                      </label>
                      <textarea
                        value={resolutionRationale}
                        onChange={(e) => setResolutionRationale(e.target.value)}
                        placeholder="State technical justification for accepting the selected figure (e.g., 'Selected statutory audited annual accounts over provisional monthly estimate')..."
                        rows={3}
                        className="w-full p-2.5 bg-coal-950 border border-coal-800 rounded-lg text-xs text-coal-100 focus:outline-none focus:border-gold-500/50"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="submit"
                        disabled={resolving || !acceptedSourceId}
                        className="px-5 py-2 rounded-lg bg-gold-600 hover:bg-gold-500 disabled:opacity-40 text-coal-950 font-bold text-xs transition-colors shadow-sm"
                      >
                        {resolving ? 'Recording to Audit Trail...' : 'Confirm & Designate Authoritative Value'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      Resolution Recorded in Immutable Audit Trail
                    </div>
                    <p className="text-coal-300">
                      <strong>Accepted Value:</strong> {selectedIssue.resolution?.acceptedValue} MT
                    </p>
                    <p className="text-coal-400">
                      <strong>Justification:</strong> {selectedIssue.resolution?.rationale}
                    </p>
                    <span className="text-[10px] font-mono text-coal-500 block">
                      Resolved by {selectedIssue.resolution?.resolvedBy} on {new Date(selectedIssue.resolution?.resolvedAt!).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center text-coal-400 text-xs">
                Select a conflict case on the left to inspect competing documents.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SOURCE RELIABILITY HIERARCHY (Section 14) */}
      {activeTab === 'hierarchy' && (
        <div className="bg-coal-900 border border-coal-800 rounded-xl p-6 shadow-sm space-y-4 max-w-3xl">
          <div className="border-b border-coal-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-coal-100 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-gold-400" />
                Configurable Statutory Source Reliability Hierarchy
              </h3>
              <p className="text-xs text-coal-400 mt-0.5">
                Governs automatic weighting when multi-source conflicts are evaluated by the AI engine.
              </p>
            </div>
            <span className="text-xs font-mono text-gold-400 font-bold">Section 14 Compliant</span>
          </div>

          <div className="space-y-2">
            {hierarchy.map((item, idx) => (
              <div
                key={item.documentType}
                className="flex items-center justify-between p-3.5 rounded-lg bg-coal-950 border border-coal-800 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-coal-800 border border-coal-700 font-mono text-xs font-bold text-gold-400 flex items-center justify-center">
                    {item.rank}
                  </span>
                  <div>
                    <h4 className="font-bold text-coal-100">{item.documentType}</h4>
                    <p className="text-[11px] text-coal-400">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Reliability Weight: {item.reliabilityScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
