import { 
  LLMProvider, 
  QueryIntent, 
  GeneratedAnswer, 
  EmbeddingProvider, 
  VectorSearchProvider, 
  OCRProvider 
} from './providers.js';
import { EvidenceCitation, ExtractedEntity, ExtractedTable, ReportSection } from '../../types/index.js';
import { db } from '../../database/store.js';

export class MockLLMProvider implements LLMProvider {
  public name = 'CoalIntelligence Mock LLM Engine v2.4 (CMPDI Fine-Tuned)';

  public async classifyIntent(query: string): Promise<QueryIntent> {
    const q = query.toLowerCase();
    
    const mines = db.mineMetrics
      .map(m => m.mine)
      .filter(mine => q.includes(mine.toLowerCase().replace(' ocp', '').replace(' ug', '')));

    const subsidiaries = ['secl', 'mcl', 'ncl', 'ccl', 'wcl', 'bccl', 'ecl', 'cil']
      .filter(sub => q.includes(sub));

    const isBelowTarget = q.includes('below target') || q.includes('shortfall') || q.includes('target vs actual');
    const isComparison = q.includes('compare') || q.includes('between') || q.includes('versus') || q.includes('vs');
    const isSafety = q.includes('safety') || q.includes('fatal') || q.includes('parliament') || q.includes('dgms');
    const isGeology = q.includes('geological') || q.includes('borehole') || q.includes('reserve') || q.includes('seam');

    let type: QueryIntent['type'] = 'GENERAL';
    if (isBelowTarget || isComparison) type = 'NUMERICAL_COMPARISON';
    else if (q.includes('trend') || q.includes('growth')) type = 'TEMPORAL_TREND';
    else if (isSafety) type = 'SAFETY_PARLIAMENT';
    else if (isGeology) type = 'GEOLOGICAL_RESERVE';

    return {
      type,
      entities: [...mines, ...subsidiaries],
      mines,
      subsidiaries,
      metrics: ['production', 'target', 'overburden', 'stripping ratio'],
      requiresSqlCalculation: type === 'NUMERICAL_COMPARISON' || type === 'TEMPORAL_TREND'
    };
  }

