import { ValidationIssue } from '../../types/index.js';
import { db } from '../../database/store.js';

export class ConflictEngine {
  public getIssues(): ValidationIssue[] {
    return db.validationIssues;
  }

  public resolveIssue(issueId: string, acceptedSourceId: string, acceptedValue: number | string, user: string, rationale: string): ValidationIssue {
    const issue = db.validationIssues.find(i => i.id === issueId);
    if (!issue) throw new Error(`Validation issue ${issueId} not found`);

    issue.status = 'RESOLVED';
    issue.resolution = {
      acceptedValue,
      acceptedSourceId,
      resolvedBy: user,
      resolvedAt: new Date().toISOString(),
      rationale
    };

    // Update authoritative flag
    issue.sources.forEach(s => {
      s.isAuthoritative = s.sourceId === acceptedSourceId;
    });

    const acceptedSource = issue.sources.find(s => s.sourceId === acceptedSourceId);

    db.addAuditLog({
      user,
      role: 'SUPER_ADMIN',
      action: 'RESOLVE_DATA_CONFLICT',
      targetEntity: `Conflict #${issue.id} (${issue.metric})`,
      documentName: acceptedSource?.documentName || 'Unknown Document',
      previousValue: 'Conflicting Sources Unresolved',
      newValue: `Accepted ${acceptedValue} from ${acceptedSource?.documentName}`,
      rationale: rationale || 'Designated authoritative source based on reliability hierarchy'
    });

    return issue;
  }
}

export const conflictEngine = new ConflictEngine();
