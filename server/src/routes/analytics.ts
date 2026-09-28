import { Router } from 'express';
import { db } from '../database/store.js';

const router = Router();

// GET 10-year historical production trends & target vs actual
router.get('/production-trends', (req, res) => {
  res.json({
    success: true,
    data: db.historicalProduction
  });
});

// GET mine-level master metrics
router.get('/mines', (req, res) => {
  const { subsidiary } = req.query;
  let mines = db.mineMetrics;
  if (subsidiary && subsidiary !== 'All Subsidiaries') {
    mines = mines.filter(m => m.subsidiary.toLowerCase() === String(subsidiary).toLowerCase());
  }
  res.json({
    success: true,
    mines
  });
});

// GET detected anomalies
router.get('/anomalies', (req, res) => {
  const anomalies = [
    {
      id: 'anom-1',
      title: 'Production Deviation: Kusmunda OCP',
      mine: 'Kusmunda OCP',
      subsidiary: 'SECL',
      financialYear: '2020-21',
      expected: '45.0 MT',
      actual: '33.8 MT',
      deviation: '-24.8%',
      severity: 'HIGH',
      supportingDocsCount: 7,
      description: 'Severe monsoon pit flooding between August and October 2020 inundated lowermost coal benches (Kusmunda Seam), limiting excavator operations.',
      corroboratingDocuments: [
        'Form_IV_Monthly_Coal_Return_Kusmunda_March_2021.xlsx',
        'CIL_Annual_Report_Accounts_FY2023_24.pdf'
      ]
    },
    {
      id: 'anom-2',
      title: 'Overburden Removal Spike: Jayant OCP',
      mine: 'Jayant OCP',
      subsidiary: 'NCL',
      financialYear: '2022-23',
      expected: '58.0 M.Cu.M',
      actual: '68.9 M.Cu.M',
      deviation: '+18.8%',
      severity: 'MEDIUM',
      supportingDocsCount: 4,
      description: 'Accelerated advance stripping executed by walking draglines to clear Purewa seam floor following delayed fault zone stabilization.',
      corroboratingDocuments: [
        'NCL_Jayant_Dragline_Deployment_Overburden_Audit.pdf',
        'NCL_Singrauli_Geological_Exploration_CMPDI_2022.pdf'
      ]
    },
    {
      id: 'anom-3',
      title: 'Dispatch Lag: North Karanpura Amrapali-Ashok Cluster',
      mine: 'Amrapali OCP',
      subsidiary: 'CCL',
      financialYear: '2021-22',
      expected: '30.0 MT',
      actual: '23.4 MT',
      deviation: '-22.0%',
      severity: 'MEDIUM',
      supportingDocsCount: 5,
      description: 'Evacuation constraint prior to the commissioning of Tori-Shivpur Phase II railway double line, leading to high pithead stock accumulation.',
      corroboratingDocuments: [
        'CCL_North_Karanpura_Amrapali_Ashok_Dispatch_Report.pdf'
      ]
    }
  ];

  res.json({
    success: true,
    anomalies
  });
});

export default router;
