import { Router } from 'express';
import { db } from '../database/store.js';

const router = Router();

router.get('/', (req, res) => {
  const { user, action, search } = req.query;

  let logs = [...db.auditLogs];

  if (user && user !== 'All Users') {
    logs = logs.filter(l => l.user.toLowerCase().includes(String(user).toLowerCase()));
  }

  if (action && action !== 'All Actions') {
    logs = logs.filter(l => l.action === action);
  }

  if (search) {
    const q = String(search).toLowerCase();
    logs = logs.filter(l => 
      l.targetEntity.toLowerCase().includes(q) ||
      l.rationale?.toLowerCase().includes(q) ||
      l.documentName?.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    total: logs.length,
    logs
  });
});

export default router;
