import { DocumentItem, IngestionStatus } from '../../types/index.js';
import { db } from '../../database/store.js';
import { MockOCRProvider } from '../ai/mockAiProvider.js';

export class IngestionPipeline {
  private ocrProvider = new MockOCRProvider();

  public async processDocument(docId: string): Promise<DocumentItem> {
    const doc = db.documents.find(d => d.id === docId);
    if (!doc) throw new Error(`Document ${docId} not found`);

    const stages: { status: IngestionStatus; progress: number }[] = [
      { status: 'CLASSIFYING', progress: 15 },
      { status: 'OCR_PROCESSING', progress: 35 },
      { status: 'TEXT_EXTRACTION', progress: 55 },
      { status: 'TABLE_DETECTION', progress: 75 },
      { status: 'ENTITY_EXTRACTION', progress: 85 },
      { status: 'VALIDATION', progress: 95 },
      { status: 'INDEXED', progress: 100 }
    ];

    // Simulate OCR & Entity extraction
    const ocrResult = await this.ocrProvider.processDocument(Buffer.from(''), 'application/pdf');

    doc.status = 'INDEXED';
    doc.processingProgress = 100;
    doc.extractedEntitiesCount = ocrResult.entities.length;
    doc.entities = ocrResult.entities;
    doc.tables = ocrResult.tables;
    doc.validationStatus = 'VERIFIED';

    db.addAuditLog({
      user: doc.uploadedBy,
      role: 'ANALYST',
      action: 'INGESTION_PIPELINE_COMPLETE',
      targetEntity: `Document #${doc.id}`,
      documentName: doc.fileName,
      previousValue: 'Status: UPLOADED',
      newValue: 'Status: INDEXED (Verified)',
      rationale: 'Completed 7-stage automated OCR and table extraction'
    });

    return doc;
  }
}

export const ingestionPipeline = new IngestionPipeline();
