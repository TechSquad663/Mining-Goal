import { 
  DocumentItem, 
  AIQueryHistory, 
  ReportItem, 
  ValidationIssue, 
  SourceReliabilityRank, 
  AuditLogItem, 
  TopicItem, 
  User, 
  NotificationItem, 
  ReportType, 
  ReportStatus 
} from '../types';

const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
export const API_BASE = BASE_URL ? `${BASE_URL}/api` : '/api';

export const api = {
  // Users
  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`);
    const data = await res.json();
    return data.users || [];
  },

  // Auth
  async getCurrentUser(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`);
    const data = await res.json();
    return data.user;
  },

  async login(role?: string, email?: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, email }),
    });
    return res.json();
  },

  // Health
  async getSystemHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch(`${API_BASE}/notifications`);
    const data = await res.json();
    return data.notifications || [];
  },

  async markNotificationRead(id: string) {
    await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'POST' });
  },

  // Documents
  async getDocuments(params?: {
    subsidiary?: string;
    mine?: string;
    documentType?: string;
    search?: string;
    year?: string;
    status?: string;
  }): Promise<{ total: number; documents: DocumentItem[] }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v) query.append(k, v);
      });
    }
    const res = await fetch(`${API_BASE}/documents?${query.toString()}`);
    return res.json();
  },

  async getDocumentById(id: string): Promise<{ document: DocumentItem; pages: any[] }> {
    const res = await fetch(`${API_BASE}/documents/${id}`);
    return res.json();
  },

  async uploadDocument(formData: FormData): Promise<{ document: DocumentItem; message: string }> {
    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  // AI Intelligence
  async askAi(query: string): Promise<{ success: boolean; data: AIQueryHistory }> {
    const res = await fetch(`${API_BASE}/ai/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    return res.json();
  },

  async getAiHistory(): Promise<AIQueryHistory[]> {
    const res = await fetch(`${API_BASE}/ai/history`);
    const data = await res.json();
    return data.history || [];
  },

  async getAiSuggestions(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/ai/suggestions`);
    const data = await res.json();
    return data.suggestions || [];
  },

  // Reports
  async getReports(): Promise<ReportItem[]> {
    const res = await fetch(`${API_BASE}/reports`);
    const data = await res.json();
    return data.reports || [];
  },

  async getReportById(id: string): Promise<ReportItem> {
    const res = await fetch(`${API_BASE}/reports/${id}`);
    const data = await res.json();
    return data.report;
  },

  async generateReport(payload: {
    title: string;
    type: ReportType;
    subsidiary: string;
    mine?: string;
    timePeriod: string;
    metrics: string[];
  }): Promise<{ success: boolean; report: ReportItem }> {
    const res = await fetch(`${API_BASE}/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async updateReportStatus(id: string, status: ReportStatus, comment?: string): Promise<ReportItem> {
    const res = await fetch(`${API_BASE}/reports/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, comment }),
    });
    const data = await res.json();
    return data.report;
  },

  async exportReport(id: string, format: string = 'pdf'): Promise<{ downloadUrl: string; message: string }> {
    const res = await fetch(`${API_BASE}/reports/${id}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format }),
    });
    return res.json();
  },

  // Validation
  async getValidationIssues(): Promise<ValidationIssue[]> {
    const res = await fetch(`${API_BASE}/validation/issues`);
    const data = await res.json();
    return data.issues || [];
  },

  async resolveValidationIssue(payload: {
    issueId: string;
    acceptedSourceId: string;
    acceptedValue: number | string;
    rationale: string;
  }): Promise<{ success: boolean; issue: ValidationIssue }> {
    const res = await fetch(`${API_BASE}/validation/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getSourceHierarchy(): Promise<SourceReliabilityRank[]> {
    const res = await fetch(`${API_BASE}/validation/hierarchy`);
    const data = await res.json();
    return data.hierarchy || [];
  },

  async updateSourceHierarchy(hierarchy: SourceReliabilityRank[]) {
    const res = await fetch(`${API_BASE}/validation/hierarchy`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hierarchy }),
    });
    return res.json();
  },

  // Analytics
  async getProductionTrends(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/analytics/production-trends`);
    const data = await res.json();
    return data.data || [];
  },

  async getMines(subsidiary?: string): Promise<any[]> {
    const url = subsidiary ? `${API_BASE}/analytics/mines?subsidiary=${subsidiary}` : `${API_BASE}/analytics/mines`;
    const res = await fetch(url);
    const data = await res.json();
    return data.mines || [];
  },

  async getAnomalies(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/analytics/anomalies`);
    const data = await res.json();
    return data.anomalies || [];
  },

  // Topics
  async getTopics(): Promise<{ topics: TopicItem[]; evolutionTimeline: any[] }> {
    const res = await fetch(`${API_BASE}/topics`);
    return res.json();
  },

  // Knowledge & Lineage
  async getKnowledgeGraph(): Promise<{ nodes: any[]; edges: any[] }> {
    const res = await fetch(`${API_BASE}/knowledge/graph`);
    return res.json();
  },

  async getDataLineage(id?: string): Promise<{ lineage: any }> {
    const res = await fetch(`${API_BASE}/knowledge/lineage${id ? `/${id}` : ''}`);
    return res.json();
  },

  // Audit
  async getAuditLogs(params?: { user?: string; action?: string; search?: string }): Promise<AuditLogItem[]> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v) query.append(k, v);
      });
    }
    const res = await fetch(`${API_BASE}/audit?${query.toString()}`);
    const data = await res.json();
    return data.logs || [];
  },

  // Global Search
  async search(q: string) {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`);
    return res.json();
  },
};
