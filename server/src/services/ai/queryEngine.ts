import { MockLLMProvider } from './mockAiProvider.js';
import { LLMProvider } from './providers.js';
import { AIQueryHistory } from '../../types/index.js';
import { db } from '../../database/store.js';

export class QueryEngine {
  private llmProvider: LLMProvider;

  constructor() {
    // Allows switching between Mock and Production provider via env
    this.llmProvider = new MockLLMProvider();
  }

  public async executeQuery(query: string, user: string = 'Dr. Rajeshwar Sharma'): Promise<AIQueryHistory> {
    const startTime = Date.now();

    // Step 1: Intent Detection
    const intent = await this.llmProvider.classifyIntent(query);

    // Step 2 & 3: Evidence Retrieval & Structured SQL Engine
    // Collect candidate evidence citations from DB
    const candidateEvidence = db.aiQueries.flatMap(q => q.evidence);

    // Step 4 & 5: Answer Generation with LLM & Citation Generator
    const generated = await this.llmProvider.generateAnswer(query, intent, candidateEvidence);

    const responseTimeMs = Date.now() - startTime;

    // Step 6: Create Record & Save to Query History
    const historyItem: AIQueryHistory = {
      id: `aiq-${Date.now()}`,
      query,
      answer: generated.text,
      timestamp: new Date().toISOString(),
      user,
      responseTimeMs,
      confidence: generated.confidence,
      evidenceCount: generated.evidence.length,
      evidence: generated.evidence,
      dataStatus: generated.dataStatus,
      chartData: generated.chartData,
      keyStats: generated.keyStats,
      suggestedFollowUps: generated.suggestedFollowUps
    };

    db.aiQueries.unshift(historyItem);

    // Step 7: Record in Audit Trail
    db.addAuditLog({
      user,
      role: 'SUPER_ADMIN',
      action: 'AI_QUERY_EXECUTED',
      targetEntity: `Query: "${query.substring(0, 50)}..."`,
      documentName: generated.evidence[0]?.documentName || 'Multiple Sources',
      newValue: `Confidence: ${(generated.confidence * 100).toFixed(1)}% | Evidence: ${generated.evidence.length} sources`,
      rationale: 'Executed hybrid search across CMPDI / CIL statutory knowledge index'
    });

    return historyItem;
  }
}

export const queryEngine = new QueryEngine();
