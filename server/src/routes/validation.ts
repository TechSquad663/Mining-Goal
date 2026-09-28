import { Router } from 'express';
import { db } from '../database/store.js';
import { conflictEngine } from '../services/validation/conflictEngine.js';

const router = Router();

// GET all validation issues
router.get('/issues', (req, res) => {
  res.json({
    success: true,
    total: db.validationIssues.length,
    issues: db.validationIssues
  });
});

// POST resolve a validation issue
router.post('/resolve', (req, res) => {
  try {
    const { issueId, acceptedSourceId, acceptedValue, rationale } = req.body;
    if (!issueId || !acceptedSourceId || acceptedValue === undefined) {
      res.status(400).json({ success: false, message: 'Missing resolution parameters' });
      return;
    }

    const resolved = conflictEngine.resolveIssue(
      issueId,
      acceptedSourceId,
      acceptedValue,
      db.currentUser.name,
      rationale || 'Designated authoritative based on statutory reliability hierarchy'
    );

    res.json({
      success: true,
      issue: resolved,
      message: 'Validation conflict successfully resolved and recorded in Audit Trail'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET source reliability hierarchy
router.get('/hierarchy', (req, res) => {
  res.json({
    success: true,
    hierarchy: db.sourceReliability
  });
});

// PUT update source reliability hierarchy
router.put('/hierarchy', (req, res) => {
  const { hierarchy } = req.body;
  if (Array.isArray(hierarchy)) {
    db.sourceReliability = hierarchy;
    db.addAuditLog({
      user: db.currentUser.name,
      role: db.currentUser.role,
      action: 'UPDATE_SOURCE_HIERARCHY',
      targetEntity: 'System Source Reliability Matrix',
      newValue: `Updated hierarchy with ${hierarchy.length} levels`,
      rationale: 'Updated statutory ranking priority for conflict resolution'
    });
    res.json({ success: true, hierarchy: db.sourceReliability });
  } else {
    res.status(400).json({ success: false, message: 'Invalid hierarchy array' });
  }
});

export default router;
