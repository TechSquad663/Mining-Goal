import { Router } from 'express';
import multer from 'multer';
import { db } from '../database/store.js';
import { ingestionPipeline } from '../services/document/pipeline.js';
import { DocumentItem, DocumentType } from '../types/index.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// GET all documents with faceted filters
router.get('/', (req, res) => {
  const { subsidiary, mine, documentType, search, year, status } = req.query;

  let filtered = [...db.documents];

  if (subsidiary && subsidiary !== 'All Subsidiaries') {
    filtered = filtered.filter(d => d.subsidiary.toLowerCase().includes(String(subsidiary).toLowerCase()));
  }

  if (mine && mine !== 'All Mines') {
    filtered = filtered.filter(d => d.mine?.toLowerCase().includes(String(mine).toLowerCase()));
  }

  if (documentType && documentType !== 'All Types') {
    filtered = filtered.filter(d => d.documentType === documentType);
  }

  if (year && year !== 'All Years') {
    filtered = filtered.filter(d => d.financialYear.includes(String(year)));
  }

  if (status && status !== 'All Statuses') {
    filtered = filtered.filter(d => d.validationStatus === status || d.status === status);
  }

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(d => 
      d.fileName.toLowerCase().includes(q) ||
      d.summary?.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json({
    success: true,
    total: filtered.length,
    documents: filtered
  });
});

// GET single document by ID
router.get('/:id', (req, res) => {
  const doc = db.documents.find(d => d.id === req.params.id);
  if (!doc) {
    res.status(404).json({ success: false, message: 'Document not found' });
    return;
  }

  // Provide mock pages if not yet populated
  const pages = Array.from({ length: Math.min(doc.pageCount, 12) }, (_, i) => ({
    pageNumber: i + 1,
    title: i === 0 ? 'Document Cover & Statutory Attestation' : `Section ${i}: Performance Analytics & Logs`,
    textSnippet: `Extract from ${doc.fileName} — Page ${i + 1}: Coal production and overburden operations validated by CMPDI regional surveyor. Cumulative verified output recorded with 98.4% data confidence level.`,
    hasTables: i === 1 || i === 3,
    hasEntities: true
  }));

  res.json({
    success: true,
    document: doc,
    pages
  });
});

// POST upload new document
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { 
      documentType = 'Annual Report', 
      subsidiary = 'Coal India Ltd (CIL)', 
      mine, 
      department = 'Technical Operations',
      financialYear = '2023-24', 
      confidentiality = 'RESTRICTED',
      tags = 'New Ingestion, OCR'
    } = req.body;

    const fileName = file ? file.originalname : req.body.fileName || `Document_Upload_${Date.now()}.pdf`;
    const fileSize = file ? file.size : 12450000;
    const fileFormat = fileName.split('.').pop()?.toUpperCase() || 'PDF';

    const newDoc: DocumentItem = {
      id: `doc-${Date.now().toString().slice(-4)}`,
      fileName,
      fileSize,
      fileFormat,
      documentType: documentType as DocumentType,
      subsidiary,
      mine: mine || undefined,
      department,
      financialYear,
      confidentiality: confidentiality as any,
      tags: typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags,
      uploadDate: new Date().toISOString(),
      uploadedBy: db.currentUser.name,
      status: 'UPLOADED',
      processingProgress: 15,
      pageCount: Math.floor(18 + Math.random() * 80),
      extractedEntitiesCount: 0,
      validationStatus: 'PENDING_REVIEW',
      summary: `Recently ingested document (${fileName}) undergoing automated OCR, table parsing, and entity extraction pipeline.`
    };

    db.documents.unshift(newDoc);

    db.addAuditLog({
      user: db.currentUser.name,
      role: db.currentUser.role,
      action: 'DOCUMENT_UPLOAD',
      targetEntity: `Document #${newDoc.id}`,
      documentName: newDoc.fileName,
      newValue: `Uploaded file (${fileFormat}, ${(fileSize / (1024 * 1024)).toFixed(1)} MB)`,
      rationale: 'Submitted to CoalIntelligence ingestion pipeline'
    });

    // Run ingestion pipeline
    await ingestionPipeline.processDocument(newDoc.id);

    res.status(201).json({
      success: true,
      document: newDoc,
      message: 'Document uploaded and successfully indexed through 7-step pipeline'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
