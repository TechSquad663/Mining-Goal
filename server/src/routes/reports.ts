import { Router } from 'express';
import { db } from '../database/store.js';
import { reportEngine } from '../services/reports/reportEngine.js';

const router = Router();

// GET all reports
router.get('/', (req, res) => {
  res.json({
    success: true,
    reports: db.reports
  });
});

// GET report by ID
router.get('/:id', (req, res) => {
  const report = db.reports.find(r => r.id === req.params.id);
  if (!report) {
    res.status(404).json({ success: false, message: 'Report not found' });
    return;
  }
  res.json({
    success: true,
    report
  });
});

// POST generate new report
router.post('/generate', async (req, res) => {
  try {
    const { title, type, subsidiary, mine, timePeriod, metrics } = req.body;
    const newReport = await reportEngine.generateReport({
      title,
      type: type || 'Parliamentary Response',
      subsidiary: subsidiary || 'Coal India Ltd (CIL)',
      mine,
      timePeriod: timePeriod || 'FY 2023-24',
      metrics: metrics || ['Production', 'Overburden', 'Safety'],
      userName: db.currentUser.name
    });

    res.status(201).json({
      success: true,
      report: newReport,
      message: 'Report successfully synthesized and queued for review'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST update report approval status
router.post('/:id/status', async (req, res) => {
  try {
    const { status, comment } = req.body;
    const updated = await reportEngine.updateReportStatus(
      req.params.id,
      status,
      db.currentUser.name,
      db.currentUser.role,
      comment
    );

    res.json({
      success: true,
      report: updated,
      message: `Report status updated to ${status}`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mock export route
router.post('/:id/export', (req, res) => {
  const { format = 'pdf' } = req.body;
  const report = db.reports.find(r => r.id === req.params.id);
  if (!report) {
    res.status(404).json({ success: false, message: 'Report not found' });
    return;
  }

  res.json({
    success: true,
    downloadUrl: `/exports/${report.referenceNumber.replace(/[\/\\]/g, '_')}.${format}`,
    format,
    message: `Export prepared successfully in ${format.toUpperCase()} format.`
  });
});

export default router;
