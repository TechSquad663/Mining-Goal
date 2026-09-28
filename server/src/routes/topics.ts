import { Router } from 'express';
import { db } from '../database/store.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    topics: db.topics,
    evolutionTimeline: [
      {
        era: '2010–2015',
        theme: 'Exploration, Reserve Estimation & Manual Extraction',
        focusTopics: ['CMPDI Boreholes', 'In-Situ Reserves', 'Underground Bord & Pillar', 'Manual Loading'],
        highlights: 'Primary focus centered on baseline coalfield block delineations and preliminary environmental assessments.'
      },
      {
        era: '2016–2020',
        theme: 'Rapid Opencast Mechanization & Volume Scaling',
        focusTopics: ['Surface Miners', 'Walking Draglines', 'Heavy Earthmoving Machinery', 'Form IV Automation'],
        highlights: 'Transition towards high-capacity opencast mines (Gevra, Kusmunda) with continuous surface miners replacing traditional drilling & blasting.'
      },
      {
        era: '2021–2026',
        theme: 'Digital Automation, AI Intelligence & ESG Sustainability',
        focusTopics: ['Fleet Management (OITDS)', 'AI Production Intelligence', 'Slope Stability Radar', 'First Mile Connectivity', 'Bio-Reclamation'],
        highlights: 'Deployment of real-time IoT weighbridges, rapid loading railway silos, automated evidence reconciliation, and decarbonization benchmarks.'
      }
    ]
  });
});

export default router;
