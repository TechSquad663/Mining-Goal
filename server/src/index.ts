import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import documentsRoutes from './routes/documents.js';
import aiRoutes from './routes/ai.js';
import reportsRoutes from './routes/reports.js';
import validationRoutes from './routes/validation.js';
import analyticsRoutes from './routes/analytics.js';
import topicsRoutes from './routes/topics.js';
import knowledgeRoutes from './routes/knowledge.js';
import auditRoutes from './routes/audit.js';
import searchRoutes from './routes/search.js';
import { db } from './database/store.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health and System Diagnostics
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OPERATIONAL',
    service: 'COALINTELLIGENCE AI Server',
    version: '1.0.0',
    aiEngine: {
      mode: process.env.AI_MODE || 'mock',
      provider: 'CoalIntelligence Hybrid Query & OCR Engine',
      status: 'READY'
    },
    queues: {
      ocrQueue: 0,
      validationConflicts: db.validationIssues.filter(v => v.status === 'PENDING').length,
      pendingReports: db.reports.filter(r => r.status === 'UNDER_REVIEW').length
    },
    uptime: process.uptime()
  });
});

// Notifications
app.get('/api/notifications', (req, res) => {
  res.json({
    success: true,
    notifications: db.notifications
  });
});

app.post('/api/notifications/:id/read', (req, res) => {
  const notif = db.notifications.find(n => n.id === req.params.id);
  if (notif) notif.read = true;
  res.json({ success: true });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/validation', validationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/search', searchRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[COALINTELLIGENCE SERVER ERROR]', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`⚡ COALINTELLIGENCE AI Server running at http://localhost:${PORT}`);
  console.log(`⚡ AI Mode: ${process.env.AI_MODE || 'mock (Pluggable Mock & Structured Engine)'}`);
  console.log(`⚡ Repository: CMPDI / Coal India Limited (CIL) Statutory Knowledge`);
  console.log(`================================================================`);
});