  public async generateAnswer(query: string, intent: QueryIntent, evidence: EvidenceCitation[]): Promise<GeneratedAnswer> {
    const q = query.toLowerCase().trim();

    // Check for insufficient evidence cases
    if (q.includes('mars') || q.includes('alien') || q.includes('antarctica') || q.includes('crypto')) {
      return {
        text: 'Insufficient verified information found in the available records.\n\nThe system searched 128,452 indexed document pages across Coal India Limited and CMPDI archives, but found no corroborated records matching this query.',
        confidence: 0.12,
        dataStatus: 'INSUFFICIENT_EVIDENCE',
        evidence: [],
        suggestedFollowUps: [
          'Compare production from 2015 to 2025',
          'Which years were below production targets?',
          'What were the major topics in annual reports?'
        ]
      };
    }

    // 1. Comparison of 2015 to 2025 or overall production trend
    if (q.includes('2015') && (q.includes('2025') || q.includes('trend') || q.includes('compare'))) {
      const p16 = db.historicalProduction.find(p => p.financialYear === '2015-16')!;
      const p25 = db.historicalProduction.find(p => p.financialYear.includes('2024-25'))!;
      const growth = (((p25.actual - p16.actual) / p16.actual) * 100).toFixed(1);

      return {
        text: `Coal India Limited aggregate production increased from ${p16.actual.toFixed(1)} MT in FY 2015-16 to ${p25.actual.toFixed(1)} MT in FY 2024-25.\n\nKey Production Metrics:\n- Overall 10-Year Growth: +${growth}%\n- Absolute Production Increase: +${(p25.actual - p16.actual).toFixed(1)} MT\n- Highest Recorded Fiscal Production: ${p25.actual.toFixed(1)} MT (FY 2024-25)\n- Lowest Recorded Fiscal Production: ${p16.actual.toFixed(1)} MT (FY 2015-16)\n\nAll metrics are derived directly from audited CIL Annual Reports and provisional Coal Controller submissions.`,
        confidence: 0.987,
        dataStatus: 'VERIFIED',
        evidence: [
          {
            id: 'ev-auto-1',
            documentId: 'doc-01',
            documentName: 'CIL_Annual_Report_Accounts_FY2023_24.pdf',
            documentType: 'Annual Report',
            subsidiary: 'CIL',
            page: 14,
            section: 'Decadal Production Trajectory',
            rawText: `Historical Table 2.1: Coal India production grew from 538.75 MT (FY 2015-16) to 773.65 MT (FY 2023-24) and projected 825.40 MT in FY 2024-25.`,
            confidence: 0.99,
            validationStatus: 'VERIFIED'
          },
          {
            id: 'ev-auto-2',
            documentId: 'doc-05',
            documentName: 'MCL_Production_Performance_FY2023_24.pdf',
            documentType: 'Annual Report',
            subsidiary: 'MCL',
            page: 28,
            section: 'Subsidiary Growth Comparison',
            rawText: `MCL emerged as chief volume driver expanding from 130.4 MT to 206.1 MT over the comparative decadal cycle.`,
            confidence: 0.98,
            validationStatus: 'VERIFIED'
          }
        ],
        chartData: {
          type: 'line',
          title: 'Coal India 10-Year Production Evolution (MT)',
          xAxisKey: 'year',
          data: db.historicalProduction.map(p => ({
            year: p.financialYear.replace(' (Projected/YTD)', ''),
            Actual: p.actual,
            Target: p.target
          }))
        },
        keyStats: [
          { label: 'Overall Change', value: `+${growth}%`, delta: `+${(p25.actual - p16.actual).toFixed(1)} MT` },
          { label: 'FY 2015-16 Base', value: `${p16.actual} MT`, delta: 'Starting baseline' },
          { label: 'FY 2024-25 Peak', value: `${p25.actual} MT`, delta: 'All-time record' }
        ],
        suggestedFollowUps: [
          'Which subsidiary contributed the highest growth share?',
          'What was the stripping ratio trend during this decade?',
          'Generate official parliamentary brief for this period'
        ]
      };
    }

    // 2. Below Target Years query
    if (q.includes('below') || q.includes('target') || q.includes('shortfall')) {
      const belowYears = db.historicalProduction
        .filter(p => p.actual < p.target)
        .map(p => ({
          year: p.financialYear.replace(' (Projected/YTD)', ''),
          target: p.target,
          actual: p.actual,
          deficit: (p.target - p.actual).toFixed(1),
          deficitPct: (((p.target - p.actual) / p.target) * 100).toFixed(1)
        }));

      return {
        text: `Analysis of verified statutory records indicates that Coal India fell below annual production targets in ${belowYears.length} of the last 10 financial years.\n\nSummary of Shortfall Years:\n${belowYears.map(y => `• ${y.year}: Target ${y.target} MT | Actual ${y.actual} MT (Deficit: -${y.deficit} MT / -${y.deficitPct}%)`).join('\n')}\n\nPrimary Contributory Factors (cited in Annual Reports):\n1. Extended heavy monsoon inundations in major opencast pits (Korba, Talcher, Singrauli)\n2. Forestry and environmental clearance delays for new phases\n3. Evacuation bottlenecks prior to critical rail corridor commissionings (Tori-Shivpur, Jharsuguda-Barpali)`,
        confidence: 0.991,
        dataStatus: 'VERIFIED',
        evidence: [
          {
            id: 'ev-auto-3',
            documentId: 'doc-01',
            documentName: 'CIL_Annual_Report_Accounts_FY2023_24.pdf',
            documentType: 'Annual Report',
            subsidiary: 'CIL',
            page: 38,
            section: 'Target vs Achievement Review',
            rawText: `CIL achieved 99.18% of target in FY24 (773.6 MT vs 780.0 MT), reversing historical deficits observed in FY20 (91.2%) and FY21 (91.3%).`,
            confidence: 0.99,
            validationStatus: 'VERIFIED'
          },
          {
            id: 'ev-auto-4',
            documentId: 'doc-07',
            documentName: 'Lok_Sabha_Starred_Question_Q142_Coal_Production_Safety.pdf',
            documentType: 'Parliamentary Question',
            subsidiary: 'CIL',
            page: 6,
            section: 'Ministerial Statement',
            rawText: `In parliamentary reply, Minister noted shortfall in FY 2020-21 was caused by COVID-19 demand compression and severe monsoon flooding.`,
            confidence: 0.98,
            validationStatus: 'VERIFIED'
          }
        ],
        chartData: {
          type: 'bar',
          title: 'Target vs Actual Production (MT)',
          xAxisKey: 'year',
          data: db.historicalProduction.map(p => ({
            year: p.financialYear.replace(' (Projected/YTD)', ''),
            Target: p.target,
            Actual: p.actual
          }))
        },
        keyStats: [
          { label: 'Deficit Years', value: `${belowYears.length} of 10`, delta: 'Historical pattern' },
          { label: 'Largest Shortfall', value: 'FY 2019-20', delta: '-57.9 MT (-8.8%)' },
          { label: 'Surplus Reversal', value: 'FY 2022-23', delta: '+3.2 MT over target' }
        ],
        suggestedFollowUps: [
          'Show mine-specific anomalies for Kusmunda and Dipka',
          'What was the impact on thermal power plant stocks during these years?',
          'Generate report on target achievement'
        ]
      };
    }

    // 3. Gevra Mine specific query
    if (q.includes('gevra')) {
      const gevra = db.mineMetrics.find(m => m.mine.includes('Gevra'))!;
      return {
        text: `**Gevra Opencast Project (SECL, Korba Coalfield)** is the largest coal mine in Asia, with FY 2023-24 annual production of **${gevra.productionFY24} MT** against a target of ${gevra.targetFY24} MT (102.1% achievement).\n\nTechnical & Geological Profile:\n- Proved In-Situ Reserves: ${gevra.reserveMT} MT\n- Current Stripping Ratio: ${gevra.strippingRatio} M.Cu.M/Tonne\n- Major Productive Seams: ${gevra.seams.join(', ')}\n- Coal Grade: ${gevra.grade} (Gross Calorific Value: 3,700-4,000 kcal/kg)\n- Expansion DPR: Scale to 70 MTY capacity utilizing 42 cum rope shovels and in-pit crushing conveying systems.`,
        confidence: 0.989,
        dataStatus: 'VERIFIED',
        evidence: [
          {
            id: 'ev-auto-5',
            documentId: 'doc-02',
            documentName: 'Gevra_70MTY_Mega_Project_Detailed_Project_Report_CMPDI.pdf',
            documentType: 'Mine Plan',
            subsidiary: 'SECL',
            mine: 'Gevra OCP',
            page: 12,
            section: 'Salient Project Features',
            rawText: `Gevra OCP is planned to expand from 52.5 MTY to 70 MTY peak capacity under CMPDI DPR sanction.`,
            confidence: 0.99,
            validationStatus: 'VERIFIED'
          },
          {
            id: 'ev-auto-6',
            documentId: 'doc-04',
            documentName: 'Form_IV_Monthly_Coal_Return_Gevra_March_2024.xlsx',
            documentType: 'Form IV Production Return',
            subsidiary: 'SECL',
            mine: 'Gevra OCP',
            page: 1,
            section: 'Coal Controller Reconciliation',
            rawText: `Total annual dispatch certified at 59.2 MT, exceeding statutory target.`,
            confidence: 0.99,
            validationStatus: 'VERIFIED'
          }
        ],
        chartData: {
          type: 'bar',
          title: 'Korba Cluster Top Mines Production (FY24 MT)',
          xAxisKey: 'mine',
          data: [
            { mine: 'Gevra OCP', Production: 59.2, Target: 58.0 },
            { mine: 'Kusmunda OCP', Production: 48.5, Target: 46.0 },
            { mine: 'Dipka OCP', Production: 38.6, Target: 40.0 }
          ]
        },
        keyStats: [
          { label: 'FY24 Output', value: '59.2 MT', delta: '+2.1% over target' },
          { label: 'Expansion Capacity', value: '70.0 MTY', delta: 'CMPDI Approved DPR' },
          { label: 'Stripping Ratio', value: '1.32', delta: 'Low OBR per tonne' }
        ],
        suggestedFollowUps: [
          'What is the environmental clearance status for Gevra 70 MTY?',
          'Compare Gevra and Kusmunda overburden removal',
          'Generate detailed mine performance report for Gevra'
        ]
      };
    }

    // 4. Subsidiary Comparison query
    if (q.includes('subsidiary') || (q.includes('secl') && q.includes('mcl'))) {
      const fy24 = db.historicalProduction.find(p => p.financialYear === '2023-24')!;
      return {
        text: `Comparative evaluation of Coal India subsidiaries for FY 2023-24 demonstrates that **MCL (Mahanadi Coalfields)** and **SECL (South Eastern Coalfields)** together accounted for over 50.8% of aggregate national production.\n\nSubsidiary Ranking (FY 2023-24):\n1. MCL: 206.1 MT (Target: 204.0 MT | 101.0%)\n2. SECL: 187.0 MT (Target: 197.0 MT | 94.9%)\n3. NCL: 141.5 MT (Target: 139.0 MT | 101.8%)\n4. CCL: 86.0 MT (Target: 84.0 MT | 102.4%)\n5. WCL: 69.1 MT (Target: 68.0 MT | 101.6%)\n6. ECL: 42.6 MT (Target: 47.0 MT | 90.6%)\n7. BCCL: 41.1 MT (Target: 41.0 MT | 100.2%)\n\nMCL achieved a historic milestone as the first CIL subsidiary to cross the 200 MT production threshold in a single financial year.`,
        confidence: 0.994,
        dataStatus: 'VERIFIED',
        evidence: [
          {
            id: 'ev-auto-7',
            documentId: 'doc-05',
            documentName: 'MCL_Production_Performance_FY2023_24.pdf',
            documentType: 'Annual Report',
            subsidiary: 'MCL',
            page: 18,
            section: 'Historic Milestone Achievement',
            rawText: `MCL established a national record with 206.1 MT coal production, an increase of 6.6% over previous year.`,
            confidence: 0.99,
            validationStatus: 'VERIFIED'
          },
          {
            id: 'ev-auto-8',
            documentId: 'doc-01',
            documentName: 'CIL_Annual_Report_Accounts_FY2023_24.pdf',
            documentType: 'Annual Report',
            subsidiary: 'CIL',
            page: 54,
            section: 'Consolidated Subsidiary Table',
            rawText: `Consolidated breakdown of subsidiary outputs verified by statutory auditors.`,
            confidence: 0.99,
            validationStatus: 'VERIFIED'
          }
        ],
        chartData: {
          type: 'bar',
          title: 'FY 2023-24 Production by Subsidiary (MT)',
          xAxisKey: 'subsidiary',
          data: fy24.subsidiaryBreakdown
        },
        keyStats: [
          { label: 'Top Subsidiary', value: 'MCL (206.1 MT)', delta: 'First >200 MT entity' },
          { label: 'Highest Target Achievement', value: 'CCL (102.4%)', delta: '86.0 MT vs 84.0 MT' },
          { label: 'Total Output', value: '773.6 MT', delta: '99.2% overall achievement' }
        ],
        suggestedFollowUps: [
          'Compare stripping ratios between MCL and NCL',
          'Show evacuation infrastructure for North Karanpura (CCL)',
          'Generate subsidiary comparison report'
        ]
      };
    }

    // 5. Safety & Parliamentary Questions query
    if (q.includes('safety') || q.includes('parliament') || q.includes('dgms') || q.includes('accident')) {
      return {
        text: `Based on parliamentary replies (Lok Sabha SQ 142) and DGMS annual safety audit records, safety performance across Coal India mines has shown sustained long-term improvement.\n\nKey Safety Audit Findings:\n- Serious Accident Rate declined by 38% between 2018 and 2024.\n- 100% of large opencast mines (>5 MTY) have deployed real-time Slope Stability Radars (SSR).\n- Strata management systems and continuous methane monitoring are mandated for all deep underground mines in BCCL and ECL.\n- Annual safety budget allocation increased to ₹1,450 Crores in FY 2023-24.`,
        confidence: 0.965,
        dataStatus: 'VERIFIED',
        evidence: [
          {
            id: 'ev-auto-9',
            documentId: 'doc-07',
            documentName: 'Lok_Sabha_Starred_Question_Q142_Coal_Production_Safety.pdf',
            documentType: 'Parliamentary Question',
            subsidiary: 'CIL',
            page: 4,
            section: 'Ministerial Reply on Mining Safety Standards',
            rawText: `Comprehensive safety review tabled before Parliament: Fatality rate per Million Tonnes reduced to 0.14 in 2023 compared to 0.28 in 2015.`,
            confidence: 0.98,
            validationStatus: 'VERIFIED'
          },
          {
            id: 'ev-auto-10',
            documentId: 'doc-09',
            documentName: 'DGMS_Annual_Safety_Audit_Jharia_Coalfield_2023.pdf',
            documentType: 'Safety Audit',
            subsidiary: 'BCCL',
            mine: 'Moonidih UG',
            page: 22,
            section: 'Gas Drainage & Vent Compliance',
            rawText: `DGMS certification of mechanized longwall methane drainage system at Moonidih project.`,
            confidence: 0.97,
            validationStatus: 'VERIFIED'
          }
        ],
        keyStats: [
          { label: 'Fatality Rate / MT', value: '0.14', delta: '-50% reduction since 2015' },
          { label: 'Slope Radar Deployment', value: '100%', delta: 'All >5 MTY pits' },
          { label: 'Safety Capex (FY24)', value: '₹1,450 Cr', delta: 'Statutory allocation' }
        ],
        suggestedFollowUps: [
          'View DGMS audit findings for Moonidih project',
          'Show safety directives for monsoon preparedness',
          'Draft parliamentary response on mine accidents'
        ]
      };
    }

    // Default general response fallback backed by evidence
    return {
      text: `Based on verified CMPDI and Coal India records, the knowledge base currently indexes 20 statutory documents spanning production, geological surveys, mine plans, and parliamentary questions.\n\nQuery Scope: "${query}"\n\nVerified Summary:\nCoal India produces over 770 MT of thermal and metallurgical coal annually across 84 mining areas. The repository contains high-confidence verified data for production, stripping ratio, seam thickness, and statutory approvals.`,
      confidence: 0.92,
      dataStatus: 'VERIFIED',
      evidence: [
        {
          id: 'ev-auto-11',
          documentId: 'doc-01',
          documentName: 'CIL_Annual_Report_Accounts_FY2023_24.pdf',
          documentType: 'Annual Report',
          subsidiary: 'CIL',
          page: 1,
          section: 'Corporate Overview',
          rawText: `Coal India Limited is the premier energy provider of India, meeting over 80% of domestic coal requirements.`,
          confidence: 0.95,
          validationStatus: 'VERIFIED'
        }
      ],
      suggestedFollowUps: [
        'Compare production from 2015 to 2025',
        'Which years were below production targets?',
        'Show major production trends across subsidiaries'
      ]
    };
  }

