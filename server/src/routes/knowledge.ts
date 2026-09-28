import { Router } from 'express';

const router = Router();

router.get('/graph', (req, res) => {
  const nodes = [
    { id: 'cil', label: 'Coal India Limited (CIL)', type: 'HoldingCompany', group: 1 },
    
    // Subsidiaries
    { id: 'secl', label: 'SECL (Bilaspur)', type: 'Subsidiary', group: 2 },
    { id: 'mcl', label: 'MCL (Sambalpur)', type: 'Subsidiary', group: 2 },
    { id: 'ncl', label: 'NCL (Singrauli)', type: 'Subsidiary', group: 2 },
    { id: 'ccl', label: 'CCL (Ranchi)', type: 'Subsidiary', group: 2 },
    { id: 'bccl', label: 'BCCL (Dhanbad)', type: 'Subsidiary', group: 2 },
    { id: 'cmpdi', label: 'CMPDI (Ranchi)', type: 'Institute', group: 2 },

    // Coalfields
    { id: 'cf-korba', label: 'Korba Coalfield', type: 'Coalfield', group: 3 },
    { id: 'cf-singrauli', label: 'Singrauli Coalfield', type: 'Coalfield', group: 3 },
    { id: 'cf-talcher', label: 'Talcher Coalfield', type: 'Coalfield', group: 3 },
    { id: 'cf-karanpura', label: 'North Karanpura', type: 'Coalfield', group: 3 },
    { id: 'cf-jharia', label: 'Jharia Coalfield', type: 'Coalfield', group: 3 },

    // Mines
    { id: 'mine-gevra', label: 'Gevra OCP (59.2 MT)', type: 'Mine', group: 4 },
    { id: 'mine-kusmunda', label: 'Kusmunda OCP (48.5 MT)', type: 'Mine', group: 4 },
    { id: 'mine-jayant', label: 'Jayant OCP (26.5 MT)', type: 'Mine', group: 4 },
    { id: 'mine-bhuban', label: 'Bhubaneswari OCP (31.4 MT)', type: 'Mine', group: 4 },
    { id: 'mine-amrapali', label: 'Amrapali OCP (28.0 MT)', type: 'Mine', group: 4 },
    { id: 'mine-moonidih', label: 'Moonidih UG (Coking)', type: 'Mine', group: 4 },

    // Core Metrics & Themes
    { id: 'met-prod', label: 'Coal Production: 773.6 MT', type: 'Metric', group: 5 },
    { id: 'met-obr', label: 'Overburden: 1,965 M.Cu.M', type: 'Metric', group: 5 },
    { id: 'met-dpr', label: 'Gevra 70 MTY Expansion DPR', type: 'Report', group: 5 }
  ];

  const edges = [
    { from: 'cil', to: 'secl', label: 'Controls' },
    { from: 'cil', to: 'mcl', label: 'Controls' },
    { from: 'cil', to: 'ncl', label: 'Controls' },
    { from: 'cil', to: 'ccl', label: 'Controls' },
    { from: 'cil', to: 'bccl', label: 'Controls' },
    { from: 'cil', to: 'cmpdi', label: 'Scientific Planning' },

    { from: 'secl', to: 'cf-korba', label: 'Operates In' },
    { from: 'ncl', to: 'cf-singrauli', label: 'Operates In' },
    { from: 'mcl', to: 'cf-talcher', label: 'Operates In' },
    { from: 'ccl', to: 'cf-karanpura', label: 'Operates In' },
    { from: 'bccl', to: 'cf-jharia', label: 'Operates In' },

    { from: 'cf-korba', to: 'mine-gevra', label: 'Contains Mine' },
    { from: 'cf-korba', to: 'mine-kusmunda', label: 'Contains Mine' },
    { from: 'cf-singrauli', to: 'mine-jayant', label: 'Contains Mine' },
    { from: 'cf-talcher', to: 'mine-bhuban', label: 'Contains Mine' },
    { from: 'cf-karanpura', to: 'mine-amrapali', label: 'Contains Mine' },
    { from: 'cf-jharia', to: 'mine-moonidih', label: 'Contains Mine' },

    { from: 'mine-gevra', to: 'met-prod', label: 'Contributes 59.2 MT' },
    { from: 'mine-gevra', to: 'met-dpr', label: 'Governed by' },
    { from: 'mine-jayant', to: 'met-obr', label: 'Stripping OBR' }
  ];

  res.json({ success: true, nodes, edges });
});

// GET data lineage trace
router.get('/lineage/:id?', (req, res) => {
  const sampleLineage = {
    targetMetric: 'Gevra OCP FY 2023-24 Production: 59.2 MT',
    steps: [
      {
        step: 1,
        stage: 'FINAL OFFICIAL REPORT',
        entity: 'Parliamentary Review: 10-Year Production Trajectory (CMPDI/PARL/2024/REV-08)',
        detail: 'Executive Summary, Paragraph 2, Section: SECL Output',
        verified: true
      },
      {
        step: 2,
        stage: 'PRODUCTION CHART VISUALIZATION',
        entity: 'CIL Subsidiary Benchmark Chart',
        detail: 'Plotted Data Point: Gevra 59.2 MT (Target: 58.0 MT)',
        verified: true
      },
      {
        step: 3,
        stage: 'STRUCTURED DATABASE RECORD',
        entity: 'production_records table (UUID: rec-7f8921)',
        detail: 'SQL Row: { metric: "Coal Production", value: 59.2, unit: "MT", fy: "2023-24", confidence: 0.99 }',
        verified: true
      },
      {
        step: 4,
        stage: 'EXTRACTED OCR VALUE & CELL',
        entity: 'Table 2: Form IV Statutory Reconciliation',
        detail: 'Cell [Row 4, Col 3]: 59,200,000 Tonnes (OCR Confidence: 99.4%)',
        verified: true
      },
      {
        step: 5,
        stage: 'STATUTORY AUDITED DOCUMENT',
        entity: 'CIL_Annual_Report_Accounts_FY2023_24.pdf',
        detail: 'Document ID: doc-01 | SHA256: 8a4f91e0... | Signed by Statutory Auditors',
        verified: true
      },
      {
        step: 6,
        stage: 'PAGE CITATION & BOUNDING BOX',
        entity: 'Page 94, Section 3.2',
        detail: 'Bounding Box: { x: 14.2%, y: 48.5%, width: 72.0%, height: 18.4% }',
        verified: true
      },
      {
        step: 7,
        stage: 'ORIGINAL SCANNED ARCHIVE',
        entity: 'Ministry of Coal / CCO Tabled Record',
        detail: 'Physical File Archive: CMPDI Central Records Room (Carton B-412)',
        verified: true
      }
    ]
  };

  res.json({ success: true, lineage: sampleLineage });
});

export default router;
