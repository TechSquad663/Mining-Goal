import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  ShieldCheck, 
  FileText, 
  Printer, 
  Share2,
  Clock
} from 'lucide-react';
import { api } from '../services/api';
import { ReportItem, ReportStatus } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<ReportItem | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  const loadReport = () => {
    if (!id) return;
    api.getReportById(id).then(setReport).catch(console.error);
  };

  useEffect(() => {
    loadReport();
  }, [id]);

  if (!report) {
    return (
      <div className="py-20 text-center text-coal-400 text-xs flex items-center justify-center gap-2">
        <div className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        Retrieving official report record...
      </div>
    );
  }

  const handleUpdateStatus = async (status: ReportStatus) => {
    setSubmittingAction(true);
    try {
      const updated = await api.updateReportStatus(report.id, status, newComment || undefined);
      setReport(updated);
      setNewComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'docx' | 'xlsx') => {
    const res = await api.exportReport(report.id, format);
    alert(`Success: ${res.message}\nReference File: ${res.downloadUrl}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-coal-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/reports')}
            className="p-1.5 rounded-lg bg-coal-800 hover:bg-coal-750 text-coal-300 hover:text-coal-100 border border-coal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-gold-400">{report.referenceNumber}</span>
              <span className="text-coal-400">•</span>
              <span className="text-xs text-coal-400">{report.type}</span>
            </div>
            <h1 className="text-xl font-bold text-coal-100">
              {report.title}
            </h1>
          </div>
        </div>

        {/* Action Controls & Export (Section 45) */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1 bg-coal-900 border border-coal-750 rounded-lg p-1">
            <button
              onClick={() => handleExport('pdf')}
              className="px-2.5 py-1 text-xs font-semibold rounded text-coal-300 hover:bg-coal-800 hover:text-gold-400 transition-colors"
            >
              PDF
            </button>
            <button
              onClick={() => handleExport('docx')}
              className="px-2.5 py-1 text-xs font-semibold rounded text-coal-300 hover:bg-coal-800 hover:text-gold-400 transition-colors"
            >
              DOCX
            </button>
            <button
              onClick={() => handleExport('xlsx')}
              className="px-2.5 py-1 text-xs font-semibold rounded text-coal-300 hover:bg-coal-800 hover:text-gold-400 transition-colors"
            >
              XLSX
            </button>
          </div>
          <button
            onClick={() => window.print()}
            className="p-2 rounded-lg bg-coal-800 hover:bg-coal-750 text-coal-300 border border-coal-700 transition-colors"
            title="Print Official Document"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Human-in-the-Loop Governance Bar (Section 22) */}
      <div className="p-4 rounded-xl bg-coal-900 border border-coal-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <StatusBadge status={report.status} size="md" />
          <div className="text-xs">
            <span className="text-coal-400">Current Workflow Stage: </span>
            <strong className="text-coal-200">
              {report.status === 'APPROVED' ? 'Approved by Reviewing Officer' : 'Awaiting Reviewer Sign-off'}
            </strong>
            {report.approvedBy && (
              <span className="text-[11px] font-mono text-emerald-400 block mt-0.5">
                Digitally Attested: {report.approvedBy} ({new Date(report.approvedAt!).toLocaleDateString()})
              </span>
            )}
          </div>
        </div>

        {/* Workflow Action Buttons */}
        <div className="flex items-center gap-2">
          {report.status !== 'APPROVED' && (
            <>
              <button
                disabled={submittingAction}
                onClick={() => handleUpdateStatus('CHANGES_REQUESTED')}
                className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800 text-xs font-semibold transition-colors"
              >
                Request Changes
              </button>
              <button
                disabled={submittingAction}
                onClick={() => handleUpdateStatus('APPROVED')}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approve & Sign Report
              </button>
            </>
          )}
          {report.status === 'APPROVED' && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-bold bg-emerald-950/40 border border-emerald-900 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              Official Signed Version
            </div>
          )}
        </div>
      </div>

      {/* Official CMPDI / Coal India Document Frame (Section 21) */}
      <div className="bg-coal-900 border border-coal-750 rounded-xl p-8 sm:p-12 shadow-2xl space-y-8 text-coal-200 leading-relaxed font-sans">
        {/* Official Header */}
        <div className="border-b-2 border-coal-700 pb-6 text-center space-y-2">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400">
            GOVERNMENT OF INDIA • MINISTRY OF COAL
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-coal-50 tracking-tight uppercase">
            CENTRAL MINE PLANNING & DESIGN INSTITUTE LIMITED
          </h2>
          <p className="text-xs text-coal-400 font-mono">
            ROND HILL, KANKE ROAD, RANCHI — 834 008, JHARKHAND
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 text-[11px] font-mono border-t border-coal-800 mt-4 text-left">
            <div>
              <span className="text-coal-400 block">REFERENCE NO.</span>
              <span className="font-bold text-coal-100">{report.referenceNumber}</span>
            </div>
            <div>
              <span className="text-coal-400 block">DATE GENERATED</span>
              <span className="text-coal-100">{new Date(report.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-coal-400 block">EVIDENCE COVERAGE</span>
              <span className="font-bold text-emerald-400">{report.evidenceCoverage}%</span>
            </div>
            <div>
              <span className="text-coal-400 block">VERIFIED SOURCES</span>
              <span className="text-gold-400 font-bold">{report.sourcesCount} Audited Docs</span>
            </div>
          </div>
        </div>

        {/* Report Sections Loop */}
        <div className="space-y-6">
          {report.sections.map((section, idx) => (
            <div key={section.id} className="space-y-2.5">
              <h3 className="text-sm font-bold text-coal-50 uppercase tracking-wide border-b border-coal-800 pb-1 flex items-center justify-between">
                <span>{section.title}</span>
                <span className="text-[10px] font-mono text-coal-400">Section 0{idx + 1}</span>
              </h3>
              <p className="text-xs sm:text-sm text-coal-300 leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Data Lineage & Quality Notice */}
        <div className="p-4 rounded-lg bg-coal-950 border border-coal-800 text-xs font-mono text-coal-400 space-y-1">
          <p className="font-bold text-coal-200">
            DIGITAL AUDIT & DATA LINEAGE ATTESTATION
          </p>
          <p>
            All statistical tables contained in this document have been cross-verified against Coal Controller statutory returns.
            Report compiled by <span className="text-gold-400">{report.generatedBy}</span> on {new Date(report.createdAt).toLocaleString()}.
          </p>
        </div>
      </div>

      {/* Reviewer Comments & Sign-off Thread */}
      <div className="p-6 rounded-xl bg-coal-900 border border-coal-800 space-y-4">
        <h3 className="text-xs font-bold text-coal-100 uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gold-400" />
          Reviewer Audit Comments ({report.comments.length})
        </h3>

        <div className="space-y-3">
          {report.comments.map(c => (
            <div key={c.id} className="p-3 rounded-lg bg-coal-950 border border-coal-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-coal-200">{c.user} ({c.role})</span>
                <span className="text-[10px] font-mono text-coal-400">
                  {new Date(c.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-coal-300">{c.text}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add reviewer notes or statutory remarks..."
            className="flex-1 p-2.5 bg-coal-950 border border-coal-800 rounded-lg text-xs text-coal-100"
          />
          <button
            onClick={() => handleUpdateStatus(report.status)}
            disabled={!newComment.trim()}
            className="px-4 py-2 rounded-lg bg-coal-800 hover:bg-coal-750 disabled:opacity-40 text-xs font-semibold text-coal-200 border border-coal-700"
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
};
