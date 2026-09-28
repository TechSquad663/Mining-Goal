import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Table, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Download,
  Search,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { DocumentItem, ExtractedEntity, ExtractedTable, EvidenceCitation } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { EvidenceModal } from '../components/common/EvidenceModal';

export const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [document, setDocument] = useState<DocumentItem | null>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [activeTab, setActiveTab] = useState<'entities' | 'tables' | 'metadata' | 'validation'>('entities');
  const [entityCategory, setEntityCategory] = useState<'All' | 'Geological' | 'Mining' | 'Production' | 'Administrative'>('All');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceCitation | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getDocumentById(id).then(res => {
      setDocument(res.document);
      setPages(res.pages || []);
    }).catch(console.error);
  }, [id]);

  if (!document) {
    return (
      <div className="py-20 text-center text-coal-400 text-xs flex items-center justify-center gap-2">
        <div className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        Loading document intelligence from archive...
      </div>
    );
  }

  // Sample or extracted entities
  const entities: ExtractedEntity[] = document.entities || [
    {
      id: 'ent-1',
      category: 'Production',
      name: 'Annual Raw Coal Output',
      value: '59.20 MT',
      unit: 'MT',
      confidence: 0.992,
      page: 1,
      contextSnippet: 'Total gross coal output certified at 59.20 MT for the financial year.'
    },
    {
      id: 'ent-2',
      category: 'Mining',
      name: 'Composite Stripping Ratio',
      value: '1.32',
      unit: 'M.Cu.M/Tonne',
      confidence: 0.985,
      page: 2,
      contextSnippet: 'Stripping ratio maintained at 1.32 M.Cu.M/Tonne with 78.4 M.Cu.M overburden removal.'
    },
    {
      id: 'ent-3',
      category: 'Geological',
      name: 'In-Situ Proven Reserve',
      value: '950 MT',
      unit: 'MT',
      confidence: 0.988,
      page: 3,
      contextSnippet: 'Evaluated proven extractable coal reserve across Upper and Lower seams stands at 950 MT.'
    },
    {
      id: 'ent-4',
      category: 'Administrative',
      name: 'DPR Approval Reference',
      value: 'CMPDI/RI-V/BIL/2023/DPR-70M',
      confidence: 0.970,
      page: 1,
      contextSnippet: 'Formal Detailed Project Report approved under reference CMPDI/RI-V/BIL/2023/DPR-70M.'
    }
  ];

  // Sample or extracted tables
  const tables: ExtractedTable[] = document.tables || [
    {
      id: 'tbl-1',
      title: 'Seam-wise Geological Reserves & GCV Grade Analysis',
      page: 2,
      headers: ['Seam Horizon', 'Thickness (m)', 'Reserve (MT)', 'Coal Grade', 'Ash %'],
      rows: [
        ['Upper Kusmunda', '22.4', '420.0', 'G11', '37.4%'],
        ['Lower Kusmunda', '26.8', '530.0', 'G11-G12', '39.1%'],
        ['Composite Total', '49.2', '950.0', 'G11', '38.2%']
      ],
      confidence: 0.984
    },
    {
      id: 'tbl-2',
      title: 'Monthly Form IV Output & Dispatch Reconciliation',
      page: 4,
      headers: ['Quarter', 'Production (MT)', 'Dispatch (MT)', 'Target (MT)', 'Variance %'],
      rows: [
        ['Q1 (Apr - Jun)', '14.2', '13.8', '14.0', '+1.4%'],
        ['Q2 (Jul - Sep)', '11.8', '11.5', '12.0', '-1.7%'],
        ['Q3 (Oct - Dec)', '15.6', '15.2', '15.0', '+4.0%'],
        ['Q4 (Jan - Mar)', '17.6', '17.2', '17.0', '+3.5%']
      ],
      confidence: 0.991
    }
  ];

  const filteredEntities = entityCategory === 'All' 
    ? entities 
    : entities.filter(e => e.category === entityCategory);

  const handleOpenEvidence = (entity: ExtractedEntity) => {
    setSelectedEvidence({
      id: `ev-${entity.id}`,
      documentId: document.id,
      documentName: document.fileName,
      documentType: document.documentType,
      subsidiary: document.subsidiary,
      mine: document.mine,
      page: entity.page,
      section: `Extracted ${entity.category} Field: ${entity.name}`,
      rawText: entity.contextSnippet,
      confidence: entity.confidence,
      validationStatus: 'VERIFIED'
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Breadcrumb & Metadata Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-coal-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/documents')}
            className="p-1.5 rounded-lg bg-coal-800 hover:bg-coal-750 text-coal-300 hover:text-coal-100 border border-coal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-gold-400">{document.subsidiary}</span>
              {document.mine && <span className="text-xs text-coal-400">• {document.mine}</span>}
              <span className="text-xs text-coal-400">• FY {document.financialYear}</span>
            </div>
            <h1 className="text-lg font-bold text-coal-100 truncate max-w-xl">
              {document.fileName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <StatusBadge status={document.validationStatus} />
          <button
            onClick={() => alert('Download initiated for certified CMPDI archival scan.')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-coal-800 hover:bg-coal-750 text-xs font-semibold text-coal-200 border border-coal-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Source
          </button>
        </div>
      </div>

      {/* Split Screen Interface (Section 10) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
        {/* LEFT PANE: Document Preview Simulation (7 Cols) */}
        <div className="lg:col-span-7 bg-coal-900 border border-coal-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
          {/* Document Viewer Toolbar */}
          <div className="p-3 bg-coal-850 border-b border-coal-800 flex items-center justify-between text-xs">
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1 rounded bg-coal-800 text-coal-300 hover:text-coal-100 disabled:opacity-30 border border-coal-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-coal-200 text-xs">
                Page <span className="text-gold-400 font-bold">{currentPage}</span> of {document.pageCount}
              </span>
              <button
                disabled={currentPage >= document.pageCount}
                onClick={() => setCurrentPage(p => Math.min(document.pageCount, p + 1))}
                className="p-1 rounded bg-coal-800 text-coal-300 hover:text-coal-100 disabled:opacity-30 border border-coal-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(z => Math.max(60, z - 15))}
                className="p-1 rounded bg-coal-800 text-coal-300 hover:text-coal-100 border border-coal-700"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-[11px] text-coal-400 w-10 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(z => Math.min(150, z + 15))}
                className="p-1 rounded bg-coal-800 text-coal-300 hover:text-coal-100 border border-coal-700"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Document Page Canvas */}
          <div className="flex-1 overflow-auto p-6 bg-coal-950 flex items-center justify-center">
            <div 
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
              className="w-[500px] min-h-[660px] bg-coal-900 border border-coal-750 rounded-lg p-8 shadow-2xl relative select-text transition-transform duration-150 space-y-4"
            >
              {/* Header Stamp */}
              <div className="border-b border-coal-700 pb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-coal-100 uppercase tracking-wider">
                    {document.subsidiary} — STATUTORY OPERATIONAL RECORD
                  </h3>
                  <p className="text-[10px] text-coal-400 font-mono mt-0.5">
                    CMPDI REGIONAL REPOSITORY • FILE REF: {document.id.toUpperCase()}
                  </p>
                </div>
                <div className="px-2 py-0.5 rounded border border-emerald-700 bg-emerald-950 text-[9px] text-emerald-400 font-mono">
                  CCO VERIFIED
                </div>
              </div>

              {/* Simulated Page Content */}
              <div className="space-y-3 text-xs leading-relaxed text-coal-200">
                <p className="font-bold text-coal-100 text-sm">
                  Section {currentPage}: Geological Characterization & Mine Production Return
                </p>
                <p className="text-coal-300">
                  This document constitutes the official reconciliation for <strong className="text-coal-100">{document.mine || document.subsidiary}</strong> during financial year <strong className="text-coal-100">{document.financialYear}</strong>. All data points are compiled under Coal Controller guidelines.
                </p>

                {/* Highlighted Bounding Box Span on Page */}
                <div className="border-2 border-gold-500 bg-gold-500/10 p-3 rounded-lg relative my-4 group">
                  <div className="absolute -top-2.5 right-2 px-1.5 py-0.2 rounded bg-gold-600 text-coal-950 text-[9px] font-bold uppercase font-mono">
                    OCR Span [Conf: 99.2%]
                  </div>
                  <p className="font-mono text-xs text-gold-300">
                    "Annual Gross Pithead Production certified at 59.20 MT with overburden extraction of 78.4 M.Cu.M, achieving stripping ratio of 1.32."
                  </p>
                </div>

                <p className="text-coal-400 text-xs">
                  Borehole evaluations executed by CMPDI confirmed persistent thickness across primary seams with minimal fault displacements in Block IV.
                </p>

                {/* Mini Extracted Table Preview */}
                <div className="border border-coal-800 rounded bg-coal-950 p-2.5 text-[11px] font-mono mt-4">
                  <p className="font-bold text-coal-300 text-xs mb-1">Key Extract Table:</p>
                  <div className="grid grid-cols-3 gap-2 border-t border-coal-800 pt-1 text-coal-400">
                    <div>Horizon: Upper Seam</div>
                    <div>Thickness: 22.4m</div>
                    <div>Reserve: 420 MT</div>
                  </div>
                </div>
              </div>

              {/* Watermark / Footer */}
              <div className="absolute bottom-4 inset-x-8 border-t border-coal-800 pt-2 flex items-center justify-between text-[10px] text-coal-400 font-mono">
                <span>CONFIDENTIALITY: {document.confidentiality}</span>
                <span>Page {currentPage} of {document.pageCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Extracted Intelligence & Evidence (5 Cols) */}
        <div className="lg:col-span-5 bg-coal-900 border border-coal-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
          {/* Navigation Tabs */}
          <div className="flex border-b border-coal-800 bg-coal-850">
            <button
              onClick={() => setActiveTab('entities')}
              className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                activeTab === 'entities'
                  ? 'border-gold-500 text-gold-400 bg-coal-900'
                  : 'border-transparent text-coal-400 hover:text-coal-200'
              }`}
            >
              Extracted Entities ({entities.length})
            </button>
            <button
              onClick={() => setActiveTab('tables')}
              className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                activeTab === 'tables'
                  ? 'border-gold-500 text-gold-400 bg-coal-900'
                  : 'border-transparent text-coal-400 hover:text-coal-200'
              }`}
            >
              Tables ({tables.length})
            </button>
            <button
              onClick={() => setActiveTab('metadata')}
              className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
                activeTab === 'metadata'
                  ? 'border-gold-500 text-gold-400 bg-coal-900'
                  : 'border-transparent text-coal-400 hover:text-coal-200'
              }`}
            >
              Metadata
            </button>
          </div>

          {/* Tab 1: Extracted Entities */}
          {activeTab === 'entities' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                {['All', 'Production', 'Mining', 'Geological', 'Administrative'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setEntityCategory(cat as any)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      entityCategory === cat
                        ? 'bg-gold-500 text-coal-950 font-bold'
                        : 'bg-coal-800 text-coal-300 hover:bg-coal-750'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Entity Cards */}
              <div className="space-y-2.5">
                {filteredEntities.map(entity => (
                  <div 
                    key={entity.id}
                    className="p-3.5 rounded-lg bg-coal-950 border border-coal-800 hover:border-coal-700 transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-coal-400">
                          {entity.category}
                        </span>
                        <h4 className="text-xs font-bold text-coal-100 group-hover:text-gold-400 transition-colors">
                          {entity.name}
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
                        {entity.value}
                      </span>
                    </div>

                    <p className="text-[11px] text-coal-300 font-mono bg-coal-900/60 p-2 rounded border border-coal-850">
                      "{entity.contextSnippet}"
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="font-mono text-emerald-400">
                        Conf: {(entity.confidence * 100).toFixed(1)}% • Pg {entity.page}
                      </span>
                      {/* VIEW EVIDENCE BUTTON (Section 10) */}
                      <button
                        onClick={() => handleOpenEvidence(entity)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-gold-400 hover:text-gold-300 transition-colors"
                      >
                        View Evidence
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Extracted Tables */}
          {activeTab === 'tables' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {tables.map(table => (
                <div key={table.id} className="p-3.5 rounded-lg bg-coal-950 border border-coal-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-coal-100">{table.title}</h4>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {(table.confidence * 100).toFixed(1)}% Conf
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] font-mono">
                      <thead>
                        <tr className="border-b border-coal-800 bg-coal-900 text-coal-400">
                          {table.headers.map((h, i) => (
                            <th key={i} className="p-2">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-coal-850 text-coal-200">
                        {table.rows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-coal-900/60">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-2">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Document Metadata */}
          {activeTab === 'metadata' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-coal-950 border border-coal-800">
                  <span className="text-[10px] uppercase font-bold text-coal-400">File Size</span>
                  <p className="font-mono text-coal-100 mt-0.5">
                    {(document.fileSize / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-coal-950 border border-coal-800">
                  <span className="text-[10px] uppercase font-bold text-coal-400">Format</span>
                  <p className="font-mono text-coal-100 mt-0.5">{document.fileFormat}</p>
                </div>
                <div className="p-3 rounded-lg bg-coal-950 border border-coal-800">
                  <span className="text-[10px] uppercase font-bold text-coal-400">Uploaded By</span>
                  <p className="text-coal-100 mt-0.5">{document.uploadedBy}</p>
                </div>
                <div className="p-3 rounded-lg bg-coal-950 border border-coal-800">
                  <span className="text-[10px] uppercase font-bold text-coal-400">Upload Date</span>
                  <p className="font-mono text-coal-100 mt-0.5">
                    {new Date(document.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-coal-400 block mb-1">
                  Summary
                </span>
                <p className="p-3 rounded-lg bg-coal-950 border border-coal-800 text-coal-300 leading-relaxed">
                  {document.summary}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-coal-400 block mb-1">
                  Taxonomy Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {document.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-coal-950 border border-coal-800 text-coal-300 text-[11px] font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Traceable Evidence Modal */}
      <EvidenceModal
        evidence={selectedEvidence}
        isOpen={Boolean(selectedEvidence)}
        onClose={() => setSelectedEvidence(null)}
      />
    </div>
  );
};
