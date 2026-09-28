import { 
  EvidenceCitation, 
  ExtractedEntity, 
  ExtractedTable, 
  ReportSection 
} from '../../types/index.js';

export interface QueryIntent {
  type: 'NUMERICAL_COMPARISON' | 'TEMPORAL_TREND' | 'DOCUMENT_SEARCH' | 'SAFETY_PARLIAMENT' | 'GEOLOGICAL_RESERVE' | 'GENERAL';
  entities: string[];
  timeframe?: string;
  mines: string[];
  subsidiaries: string[];
  metrics: string[];
  requiresSqlCalculation: boolean;
}

export interface GeneratedAnswer {
  text: string;
  confidence: number;
  dataStatus: 'VERIFIED' | 'CAUTION' | 'INSUFFICIENT_EVIDENCE';
  evidence: EvidenceCitation[];
  chartData?: {
    type: 'bar' | 'line';
    title: string;
    xAxisKey: string;
    data: any[];
  };
  keyStats?: {
    label: string;
    value: string;
    delta?: string;
  }[];
  suggestedFollowUps: string[];
}

export interface LLMProvider {
  name: string;
  generateAnswer(query: string, intent: QueryIntent, evidence: EvidenceCitation[]): Promise<GeneratedAnswer>;
  classifyIntent(query: string): Promise<QueryIntent>;
  generateReportSection(title: string, prompt: string, evidence: EvidenceCitation[]): Promise<ReportSection>;
}

export interface EmbeddingProvider {
  name: string;
  generateEmbedding(text: string): Promise<number[]>;
}

export interface VectorSearchProvider {
  name: string;
  search(embedding: number[], topK: number, filters?: Record<string, any>): Promise<EvidenceCitation[]>;
}

export interface OCRProvider {
  name: string;
  processDocument(buffer: Buffer, mimeType: string): Promise<{
    pages: { pageNumber: number; text: string; confidence: number }[];
    entities: ExtractedEntity[];
    tables: ExtractedTable[];
  }>;
}

export interface DocumentParser {
  name: string;
  parse(buffer: Buffer, fileName: string): Promise<string>;
}