  public async generateReportSection(title: string, prompt: string, evidence: EvidenceCitation[]): Promise<ReportSection> {
    return {
      id: `sec-${Date.now()}`,
      title,
      content: `Official briefing regarding ${title}. Synthesized from ${evidence.length} verified statutory citations across CIL subsidiary records.\n\nKey Findings: All metrics reflect audited financial accounts and statutory Form IV filings. High confidence level corroborated by multi-source cross-referencing.`,
      sourcesUsed: evidence.map(e => e.documentId)
    };
  }
}

export class MockEmbeddingProvider implements EmbeddingProvider {
  public name = 'CoalIntelligence Domain Embedding v1';

  public async generateEmbedding(text: string): Promise<number[]> {
    // Generate a pseudo-random deterministic vector of length 128 for testing
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Array.from({ length: 128 }, (_, i) => Math.sin(hash + i));
  }
}

export class MockVectorSearchProvider implements VectorSearchProvider {
  public name = 'CoalIntelligence Semantic Vector Search';

  public async search(embedding: number[], topK: number): Promise<EvidenceCitation[]> {
    return db.aiQueries[0].evidence.slice(0, topK);
  }
}

export class MockOCRProvider implements OCRProvider {
  public name = 'CoalIntelligence Enterprise OCR & Table Vision (Tesseract + CMPDI Form Parser)';

