import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Files, 
  Upload, 
  Search, 
  Filter, 
  FileText, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Eye, 
  X,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { DocumentItem, DocumentType } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';

export const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subsidiary, setSubsidiary] = useState('All Subsidiaries');
  const [docType, setDocType] = useState('All Types');
  const [status, setStatus] = useState('All Statuses');

  // Upload Modal State
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Upload Form Metadata
  const [docName, setDocName] = useState('');
  const [selectedType, setSelectedType] = useState<DocumentType>('Annual Report');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('SECL');
  const [selectedMine, setSelectedMine] = useState('Gevra OCP');
  const [selectedYear, setSelectedYear] = useState('2023-24');
  const [confidentiality, setConfidentiality] = useState('RESTRICTED');
  const [tags, setTags] = useState('Statutory, OCR, CMPDI');

  const loadDocuments = () => {
    setLoading(true);
    api.getDocuments({
      search: search.trim() || undefined,
      subsidiary: subsidiary !== 'All Subsidiaries' ? subsidiary : undefined,
      documentType: docType !== 'All Types' ? docType : undefined,
      status: status !== 'All Statuses' ? status : undefined,
    }).then(res => {
      setDocuments(res.documents || []);
      setLoading(false);
    }).catch(console.error);
  };

  useEffect(() => {
    loadDocuments();
  }, [subsidiary, docType, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDocuments();
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress(15);
    setCurrentStage('Classifying Document Type & Metadata...');

    // Simulate pipeline stage progression
    setTimeout(() => {
      setUploadProgress(35);
      setCurrentStage('OCR Processing & Tesseract Engine...');
    }, 600);

    setTimeout(() => {
      setUploadProgress(55);
      setCurrentStage('Extracting Text & Spatial Bounding Boxes...');
    }, 1200);

    setTimeout(() => {
      setUploadProgress(75);
      setCurrentStage('Detecting Tabular Formats & Form IV Columns...');
    }, 1800);

    setTimeout(() => {
      setUploadProgress(85);
      setCurrentStage('Extracting Geological & Production Entities...');
    }, 2400);

    setTimeout(async () => {
      setUploadProgress(95);
      setCurrentStage('Validating Cross-Source Discrepancies...');

      const formData = new FormData();
      if (uploadFile) formData.append('file', uploadFile);
      formData.append('fileName', docName || (uploadFile ? uploadFile.name : 'Uploaded_Mine_Record.pdf'));
      formData.append('documentType', selectedType);
      formData.append('subsidiary', selectedSubsidiary);
      formData.append('mine', selectedMine);
      formData.append('financialYear', selectedYear);
      formData.append('confidentiality', confidentiality);
      formData.append('tags', tags);

      try {
        await api.uploadDocument(formData);
        setUploadProgress(100);
        setCurrentStage('Indexed into Knowledge Base!');
        setUploadSuccess(true);
        loadDocuments();
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    }, 3000);
  };

  const handleCloseUploadModal = () => {
    setUploadOpen(false);
    setUploadSuccess(false);
    setUploadProgress(0);
    setUploadFile(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-coal-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-widest">
              Digital Document Repository
            </span>
            <span className="text-coal-400">•</span>
            <span className="text-xs text-coal-400 font-mono">128,452 Records</span>
          </div>
          <h1 className="text-2xl font-extrabold text-coal-50 mt-1">
            Document Intelligence Center
          </h1>
          <p className="text-xs text-coal-400 mt-1">
            Statutory annual reports, Form IV monthly reconciliations, CMPDI geological appraisals, and safety audits.
          </p>
        </div>

        <button
          onClick={() => setUploadOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-600 hover:bg-gold-500 text-coal-950 text-xs font-bold transition-colors shadow-sm self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          Upload & Ingest Document
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-coal-900 border border-coal-800 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-coal-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search document name, summary, tags, or geological seam..."
              className="w-full pl-9 pr-4 py-2 bg-coal-950 border border-coal-800 rounded-lg text-xs text-coal-100 placeholder-coal-400 focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-coal-800 hover:bg-coal-750 text-xs font-semibold text-coal-200 border border-coal-700 transition-colors"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-coal-400 block mb-1">
              Subsidiary
            </label>
            <select
              value={subsidiary}
              onChange={(e) => setSubsidiary(e.target.value)}
              className="w-full p-2 bg-coal-950 border border-coal-800 rounded-lg text-xs text-coal-200 focus:outline-none"
            >
              <option>All Subsidiaries</option>
              <option>Coal India Ltd (CIL)</option>
              <option>SECL</option>
              <option>MCL</option>
              <option>NCL</option>
              <option>CCL</option>
              <option>BCCL</option>
              <option>WCL</option>
              <option>CMPDI HQ Ranchi</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-coal-400 block mb-1">
              Document Category
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full p-2 bg-coal-950 border border-coal-800 rounded-lg text-xs text-coal-200 focus:outline-none"
            >
              <option>All Types</option>
              <option>Annual Report</option>
              <option>Geological Report</option>
              <option>Form IV Production Return</option>
              <option>Parliamentary Question</option>
              <option>Mine Plan</option>
              <option>Safety Audit</option>
              <option>Environmental Clearance</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-coal-400 block mb-1">
              Validation Integrity
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 bg-coal-950 border border-coal-800 rounded-lg text-xs text-coal-200 focus:outline-none"
            >
              <option>All Statuses</option>
              <option>VERIFIED</option>
              <option>CONFLICT_DETECTED</option>
              <option>PENDING_REVIEW</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document Inventory Table */}
      <div className="bg-coal-900 border border-coal-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-coal-850 border-b border-coal-800 flex items-center justify-between text-xs font-bold text-coal-300">
          <span>Displaying {documents.length} Repositories</span>
          <span className="font-mono text-coal-400 text-[11px]">Audit Compliant CCO / MoC</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-coal-800 bg-coal-950/60 text-[10px] uppercase font-bold tracking-wider text-coal-400">
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Subsidiary / Mine</th>
                <th className="py-3 px-4">Fiscal Year</th>
                <th className="py-3 px-4">Pages / Entities</th>
                <th className="py-3 px-4">Validation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coal-800/80 text-xs text-coal-200 font-sans">
              {documents.map((doc) => (
                <tr 
                  key={doc.id}
                  className="hover:bg-coal-850/60 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/documents/${doc.id}`)}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-coal-800 border border-coal-700 text-gold-400 flex-shrink-0">
                        {doc.fileFormat === 'XLSX' || doc.fileFormat === 'CSV' ? (
                          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <FileText className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <div className="min-w-0 max-w-md">
                        <p className="font-bold text-coal-100 group-hover:text-gold-400 transition-colors truncate">
                          {doc.fileName}
                        </p>
                        <p className="text-[11px] text-coal-400 truncate mt-0.5">
                          {doc.summary || 'Uploaded archival document'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-coal-300">
                    {doc.documentType}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-coal-200">{doc.subsidiary}</p>
                    {doc.mine && (
                      <span className="text-[11px] text-coal-400 font-mono">{doc.mine}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-coal-300">
                    {doc.financialYear}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <span className="text-coal-200">{doc.pageCount} pgs</span> •{' '}
                    <span className="text-gold-400 font-bold">{doc.extractedEntitiesCount} entities</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={doc.validationStatus} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/documents/${doc.id}`);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-coal-800 hover:bg-coal-750 text-coal-200 text-xs font-semibold border border-coal-700 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-gold-400" />
                      View Split
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7-Step Ingestion & Drag-and-Drop Upload Modal (Section 9) */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-coal-900 border border-coal-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-coal-850 border-b border-coal-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-coal-100 uppercase tracking-wider">
                    Document Digitization & Ingestion Pipeline
                  </h3>
                  <p className="text-xs text-coal-400">
                    Automatic OCR, table parsing, entity extraction, and validation
                  </p>
                </div>
              </div>
              <button onClick={handleCloseUploadModal} className="text-coal-400 hover:text-coal-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFileUpload} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {!uploadSuccess ? (
                <>
                  {/* Drag and Drop Box */}
                  <div className="border-2 border-dashed border-coal-700 hover:border-gold-500/60 rounded-xl p-6 text-center bg-coal-950/60 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadFile(e.target.files[0]);
                          setDocName(e.target.files[0].name);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-coal-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-coal-200">
                      {uploadFile ? uploadFile.name : 'Drag & Drop mining records here, or browse files'}
                    </p>
                    <p className="text-[10px] text-coal-400 mt-1">
                      Supported: PDF, DOC, DOCX, XLS, XLSX, CSV, TIFF, PNG (Up to 50MB)
                    </p>
                  </div>

                  {/* Metadata Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-coal-400 block mb-1">
                        Document Name
                      </label>
                      <input
                        type="text"
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        placeholder="e.g. SECL_Annual_Report_FY24.pdf"
                        className="w-full p-2 bg-coal-950 border border-coal-800 rounded-lg text-coal-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-coal-400 block mb-1">
                        Document Type
                      </label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as any)}
                        className="w-full p-2 bg-coal-950 border border-coal-800 rounded-lg text-coal-100"
                      >
                        <option>Annual Report</option>
                        <option>Geological Report</option>
                        <option>Form IV Production Return</option>
                        <option>Parliamentary Question</option>
                        <option>Mine Plan</option>
                        <option>Safety Audit</option>
                        <option>Environmental Clearance</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-coal-400 block mb-1">
                        Subsidiary
                      </label>
                      <select
                        value={selectedSubsidiary}
                        onChange={(e) => setSelectedSubsidiary(e.target.value)}
                        className="w-full p-2 bg-coal-950 border border-coal-800 rounded-lg text-coal-100"
                      >
                        <option>Coal India Ltd (CIL)</option>
                        <option>SECL</option>
                        <option>MCL</option>
                        <option>NCL</option>
                        <option>CCL</option>
                        <option>BCCL</option>
                        <option>WCL</option>
                        <option>ECL</option>
                        <option>CMPDI HQ Ranchi</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-coal-400 block mb-1">
                        Mine / Project
                      </label>
                      <input
                        type="text"
                        value={selectedMine}
                        onChange={(e) => setSelectedMine(e.target.value)}
                        placeholder="e.g. Gevra OCP, Kusmunda, Jayant"
                        className="w-full p-2 bg-coal-950 border border-coal-800 rounded-lg text-coal-100"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-coal-400 block mb-1">
                        Financial Year
                      </label>
                      <input
                        type="text"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full p-2 bg-coal-950 border border-coal-800 rounded-lg text-coal-100 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-coal-400 block mb-1">
                        Confidentiality
                      </label>
                      <select
                        value={confidentiality}
                        onChange={(e) => setConfidentiality(e.target.value)}
                        className="w-full p-2 bg-coal-950 border border-coal-800 rounded-lg text-coal-100 font-mono"
                      >
                        <option>PUBLIC</option>
                        <option>RESTRICTED</option>
                        <option>CONFIDENTIAL</option>
                        <option>SECRET</option>
                      </select>
                    </div>
                  </div>

                  {/* Visual 7-Step Progress Pipeline */}
                  {uploading && (
                    <div className="space-y-3 p-4 rounded-xl bg-coal-950 border border-coal-800">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gold-400 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
                          {currentStage}
                        </span>
                        <span className="font-mono text-coal-400">{uploadProgress}%</span>
                      </div>
                      <div className="h-2 w-full bg-coal-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gold-500 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-7 gap-1 pt-1 text-center text-[9px] font-mono text-coal-400">
                        {['Upload', 'Classify', 'OCR', 'Text', 'Tables', 'Entities', 'Indexed'].map((st, i) => (
                          <div 
                            key={st}
                            className={`p-1 rounded ${uploadProgress >= (i + 1) * 14 ? 'bg-gold-500/20 text-gold-300 font-bold' : 'bg-coal-900'}`}
                          >
                            {st}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseUploadModal}
                      className="px-4 py-2 rounded-lg bg-coal-800 hover:bg-coal-750 text-xs font-semibold text-coal-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="px-5 py-2 rounded-lg bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-coal-950 text-xs font-bold transition-colors"
                    >
                      {uploading ? 'Processing Pipeline...' : 'Start Pipeline Ingestion'}
                    </button>
                  </div>
                </>
              ) : (
                /* Success Screen */
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 mx-auto">
                    <FileCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-coal-100">
                      Document Successfully Ingested & Indexed
                    </h4>
                    <p className="text-xs text-coal-400 mt-1 max-w-md mx-auto">
                      All 7 stages of OCR, tabular detection, and entity extraction completed. 
                      Document is now queryable across the AI Intelligence Center.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseUploadModal}
                    className="px-6 py-2 rounded-lg bg-coal-800 hover:bg-coal-750 text-xs font-semibold text-coal-200 border border-coal-700"
                  >
                    Done & Return to Documents
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
