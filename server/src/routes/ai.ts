import { Router } from 'express';
import { queryEngine } from '../services/ai/queryEngine.js';
import { db } from '../database/store.js';

const router = Router();

// Submit query to Hybrid AI Query Engine
router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string' || !query.trim()) {
      res.status(400).json({ success: false, message: 'Query is required' });
      return;
    }

    const result = await queryEngine.executeQuery(query.trim(), db.currentUser.name);

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get recent query history
router.get('/history', (req, res) => {
  res.json({
    success: true,
    history: db.aiQueries
  });
});

// Pre-configured query suggestions
router.get('/suggestions', (req, res) => {
  const suggestions = [
    {
      category: 'Historical Comparison',
      query: 'Compare production from 2015 to 2025',
      description: 'Analyze decadal output growth, peak years, and compound expansion'
    },
    {
      category: 'Target Variance',
      query: 'Which years were below production targets?',
      description: 'Identify statutory shortfall years, deficit volumes, and primary contributory factors'
    },
    {
      category: 'Mine Megaprojects',
      query: 'Generate a report on Gevra OCP',
      description: 'Examine Asia’s largest coal mine, 70 MTY expansion DPR, and stripping ratios'
    },
    {
      category: 'Subsidiary Benchmarking',
      query: 'Compare SECL and MCL production and overburden',
      description: 'Benchmark the two premier producing subsidiaries across output and stripping ratio'
    },
    {
      category: 'Safety & Parliamentary',
      query: 'Find parliamentary questions related to mine safety and fatalities',
      description: 'Review Lok Sabha & Rajya Sabha ministerial replies and DGMS audit directives'
    },
    {
      category: 'Insufficient Evidence Test',
      query: 'What is the coal production in Mars Olympus Mons mine?',
      description: 'Tests system adherence to Safety Rule 1: No fabrication when records are missing'
    }
  ];

  res.json({ success: true, suggestions });
});

// Get evidence citations
router.get('/sources', (req, res) => {
  const allEvidence = db.aiQueries.flatMap(q => q.evidence);
  res.json({ success: true, evidence: allEvidence });
});

export default router;
