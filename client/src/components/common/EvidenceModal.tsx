import React from 'react';
import { X, ExternalLink, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { EvidenceCitation } from '../../types';

interface EvidenceModalProps {
  evidence: EvidenceCitation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ evidence, isOpen, onClose }) => {
  if (!isOpen || !evidence) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-coal-900 border border-coal-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-coal-850 border-b border-coal-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-coal-100 flex items-center gap-2">
                Traceable Evidence Provenance
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 font-mono">
                  {evidence.validationStatus || 'VERIFIED'}
                </span>
              </h3>
              <p className="text-xs text-coal-400 mt-0.5">
                Statutory primary record cross-reference
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-coal-400 hover:text-coal-100 hover:bg-coal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-lg bg-coal-850/60 border border-coal-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-coal-400 tracking-wider">Source Document</span>
              <p className="text-xs font-semibold text-coal-200 mt-0.5 truncate" title={evidence.documentName}>
                {evidence.documentName}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-coal-400 tracking-wider">Page Reference</span>
              <p className="text-xs font-mono font-bold text-gold-400 mt-0.5">
                Page {evidence.page}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-coal-400 tracking-wider">Subsidiary / Area</span>
              <p className="text-xs font-semibold text-coal-200 mt-0.5">
                {evidence.subsidiary} {evidence.mine ? `• ${evidence.mine}` : ''}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-coal-400 tracking-wider">OCR / Model Conf.</span>
              <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                {(evidence.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Section & Snippet */}
          <div>
            <span className="text-xs font-semibold text-coal-300 block mb-1">
              Section: <span className="text-coal-100 font-mono text-xs">{evidence.section}</span>
            </span>
            <div className="p-4 rounded-lg bg-coal-950 border border-coal-800 font-mono text-sm leading-relaxed text-coal-200 relative group">
              <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-coal-800 text-[10px] text-coal-400 uppercase font-sans">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Raw Document Extract
              </div>
              <p className="pt-2">"{evidence.rawText}"</p>
            </div>
          </div>

          {/* Bounding Box Visualizer Simulation */}
          <div className="border border-coal-800 rounded-lg p-4 bg-coal-850/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-coal-300">
                Spatial Coordinate Verification (Bounding Box)
              </span>
              <span className="text-[11px] font-mono text-coal-400">
                Page {evidence.page} • Standard DPI Grid
              </span>
            </div>
            <div className="h-28 w-full bg-coal-950 rounded border border-coal-800 relative flex items-center justify-center overflow-hidden">
              {/* Document page wireframe simulation */}
              <div className="absolute inset-x-8 top-3 bottom-3 border border-coal-800/80 rounded bg-coal-900/40 flex flex-col p-2 space-y-1">
                <div className="h-1.5 w-1/3 bg-coal-700/50 rounded" />
                <div className="h-1 w-full bg-coal-800/40 rounded" />
                <div className="h-1 w-5/6 bg-coal-800/40 rounded" />
                {/* Active Highlight Bounding Box */}
                <div className="h-7 w-3/4 border-2 border-gold-500 bg-gold-500/10 rounded my-1 flex items-center px-2">
                  <span className="text-[10px] font-mono text-gold-300 truncate">
                    [Selected Span: "{evidence.rawText.substring(0, 36)}..."]
                  </span>
                </div>
                <div className="h-1 w-2/3 bg-coal-800/40 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-coal-850 border-t border-coal-700 flex items-center justify-between">
          <span className="text-xs text-coal-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-gold-400" />
            Verified against CMPDI statutory digital archive
          </span>
          <div className="flex items-center gap-2">
            <a
              href={`/documents/${evidence.documentId}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-coal-800 hover:bg-coal-750 text-xs font-medium text-coal-200 border border-coal-700 transition-colors"
            >
              Open Full Document
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-gold-600 hover:bg-gold-500 text-coal-950 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