  public async processDocument(buffer: Buffer, mimeType: string): Promise<{
    pages: { pageNumber: number; text: string; confidence: number }[];
    entities: ExtractedEntity[];
    tables: ExtractedTable[];
  }> {
    return {
      pages: [
        {
          pageNumber: 1,
          text: 'CENTRAL MINE PLANNING & DESIGN INSTITUTE LIMITED\nGEOLOGICAL & OPERATIONAL PRODUCTION LOG\nTotal Pithead Output: 52.4 MT\nStripping Ratio: 1.34 M.Cu.M/Tonne\nSeam Thickness: 18.2 m',
          confidence: 0.985
        },
        {
          pageNumber: 2,
          text: 'TABLE 4: SEAM-WISE EXTRACTABLE RESERVES AND RUN-OF-MINE (ROM) PRODUCTION\nUpper Seam: 24.1 MT (G11 Grade)\nLower Seam: 28.3 MT (G12 Grade)\nTotal Moisture: 8.4%\nAsh Content: 38.2%',
          confidence: 0.978
        }
      ],
      entities: [
        {
          id: `ent-${Date.now()}-1`,
          category: 'Production',
          name: 'Annual Coal Production',
          value: '52.4 MT',
          unit: 'MT',
          confidence: 0.99,
          page: 1,
          contextSnippet: 'Total Pithead Output certified at 52.4 MT'
        },
        {
          id: `ent-${Date.now()}-2`,
          category: 'Mining',
          name: 'Stripping Ratio',
          value: '1.34',
          unit: 'M.Cu.M/Tonne',
          confidence: 0.97,
          page: 1,
          contextSnippet: 'Stripping Ratio: 1.34 M.Cu.M/Tonne'
        },
        {
          id: `ent-${Date.now()}-3`,
          category: 'Geological',
          name: 'Composite Seam Thickness',
          value: '18.2 m',
          unit: 'metres',
          confidence: 0.98,
          page: 1,
          contextSnippet: 'Seam Thickness: 18.2 m'
        }
      ],
      tables: [
        {
          id: `tbl-${Date.now()}-1`,
          title: 'Seam-wise Extractable Coal Reserves (ROM)',
          page: 2,
          headers: ['Seam Horizon', 'Reserve (MT)', 'Coal Grade', 'Ash %', 'Moisture %'],
          rows: [
            ['Upper Kusmunda', 24.1, 'G11', '36.8%', '8.2%'],
            ['Lower Kusmunda', 28.3, 'G12', '39.4%', '8.5%'],
            ['Total / Composite', 52.4, 'G11-G12', '38.2%', '8.4%']
          ],
          confidence: 0.98
        }
      ]
    };
  }
}
