export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'ANALYST' | 'OFFICER' | 'AUDITOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  subsidiary: string;
  avatarUrl?: string;
}

export type DocumentType = 
  | 'Annual Report'
  | 'Geological Report'
  | 'Form IV Production Return'
  | 'Parliamentary Question'
  | 'Mine Plan'
  | 'Safety Audit'
  | 'Environmental Clearance'
  | 'Board Resolution'
  | 'Cost & Financial Statement';

export type IngestionStatus = 
  | 'UPLOADED'
  | 'CLASSIFYING'
  | 'OCR_PROCESSING'
  | 'TEXT_EXTRACTION'
  | 'TABLE_DETECTION'
  | 'ENTITY_EXTRACTION'
  | 'VALIDATION'
  | 'INDEXED'
  | 'FAILED';

export interface BoundingBox {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ExtractedEntity {
  id: string;
  category: 'Geological' | 'Mining' | 'Production' | 'Administrative';
  name: string;
  value: string | number;
  unit?: string;
  confidence: number;
  page: number;
  boundingBox?: BoundingBox;
  contextSnippet: string;
}

export interface ExtractedTable {
  id: string;
  title: string;
  page: number;
  headers: string[];
  rows: (string | number)[][];
  confidence: number;
}

export interface DocumentItem {
  id: string;
  fileName: string;
  fileSize: number;
  fileFormat: string;
  documentType: DocumentType;
  subsidiary: string;
  mine?: string;
  region?: string;
  department?: string;
  financialYear: string;
  confidentiality: 'PUBLIC' | 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET';
  tags: string[];
  uploadDate: string;
  uploadedBy: string;
  status: IngestionStatus;
  processingProgress: number;
  pageCount: number;
  extractedEntitiesCount: number;
  validationStatus: 'VERIFIED' | 'CONFLICT_DETECTED' | 'PENDING_REVIEW' | 'FLAGGED';
  summary?: string;
  entities?: ExtractedEntity[];
  tables?: ExtractedTable[];
}

export interface ProductionMetric {
  id: string;
  metric: string;
  value: number;
  unit: string;
  financialYear: string;
  subsidiary: string;
  mine: string;
  target?: number;
  achievementPercentage?: number;
  sourceDocumentId: string;
  sourceDocumentName: string;
  page: number;
  confidence: number;
  validationStatus: 'VERIFIED' | 'FLAGGED' | 'DISPUTED';
  extractedAt: string;
}

export interface ValidationIssue {
  id: string;
  metric: string;
  financialYear: string;
  subsidiary: string;
  mine: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  status: 'PENDING' | 'RESOLVED' | 'IGNORED';
  conflictDescription: string;
  sources: {
    sourceId: string;
    documentId: string;
    documentName: string;
    documentType: DocumentType;
    page: number;
    value: number | string;
    unit?: string;
    reliabilityScore: number;
    publishDate: string;
    snippet: string;
    isAuthoritative?: boolean;
  }[];
  resolution?: {
    acceptedValue: number | string;
    acceptedSourceId: string;
    resolvedBy: string;
    resolvedAt: string;
    rationale: string;
  };
}

export interface SourceReliabilityRank {
  rank: number;
  documentType: DocumentType;
  reliabilityScore: number;
  description: string;
}

export interface EvidenceCitation {
  id: string;
  documentId: string;
  documentName: string;
  documentType: string;
  subsidiary: string;
  mine?: string;
  page: number;
  section: string;
  rawText: string;
  confidence: number;
  boundingBox?: BoundingBox;
  validationStatus: 'VERIFIED' | 'UNVERIFIED';
}

export interface AIQueryHistory {
  id: string;
  query: string;
  answer: string;
  timestamp: string;
  user: string;
  responseTimeMs: number;
  confidence: number;
  evidenceCount: number;
  evidence: EvidenceCitation[];
  dataStatus: 'VERIFIED' | 'CAUTION' | 'INSUFFICIENT_EVIDENCE';
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

export type ReportType = 
  | 'Parliamentary Response'
  | 'Production Report'
  | 'Annual Report Analysis'
  | 'Geological Report'
  | 'Mining Performance Report'
  | 'Custom Report';

export type ReportStatus = 
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'ARCHIVED';

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  charts?: any;
  tables?: any;
  sourcesUsed: string[];
}

export interface ReportItem {
  id: string;
  title: string;
  type: ReportType;
  referenceNumber: string;
  status: ReportStatus;
  createdAt: string;
  generatedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  subsidiary: string;
  mine?: string;
  timePeriod: string;
  evidenceCoverage: number;
  verifiedRecordsPercentage: number;
  sourcesCount: number;
  sections: ReportSection[];
  comments: {
    id: string;
    user: string;
    role: UserRole;
    text: string;
    timestamp: string;
  }[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  targetEntity: string;
  documentName?: string;
  previousValue?: string;
  newValue?: string;
  rationale?: string;
  ipAddress: string;
  sessionToken: string;
}

export interface TopicItem {
  id: string;
  name: string;
  frequency: number;
  percentage: number;
  category: 'Operations' | 'Environment' | 'Safety' | 'Technology' | 'Geology';
  evolution: {
    period: '2010-2015' | '2016-2020' | '2021-2026';
    intensity: number;
  }[];
  relatedTerms: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  timestamp: string;
  read: boolean;
  link?: string;
}
