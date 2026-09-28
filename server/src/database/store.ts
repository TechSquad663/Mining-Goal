import { 
  DocumentItem, 
  ProductionMetric, 
  ValidationIssue, 
  SourceReliabilityRank, 
  AIQueryHistory, 
  ReportItem, 
  AuditLogItem, 
  TopicItem, 
  User, 
  NotificationItem 
} from '../types/index.js';

class InMemoryStore {
  public users: User[] = [
    {
      id: 'usr-1',
      name: 'Dr. Rajeshwar Sharma',
      email: 'rajeshwar.sharma@cmpdi.co.in',
      role: 'SUPER_ADMIN',
      department: 'Geological & Mine Planning Division',
      subsidiary: 'CMPDI HQ Ranchi',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    },
    {
      id: 'usr-2',
      name: 'Sunil K. Verma',
      email: 'skverma.officer@coalindia.in',
      role: 'OFFICER',
      department: 'Production & Safety Directorate',
      subsidiary: 'Coal India HQ Kolkata',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      id: 'usr-3',
      name: 'Pooja Bannerjee',
      email: 'pbannerjee.analyst@secl.gov.in',
      role: 'ANALYST',
      department: 'Statistical & Performance Monitoring Cell',
      subsidiary: 'SECL Bilaspur',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    },
    {
      id: 'usr-4',
      name: 'Amitabh Sengupta',
      email: 'asengupta.auditor@cag.gov.in',
      role: 'AUDITOR',
      department: 'Principal Director of Audit (Mines)',
      subsidiary: 'Ministry of Coal / C&AG',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    }
  ];

  public currentUser: User = this.users[0];

  public sourceReliability: SourceReliabilityRank[] = [
    { rank: 1, documentType: 'Annual Report', reliabilityScore: 98, description: 'Audited & Parliamentary tabled statutory report' },
    { rank: 2, documentType: 'Board Resolution', reliabilityScore: 95, description: 'Apex corporate governance certified documents' },
    { rank: 3, documentType: 'Form IV Production Return', reliabilityScore: 92, description: 'Statutory monthly mine-level verified return submitted to Coal Controller' },
    { rank: 4, documentType: 'Geological Report', reliabilityScore: 90, description: 'CMPDI verified drilling borehole & seam evaluation report' },
    { rank: 5, documentType: 'Mine Plan', reliabilityScore: 88, description: 'Approved statutory 5-year mining & reclamation plan' },
    { rank: 6, documentType: 'Parliamentary Question', reliabilityScore: 86, description: 'Ministerial signed reply to Lok Sabha / Rajya Sabha' },
    { rank: 7, documentType: 'Safety Audit', reliabilityScore: 84, description: 'DGMS / Internal Safety Directorate inspection bulletin' },
    { rank: 8, documentType: 'Environmental Clearance', reliabilityScore: 82, description: 'MoEFCC Expert Appraisal Committee approved baseline and compliance data' },
    { rank: 9, documentType: 'Cost & Financial Statement', reliabilityScore: 78, description: 'Internal cost auditing & reconciliation sheet' }
  ];

  public documents: DocumentItem[] = [
    {
      id: 'doc-01',
      fileName: 'CIL_Annual_Report_Accounts_FY2023_24.pdf',
      fileSize: 18450210,
      fileFormat: 'PDF',
      documentType: 'Annual Report',
      subsidiary: 'Coal India Ltd (CIL)',
      financialYear: '2023-24',
      confidentiality: 'PUBLIC',
      tags: ['CIL', 'Production', 'Despatch', 'Financials', 'Statutory'],
      uploadDate: '2024-07-15T10:30:00Z',
      uploadedBy: 'Dr. Rajeshwar Sharma',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 384,
      extractedEntitiesCount: 1420,
      validationStatus: 'VERIFIED',
      summary: 'Comprehensive annual statutory report of Coal India Limited for FY 2023-24 detailing 773.6 MT aggregate production, financial performance, capital expenditure, and subsidiary breakdowns.'
    },
    {
      id: 'doc-02',
      fileName: 'Gevra_70MTY_Mega_Project_Detailed_Project_Report_CMPDI.pdf',
      fileSize: 24910400,
      fileFormat: 'PDF',
      documentType: 'Mine Plan',
      subsidiary: 'SECL',
      mine: 'Gevra OCP',
      region: 'Korba Coalfield',
      financialYear: '2023-24',
      confidentiality: 'RESTRICTED',
      tags: ['Gevra', 'Expansion', '70MTY', 'Surface Miner', 'DPR', 'CMPDI'],
      uploadDate: '2024-06-10T14:15:00Z',
      uploadedBy: 'Pooja Bannerjee',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 248,
      extractedEntitiesCount: 890,
      validationStatus: 'VERIFIED',
      summary: 'DPR prepared by CMPDI RI-V Bilaspur for scaling Gevra Opencast Project capacity from 52.5 MTY to 70 MTY, incorporating 42 cum rope shovels and in-pit crushing & conveying system.'
    },
    {
      id: 'doc-03',
      fileName: 'SECL_Operational_Review_FY2022_23.pdf',
      fileSize: 12100800,
      fileFormat: 'PDF',
      documentType: 'Annual Report',
      subsidiary: 'SECL',
      region: 'Chhattisgarh',
      financialYear: '2022-23',
      confidentiality: 'PUBLIC',
      tags: ['SECL', 'Korba', 'Sohagpur', 'Production', 'OBR'],
      uploadDate: '2023-08-12T09:20:00Z',
      uploadedBy: 'Pooja Bannerjee',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 196,
      extractedEntitiesCount: 650,
      validationStatus: 'CONFLICT_DETECTED',
      summary: 'SECL standalone operations review reporting 167.0 MT coal production, 230 M.Cu.M overburden removal, and mine-wise stripping ratios across Korba and Mand-Raigarh coalfields.'
    },
    {
      id: 'doc-04',
      fileName: 'Form_IV_Monthly_Coal_Return_Gevra_March_2024.xlsx',
      fileSize: 3410000,
      fileFormat: 'XLSX',
      documentType: 'Form IV Production Return',
      subsidiary: 'SECL',
      mine: 'Gevra OCP',
      region: 'Korba',
      financialYear: '2023-24',
      confidentiality: 'RESTRICTED',
      tags: ['Form IV', 'Monthly', 'Gevra', 'Coal Controller', 'Reconciliation'],
      uploadDate: '2024-04-05T11:45:00Z',
      uploadedBy: 'Sunil K. Verma',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 18,
      extractedEntitiesCount: 240,
      validationStatus: 'VERIFIED',
      summary: 'Statutory monthly reconciliation for Gevra Open Cast Mine filed with Coal Controller Organisation. Records March 2024 dispatch of 5.82 MT and fiscal total of 59.2 MT.'
    },
    {
      id: 'doc-05',
      fileName: 'MCL_Production_Performance_FY2023_24.pdf',
      fileSize: 14205000,
      fileFormat: 'PDF',
      documentType: 'Annual Report',
      subsidiary: 'MCL',
      region: 'Odisha (Talcher & Ib Valley)',
      financialYear: '2023-24',
      confidentiality: 'PUBLIC',
      tags: ['MCL', 'Talcher', 'Ib Valley', 'Bhubaneswari', '206MT'],
      uploadDate: '2024-07-20T16:00:00Z',
      uploadedBy: 'Sunil K. Verma',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 220,
      extractedEntitiesCount: 810,
      validationStatus: 'VERIFIED',
      summary: 'Mahanadi Coalfields Limited annual review noting historic achievement of 206.1 MT raw coal production, making MCL the top producing subsidiary of CIL.'
    },
    {
      id: 'doc-06',
      fileName: 'NCL_Singrauli_Geological_Exploration_CMPDI_2022.pdf',
      fileSize: 31050000,
      fileFormat: 'PDF',
      documentType: 'Geological Report',
      subsidiary: 'NCL',
      mine: 'Jayant OCP',
      region: 'Singrauli Coalfield',
      financialYear: '2022-23',
      confidentiality: 'CONFIDENTIAL',
      tags: ['Singrauli', 'Geology', 'Purewa Seam', 'Turra Seam', 'CMPDI', 'Borehole'],
      uploadDate: '2023-04-18T10:10:00Z',
      uploadedBy: 'Dr. Rajeshwar Sharma',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 312,
      extractedEntitiesCount: 1180,
      validationStatus: 'VERIFIED',
      summary: 'Geological appraisal note on Jayant Block IV evaluating deep reserves of Purewa and Turra seams, estimating 345 MT of proven thermal grade power coal.'
    },
    {
      id: 'doc-07',
      fileName: 'Lok_Sabha_Starred_Question_Q142_Coal_Production_Safety.pdf',
      fileSize: 1450000,
      fileFormat: 'PDF',
      documentType: 'Parliamentary Question',
      subsidiary: 'Coal India Ltd (CIL)',
      financialYear: '2023-24',
      confidentiality: 'PUBLIC',
      tags: ['Lok Sabha', 'Parliament', 'Fatalities', 'Safety', 'Target vs Actual'],
      uploadDate: '2024-03-12T13:00:00Z',
      uploadedBy: 'Amitabh Sengupta',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 14,
      extractedEntitiesCount: 88,
      validationStatus: 'VERIFIED',
      summary: 'Minister of Coal reply to Lok Sabha Starred Question 142 regarding subsidiary-wise fatality rates per MT, adoption of safety management systems, and target achievements.'
    },
    {
      id: 'doc-08',
      fileName: 'Kusmunda_OCP_Expansion_Environmental_Clearance_MoEFCC.pdf',
      fileSize: 16800000,
      fileFormat: 'PDF',
      documentType: 'Environmental Clearance',
      subsidiary: 'SECL',
      mine: 'Kusmunda OCP',
      region: 'Korba',
      financialYear: '2023-24',
      confidentiality: 'PUBLIC',
      tags: ['MoEFCC', 'EC', 'Kusmunda', 'Reclamation', 'Air Quality', 'Hasdeo River'],
      uploadDate: '2024-02-14T11:20:00Z',
      uploadedBy: 'Pooja Bannerjee',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 84,
      extractedEntitiesCount: 320,
      validationStatus: 'VERIFIED',
      summary: 'MoEFCC Expert Appraisal Committee granted Environmental Clearance for expansion of Kusmunda Opencast Coal Mining Project from 50 MTY to 62.5 MTY.'
    },
    {
      id: 'doc-09',
      fileName: 'DGMS_Annual_Safety_Audit_Jharia_Coalfield_2023.pdf',
      fileSize: 8900000,
      fileFormat: 'PDF',
      documentType: 'Safety Audit',
      subsidiary: 'BCCL',
      mine: 'Moonidih Underground',
      region: 'Jharia Coalfield',
      financialYear: '2022-23',
      confidentiality: 'RESTRICTED',
      tags: ['DGMS', 'Safety', 'BCCL', 'Moonidih', 'Underground', 'Methane'],
      uploadDate: '2023-11-28T15:30:00Z',
      uploadedBy: 'Amitabh Sengupta',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 142,
      extractedEntitiesCount: 460,
      validationStatus: 'PENDING_REVIEW',
      summary: 'Directorate General of Mines Safety compliance audit on Moonidih deep mechanized longwall project covering methane drainage, gas monitoring, and strata control.'
    },
    {
      id: 'doc-10',
      fileName: 'Form_IV_Monthly_Coal_Return_Kusmunda_March_2021.xlsx',
      fileSize: 3100000,
      fileFormat: 'XLSX',
      documentType: 'Form IV Production Return',
      subsidiary: 'SECL',
      mine: 'Kusmunda OCP',
      region: 'Korba',
      financialYear: '2020-21',
      confidentiality: 'RESTRICTED',
      tags: ['Form IV', 'Kusmunda', 'FY21', 'Anomaly', 'Monsoon Flooding'],
      uploadDate: '2021-04-12T09:00:00Z',
      uploadedBy: 'Pooja Bannerjee',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 16,
      extractedEntitiesCount: 195,
      validationStatus: 'CONFLICT_DETECTED',
      summary: 'Form IV return reflecting severe monsoon flooding in pit bottom during August-October 2020 leading to annual shortfall against target (33.8 MT actual vs 45.0 MT target).'
    },
    {
      id: 'doc-11',
      fileName: 'CCL_North_Karanpura_Amrapali_Ashok_Dispatch_Report.pdf',
      fileSize: 9400000,
      fileFormat: 'PDF',
      documentType: 'Form IV Production Return',
      subsidiary: 'CCL',
      mine: 'Amrapali OCP',
      region: 'North Karanpura',
      financialYear: '2023-24',
      confidentiality: 'PUBLIC',
      tags: ['CCL', 'Amrapali', 'Ashok', 'Tori-Shivpur Rail Link', 'Dispatch'],
      uploadDate: '2024-05-18T10:45:00Z',
      uploadedBy: 'Sunil K. Verma',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 76,
      extractedEntitiesCount: 280,
      validationStatus: 'VERIFIED',
      summary: 'Performance analysis of Amrapali and Ashok projects in CCL showing 34.2 MT coal dispatch via the newly commissioned Tori-Shivpur double line railway corridor.'
    },
    {
      id: 'doc-12',
      fileName: 'BCCL_Coking_Coal_Augmentation_Vision_2030.pdf',
      fileSize: 15600000,
      fileFormat: 'PDF',
      documentType: 'Mine Plan',
      subsidiary: 'BCCL',
      region: 'Jharia Coalfield',
      financialYear: '2023-24',
      confidentiality: 'RESTRICTED',
      tags: ['BCCL', 'Coking Coal', 'Import Substitution', 'Washery', 'Madhuban'],
      uploadDate: '2024-03-22T14:10:00Z',
      uploadedBy: 'Sunil K. Verma',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 188,
      extractedEntitiesCount: 510,
      validationStatus: 'VERIFIED',
      summary: 'Strategic roadmap for augmenting domestic prime and medium coking coal supply to steel plants, including renovation of Madhuban and Dugda washeries.'
    },
    {
      id: 'doc-13',
      fileName: 'CMPDI_Regional_Exploration_Block_XII_Ib_Valley.pdf',
      fileSize: 28900000,
      fileFormat: 'PDF',
      documentType: 'Geological Report',
      subsidiary: 'MCL',
      mine: 'Lakhanpur OCP',
      region: 'Ib Valley Coalfield',
      financialYear: '2021-22',
      confidentiality: 'CONFIDENTIAL',
      tags: ['CMPDI', 'Ib Valley', 'Lajkura Seam', 'Hingir', 'Reserves', 'Core Drilling'],
      uploadDate: '2022-09-14T11:30:00Z',
      uploadedBy: 'Dr. Rajeshwar Sharma',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 260,
      extractedEntitiesCount: 940,
      validationStatus: 'VERIFIED',
      summary: 'CMPDI Regional Institute VII evaluation establishing 812 MT geological resources of G12-G14 power coal in Ib Valley down to 300m depth.'
    },
    {
      id: 'doc-14',
      fileName: 'NCL_Jayant_Dragline_Deployment_Overburden_Audit.pdf',
      fileSize: 11300000,
      fileFormat: 'PDF',
      documentType: 'Safety Audit',
      subsidiary: 'NCL',
      mine: 'Jayant OCP',
      region: 'Singrauli',
      financialYear: '2023-24',
      confidentiality: 'PUBLIC',
      tags: ['NCL', 'Jayant', 'Dragline', 'Walking Dragline', 'OBR', 'Equipment Efficiency'],
      uploadDate: '2024-04-30T12:00:00Z',
      uploadedBy: 'Pooja Bannerjee',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 114,
      extractedEntitiesCount: 390,
      validationStatus: 'VERIFIED',
      summary: 'Heavy earthmoving machinery audit assessing availability and utilization of 24/96 walking draglines operating in Singrauli basin.'
    },
    {
      id: 'doc-15',
      fileName: 'MoC_Parliamentary_Standing_Committee_Report_34.pdf',
      fileSize: 7200000,
      fileFormat: 'PDF',
      documentType: 'Parliamentary Question',
      subsidiary: 'Coal India Ltd (CIL)',
      financialYear: '2022-23',
      confidentiality: 'PUBLIC',
      tags: ['Standing Committee', 'Parliament', 'Import Reduction', 'Captive Mines'],
      uploadDate: '2023-03-15T15:20:00Z',
      uploadedBy: 'Amitabh Sengupta',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 92,
      extractedEntitiesCount: 310,
      validationStatus: 'VERIFIED',
      summary: 'Parliamentary Standing Committee on Coal, Mines and Steel review of Coal India 1 Billion Tonne production trajectory and environmental compliance.'
    },
    {
      id: 'doc-16',
      fileName: 'CIL_Safety_Committee_Directives_Monsoon_Preparedness_2023.pdf',
      fileSize: 4500000,
      fileFormat: 'PDF',
      documentType: 'Safety Audit',
      subsidiary: 'Coal India Ltd (CIL)',
      financialYear: '2023-24',
      confidentiality: 'PUBLIC',
      tags: ['Monsoon', 'Safety Directive', 'Sump Capacity', 'Pit Slope Stability', 'DGMS'],
      uploadDate: '2023-06-01T09:30:00Z',
      uploadedBy: 'Sunil K. Verma',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 46,
      extractedEntitiesCount: 160,
      validationStatus: 'VERIFIED',
      summary: 'Corporate safety circular outlining standard operating guidelines for bench dewatering, sump management, and dump slope stability across all opencast mines.'
    },
    {
      id: 'doc-17',
      fileName: 'WCL_Nagpur_Umrer_Area_Hydrogeological_Study.pdf',
      fileSize: 13800000,
      fileFormat: 'PDF',
      documentType: 'Geological Report',
      subsidiary: 'WCL',
      region: 'Wardha Valley / Umrer',
      financialYear: '2022-23',
      confidentiality: 'RESTRICTED',
      tags: ['WCL', 'Hydrogeology', 'Groundwater', 'Umrer', 'Aquifer Depressurization'],
      uploadDate: '2023-01-20T14:40:00Z',
      uploadedBy: 'Dr. Rajeshwar Sharma',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 154,
      extractedEntitiesCount: 420,
      validationStatus: 'VERIFIED',
      summary: 'Hydrogeological modeling by CMPDI RI-IV Nagpur for deep opencast mining safety under Motur sandstone aquifer conditions.'
    },
    {
      id: 'doc-18',
      fileName: 'SECL_Dipka_Expansion_Form_I_EIA_EMP.pdf',
      fileSize: 22100000,
      fileFormat: 'PDF',
      documentType: 'Environmental Clearance',
      subsidiary: 'SECL',
      mine: 'Dipka OCP',
      region: 'Korba',
      financialYear: '2023-24',
      confidentiality: 'PUBLIC',
      tags: ['Dipka', 'EIA', 'EMP', 'Hasdeo', '40MTY', 'Dust Suppression'],
      uploadDate: '2024-01-10T16:15:00Z',
      uploadedBy: 'Pooja Bannerjee',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 278,
      extractedEntitiesCount: 780,
      validationStatus: 'VERIFIED',
      summary: 'Comprehensive Environmental Impact Assessment and Environmental Management Plan for Dipka Expansion up to 40 MTY peak capacity.'
    },
    {
      id: 'doc-19',
      fileName: 'CIL_National_Coal_Inventory_CMPDI_Jan_2024.pdf',
      fileSize: 45000000,
      fileFormat: 'PDF',
      documentType: 'Geological Report',
      subsidiary: 'CMPDI HQ Ranchi',
      financialYear: '2023-24',
      confidentiality: 'PUBLIC',
      tags: ['National Inventory', '389 Billion Tonnes', 'CMPDI', 'Geological Reserves'],
      uploadDate: '2024-05-02T10:00:00Z',
      uploadedBy: 'Dr. Rajeshwar Sharma',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 410,
      extractedEntitiesCount: 1650,
      validationStatus: 'VERIFIED',
      summary: 'Annual official national coal inventory prepared by CMPDI compiling 389.2 Billion Tonnes of geological coal resources across all coal basins of India.'
    },
    {
      id: 'doc-20',
      fileName: 'Talcher_Coalfield_Seam_Reserves_Borehole_Data_CMPDI.pdf',
      fileSize: 33400000,
      fileFormat: 'PDF',
      documentType: 'Geological Report',
      subsidiary: 'MCL',
      mine: 'Bhubaneswari OCP',
      region: 'Talcher Coalfield',
      financialYear: '2023-24',
      confidentiality: 'CONFIDENTIAL',
      tags: ['Talcher', 'Borehole', 'Seam II', 'Seam III', 'Thermal Grade'],
      uploadDate: '2024-02-28T13:30:00Z',
      uploadedBy: 'Dr. Rajeshwar Sharma',
      status: 'INDEXED',
      processingProgress: 100,
      pageCount: 290,
      extractedEntitiesCount: 1040,
      validationStatus: 'VERIFIED',
      summary: 'Detailed seam correlation and core drilling log data from 48 deep boreholes in Bhubaneswari Block, demonstrating 18.4m aggregate coal seam thickness.'
    }
  ];

  // 10 Years of Coal Production History (FY16 to FY25) - in Million Tonnes (MT)
  public historicalProduction: {
    financialYear: string;
    target: number;
    actual: number;
    overburdenMcuM: number;
    dispatch: number;
    subsidiaryBreakdown: { subsidiary: string; actual: number; target: number }[];
  }[] = [
    {
      financialYear: '2015-16',
      target: 550.0,
      actual: 538.8,
      overburdenMcuM: 1148.0,
      dispatch: 534.5,
      subsidiaryBreakdown: [
        { subsidiary: 'SECL', actual: 137.9, target: 137.0 },
        { subsidiary: 'MCL', actual: 130.4, target: 140.0 },
        { subsidiary: 'NCL', actual: 80.2, target: 80.0 },
        { subsidiary: 'CCL', actual: 61.3, target: 67.0 },
        { subsidiary: 'WCL', actual: 44.9, target: 45.1 },
        { subsidiary: 'BCCL', actual: 35.9, target: 37.0 },
        { subsidiary: 'ECL', actual: 40.2, target: 40.0 },
        { subsidiary: 'NEC', actual: 0.5, target: 0.8 },
      ]
    },
    {
      financialYear: '2016-17',
      target: 598.6,
      actual: 554.1,
      overburdenMcuM: 1156.4,
      dispatch: 543.3,
      subsidiaryBreakdown: [
        { subsidiary: 'SECL', actual: 140.0, target: 149.7 },
        { subsidiary: 'MCL', actual: 139.2, target: 148.0 },
        { subsidiary: 'NCL', actual: 84.1, target: 82.0 },
        { subsidiary: 'CCL', actual: 67.1, target: 70.6 },
        { subsidiary: 'WCL', actual: 45.6, target: 48.0 },
        { subsidiary: 'BCCL', actual: 34.5, target: 37.0 },
        { subsidiary: 'ECL', actual: 40.5, target: 44.0 },
        { subsidiary: 'NEC', actual: 0.6, target: 0.8 },
      ]
    },
    {
      financialYear: '2017-18',
      target: 600.0,
      actual: 567.4,
      overburdenMcuM: 1262.3,
      dispatch: 580.3,
      subsidiaryBreakdown: [
        { subsidiary: 'SECL', actual: 144.7, target: 153.0 },
        { subsidiary: 'MCL', actual: 143.1, target: 146.0 },
        { subsidiary: 'NCL', actual: 93.0, target: 89.0 },
        { subsidiary: 'CCL', actual: 67.4, target: 67.0 },
        { subsidiary: 'WCL', actual: 46.3, target: 46.5 },
        { subsidiary: 'BCCL', actual: 32.6, target: 35.5 },
        { subsidiary: 'ECL', actual: 43.6, target: 44.0 },
        { subsidiary: 'NEC', actual: 0.7, target: 0.8 },
      ]
    },
    {
      financialYear: '2018-19',
      target: 610.0,
      actual: 606.9,
      overburdenMcuM: 1394.0,
      dispatch: 608.1,
      subsidiaryBreakdown: [
        { subsidiary: 'SECL', actual: 157.4, target: 160.0 },
        { subsidiary: 'MCL', actual: 144.1, target: 146.0 },
        { subsidiary: 'NCL', actual: 101.5, target: 100.0 },
        { subsidiary: 'CCL', actual: 70.2, target: 70.0 },
        { subsidiary: 'WCL', actual: 53.2, target: 51.5 },
        { subsidiary: 'BCCL', actual: 31.0, target: 32.5 },
        { subsidiary: 'ECL', actual: 49.8, target: 49.0 },
        { subsidiary: 'NEC', actual: 0.7, target: 1.0 },
      ]
    },
    {
      financialYear: '2019-20',
      target: 660.0,
      actual: 602.1,
      overburdenMcuM: 1458.0,
      dispatch: 581.7,
      subsidiaryBreakdown: [
        { subsidiary: 'SECL', actual: 150.5, target: 165.0 },
        { subsidiary: 'MCL', actual: 140.4, target: 160.0 },
        { subsidiary: 'NCL', actual: 108.1, target: 106.3 },
        { subsidiary: 'CCL', actual: 66.9, target: 76.4 },
        { subsidiary: 'WCL', actual: 57.6, target: 56.0 },
        { subsidiary: 'BCCL', actual: 27.7, target: 31.5 },
        { subsidiary: 'ECL', actual: 50.4, target: 51.0 },
        { subsidiary: 'NEC', actual: 0.5, target: 0.8 },
      ]
    },
    {
      financialYear: '2020-21',
      target: 653.0,
      actual: 596.2,
      overburdenMcuM: 1344.0,
      dispatch: 573.8,
      subsidiaryBreakdown: [
        { subsidiary: 'SECL', actual: 150.6, target: 172.0 },
        { subsidiary: 'MCL', actual: 148.0, target: 173.0 },
        { subsidiary: 'NCL', actual: 115.0, target: 113.0 },
        { subsidiary: 'CCL', actual: 65.4, target: 72.5 },
        { subsidiary: 'WCL', actual: 50.3, target: 56.0 },
        { subsidiary: 'BCCL', actual: 24.7, target: 28.5 },
        { subsidiary: 'ECL', actual: 45.0, target: 47.0 },
        { subsidiary: 'NEC', actual: 0.1, target: 0.2 },
      ]
    },
    {
      financialYear: '2021-22',
      target: 670.0,
      actual: 622.6,
      overburdenMcuM: 1362.5,
      dispatch: 661.9,
      subsidiaryBreakdown: [
        { subsidiary: 'SECL', actual: 142.5, target: 172.0 },
        { subsidiary: 'MCL', actual: 168.2, target: 163.0 },
        { subsidiary: 'NCL', actual: 122.4, target: 119.0 },
        { subsidiary: 'CCL', actual: 68.8, target: 74.0 },
        { subsidiary: 'WCL', actual: 57.7, target: 60.0 },
        { subsidiary: 'BCCL', actual: 30.5, target: 32.0 },
        { subsidiary: 'ECL', actual: 32.4, target: 40.0 },
        { subsidiary: 'NEC', actual: 0.1, target: 0.2 },
      ]
    },
    {
      financialYear: '2022-23',
      target: 700.0,
      actual: 703.2,
      overburdenMcuM: 1656.7,
      dispatch: 694.7,
      subsidiaryBreakdown: [
        { subsidiary: 'MCL', actual: 193.3, target: 176.0 },
        { subsidiary: 'SECL', actual: 167.0, target: 182.0 },
        { subsidiary: 'NCL', actual: 131.0, target: 122.0 },
        { subsidiary: 'CCL', actual: 76.1, target: 76.0 },
        { subsidiary: 'WCL', actual: 64.3, target: 62.0 },
        { subsidiary: 'BCCL', actual: 36.1, target: 32.0 },
        { subsidiary: 'ECL', actual: 35.1, target: 40.0 },
        { subsidiary: 'NEC', actual: 0.2, target: 0.2 },
      ]
    },
    {
      financialYear: '2023-24',
      target: 780.0,
      actual: 773.6,
      overburdenMcuM: 1965.2,
      dispatch: 753.5,
      subsidiaryBreakdown: [
        { subsidiary: 'MCL', actual: 206.1, target: 204.0 },
        { subsidiary: 'SECL', actual: 187.0, target: 197.0 },
        { subsidiary: 'NCL', actual: 141.5, target: 139.0 },
        { subsidiary: 'CCL', actual: 86.0, target: 84.0 },
        { subsidiary: 'WCL', actual: 69.1, target: 68.0 },
        { subsidiary: 'BCCL', actual: 41.1, target: 41.0 },
        { subsidiary: 'ECL', actual: 42.6, target: 47.0 },
        { subsidiary: 'NEC', actual: 0.2, target: 0.3 },
      ]
    },
    {
      financialYear: '2024-25 (Projected/YTD)',
      target: 838.0,
      actual: 825.4,
      overburdenMcuM: 2150.0,
      dispatch: 810.0,
      subsidiaryBreakdown: [
        { subsidiary: 'MCL', actual: 220.0, target: 220.0 },
        { subsidiary: 'SECL', actual: 205.0, target: 212.0 },
        { subsidiary: 'NCL', actual: 148.0, target: 145.0 },
        { subsidiary: 'CCL', actual: 95.0, target: 94.0 },
        { subsidiary: 'WCL', actual: 72.0, target: 71.0 },
        { subsidiary: 'BCCL', actual: 44.0, target: 45.0 },
        { subsidiary: 'ECL', actual: 41.0, target: 50.0 },
        { subsidiary: 'NEC', actual: 0.4, target: 0.5 },
      ]
    }
  ];

  // Mine-level master metrics
  public mineMetrics: {
    mine: string;
    subsidiary: string;
    type: 'Opencast' | 'Underground';
    coalfield: string;
    productionFY24: number; // MT
    targetFY24: number;
    obrFY24: number; // M.Cu.M
    strippingRatio: number;
    reserveMT: number;
    seams: string[];
    grade: string;
  }[] = [
    { mine: 'Gevra OCP', subsidiary: 'SECL', type: 'Opencast', coalfield: 'Korba', productionFY24: 59.2, targetFY24: 58.0, obrFY24: 78.4, strippingRatio: 1.32, reserveMT: 950, seams: ['Lower Kusmunda', 'Upper Kusmunda'], grade: 'G11' },
    { mine: 'Kusmunda OCP', subsidiary: 'SECL', type: 'Opencast', coalfield: 'Korba', productionFY24: 48.5, targetFY24: 46.0, obrFY24: 64.2, strippingRatio: 1.32, reserveMT: 720, seams: ['Kusmunda Seam'], grade: 'G11' },
    { mine: 'Dipka OCP', subsidiary: 'SECL', type: 'Opencast', coalfield: 'Korba', productionFY24: 38.6, targetFY24: 40.0, obrFY24: 52.1, strippingRatio: 1.35, reserveMT: 480, seams: ['Dipka Main'], grade: 'G10' },
    { mine: 'Jayant OCP', subsidiary: 'NCL', type: 'Opencast', coalfield: 'Singrauli', productionFY24: 26.5, targetFY24: 25.0, obrFY24: 68.9, strippingRatio: 2.60, reserveMT: 390, seams: ['Purewa', 'Turra'], grade: 'G9' },
    { mine: 'Dudhichua OCP', subsidiary: 'NCL', type: 'Opencast', coalfield: 'Singrauli', productionFY24: 24.8, targetFY24: 24.0, obrFY24: 62.4, strippingRatio: 2.51, reserveMT: 310, seams: ['Purewa Top', 'Turra'], grade: 'G9' },
    { mine: 'Nigahi OCP', subsidiary: 'NCL', type: 'Opencast', coalfield: 'Singrauli', productionFY24: 23.2, targetFY24: 22.5, obrFY24: 58.0, strippingRatio: 2.50, reserveMT: 280, seams: ['Turra', 'Purewa Bottom'], grade: 'G8' },
    { mine: 'Bhubaneswari OCP', subsidiary: 'MCL', type: 'Opencast', coalfield: 'Talcher', productionFY24: 31.4, targetFY24: 30.0, obrFY24: 28.2, strippingRatio: 0.90, reserveMT: 450, seams: ['Seam II', 'Seam III'], grade: 'G12' },
    { mine: 'Lakhanpur OCP', subsidiary: 'MCL', type: 'Opencast', coalfield: 'Ib Valley', productionFY24: 22.0, targetFY24: 21.0, obrFY24: 26.4, strippingRatio: 1.20, reserveMT: 320, seams: ['Lajkura Seam'], grade: 'G13' },
    { mine: 'Bharatpur OCP', subsidiary: 'MCL', type: 'Opencast', coalfield: 'Talcher', productionFY24: 20.5, targetFY24: 20.0, obrFY24: 24.6, strippingRatio: 1.20, reserveMT: 210, seams: ['Bharatpur Top'], grade: 'G12' },
    { mine: 'Amrapali OCP', subsidiary: 'CCL', type: 'Opencast', coalfield: 'North Karanpura', productionFY24: 28.0, targetFY24: 26.0, obrFY24: 36.4, strippingRatio: 1.30, reserveMT: 540, seams: ['Dakra', 'Bukbuka'], grade: 'G11' },
    { mine: 'Ashok OCP', subsidiary: 'CCL', type: 'Opencast', coalfield: 'North Karanpura', productionFY24: 18.5, targetFY24: 17.5, obrFY24: 25.9, strippingRatio: 1.40, reserveMT: 260, seams: ['Seam I', 'Seam II'], grade: 'G11' },
    { mine: 'Piparwar OCP', subsidiary: 'CCL', type: 'Opencast', coalfield: 'North Karanpura', productionFY24: 14.2, targetFY24: 15.0, obrFY24: 22.7, strippingRatio: 1.60, reserveMT: 180, seams: ['Piparwar Seam'], grade: 'G10' },
    { mine: 'Rajmahal OCP', subsidiary: 'ECL', type: 'Opencast', coalfield: 'Rajmahal', productionFY24: 16.8, targetFY24: 18.0, obrFY24: 33.6, strippingRatio: 2.00, reserveMT: 290, seams: ['Hura Seam', 'Simlong'], grade: 'G13' },
    { mine: 'Moonidih UG', subsidiary: 'BCCL', type: 'Underground', coalfield: 'Jharia', productionFY24: 1.85, targetFY24: 2.10, obrFY24: 0.0, strippingRatio: 0.0, reserveMT: 140, seams: ['Seam XVI-T', 'Seam XVII'], grade: 'Steel-I Coking' },
    { mine: 'Kusunda OCP', subsidiary: 'BCCL', type: 'Opencast', coalfield: 'Jharia', productionFY24: 6.8, targetFY24: 7.0, obrFY24: 21.7, strippingRatio: 3.20, reserveMT: 95, seams: ['Seam IX', 'Seam X'], grade: 'Washery-II' }
  ];

  public validationIssues: ValidationIssue[] = [
    {
      id: 'val-101',
      metric: 'Coal Production',
      financialYear: '2022-23',
      subsidiary: 'SECL',
      mine: 'Kusmunda OCP',
      severity: 'CRITICAL',
      status: 'PENDING',
      conflictDescription: 'Discrepancy of 0.40 MT detected between SECL Operational Review and Coal Controller Form IV return for Kusmunda OCP.',
      sources: [
        {
          sourceId: 'src-1',
          documentId: 'doc-03',
          documentName: 'SECL_Operational_Review_FY2022_23.pdf',
          documentType: 'Annual Report',
          page: 63,
          value: 43.20,
          unit: 'MT',
          reliabilityScore: 98,
          publishDate: '2023-08-12',
          snippet: '...Kusmunda Opencast Project achieved total dispatchable coal production of 43.20 MT during the fiscal year under review, representing 98.2% target fulfillment...'
        },
        {
          sourceId: 'src-2',
          documentId: 'doc-10',
          documentName: 'Form_IV_Monthly_Coal_Return_Kusmunda_March_2021.xlsx',
          documentType: 'Form IV Production Return',
          page: 4,
          value: 43.60,
          unit: 'MT',
          reliabilityScore: 92,
          publishDate: '2023-04-10',
          snippet: '...Column 7 (Gross Pithead Weight): 43,604,110 Tonnes gross mined prior to washery reject reconciliation and moisture factor adjustment...'
        }
      ]
    },
    {
      id: 'val-102',
      metric: 'Overburden Removal (OBR)',
      financialYear: '2023-24',
      subsidiary: 'NCL',
      mine: 'Jayant OCP',
      severity: 'WARNING',
      status: 'PENDING',
      conflictDescription: 'Variance in reported Overburden Removal volume: Dragline Log Audit reports 68.9 M.Cu.M vs Annual Review reporting 66.8 M.Cu.M.',
      sources: [
        {
          sourceId: 'src-3',
          documentId: 'doc-14',
          documentName: 'NCL_Jayant_Dragline_Deployment_Overburden_Audit.pdf',
          documentType: 'Safety Audit',
          page: 28,
          value: 68.90,
          unit: 'M.Cu.M',
          reliabilityScore: 84,
          publishDate: '2024-04-30',
          snippet: '...Composite surveyor triangulation for Jayant pit blocks indicated total volume displaced of 68.90 Million Cubic Metres including re-handled dump material...'
        },
        {
          sourceId: 'src-4',
          documentId: 'doc-01',
          documentName: 'CIL_Annual_Report_Accounts_FY2023_24.pdf',
          documentType: 'Annual Report',
          page: 112,
          value: 66.80,
          unit: 'M.Cu.M',
          reliabilityScore: 98,
          publishDate: '2024-07-15',
          snippet: '...NCL subsidiary table: Jayant OCP Net Overburden Removal audited at 66.80 M.Cu.M (excluding 2.1 M.Cu.M internal rehandling)...'
        }
      ]
    },
    {
      id: 'val-103',
      metric: 'Geological Reserve (Proven)',
      financialYear: '2022-23',
      subsidiary: 'NCL',
      mine: 'Jayant OCP',
      severity: 'WARNING',
      status: 'RESOLVED',
      conflictDescription: 'Discrepancy in Turra and Purewa seam reserve estimation between regional CMPDI report and mine-level 5-year lease plan.',
      sources: [
        {
          sourceId: 'src-5',
          documentId: 'doc-06',
          documentName: 'NCL_Singrauli_Geological_Exploration_CMPDI_2022.pdf',
          documentType: 'Geological Report',
          page: 84,
          value: 345.0,
          unit: 'MT',
          reliabilityScore: 90,
          publishDate: '2023-04-18',
          snippet: '...Proven in-situ geological reserve within Jayant boundary demarcated at 345.0 MT based on 32 core drilling boreholes to datum level...',
          isAuthoritative: true
        },
        {
          sourceId: 'src-6',
          documentId: 'doc-15',
          documentName: 'MoC_Parliamentary_Standing_Committee_Report_34.pdf',
          documentType: 'Parliamentary Question',
          page: 41,
          value: 320.0,
          unit: 'MT',
          reliabilityScore: 86,
          publishDate: '2023-03-15',
          snippet: '...Annexure IV: Estimated extractable reserves for Singrauli cluster (Jayant Block) cited at 320 MT under existing lease boundaries...'
        }
      ],
      resolution: {
        acceptedValue: 345.0,
        acceptedSourceId: 'src-5',
        resolvedBy: 'Dr. Rajeshwar Sharma',
        resolvedAt: '2024-05-10T11:00:00Z',
        rationale: 'Accepted CMPDI detailed geological drilling report (345.0 MT in-situ proven) over extractable parliamentary estimate which applied 92% mining recovery factor.'
      }
    },
    {
      id: 'val-104',
      metric: 'Coal Dispatch Target',
      financialYear: '2023-24',
      subsidiary: 'MCL',
      mine: 'Bhubaneswari OCP',
      severity: 'INFO',
      status: 'PENDING',
      conflictDescription: 'Dispatch target discrepancy: Ministry MoU target cited as 30.0 MT vs Subsidiary Internal Budget cited as 32.5 MT.',
      sources: [
        {
          sourceId: 'src-7',
          documentId: 'doc-01',
          documentName: 'CIL_Annual_Report_Accounts_FY2023_24.pdf',
          documentType: 'Annual Report',
          page: 88,
          value: 30.0,
          unit: 'MT',
          reliabilityScore: 98,
          publishDate: '2024-07-15',
          snippet: '...MCL Talcher area targets committed under Department of Public Enterprises MoU: Bhubaneswari 30.0 MT...'
        },
        {
          sourceId: 'src-8',
          documentId: 'doc-05',
          documentName: 'MCL_Production_Performance_FY2023_24.pdf',
          documentType: 'Annual Report',
          page: 45,
          value: 32.5,
          unit: 'MT',
          reliabilityScore: 95,
          publishDate: '2024-07-20',
          snippet: '...Internal stretch target set by MCL Board of Directors in Q2 for Bhubaneswari: 32.5 MT to meet NTPC Kaniha demand...'
        }
      ]
    }
  ];

  public aiQueries: AIQueryHistory[] = [
    {
      id: 'aiq-1',
      query: 'Compare production of Gevra and Kusmunda between FY 2018 and FY 2024.',
      answer: 'Gevra and Kusmunda (SECL, Korba Coalfield) are two of India\'s largest opencast coal projects. Between FY 2018-19 and FY 2023-24, Gevra production expanded from 45.2 MT to 59.2 MT (+31.0%), while Kusmunda grew from 36.8 MT to 48.5 MT (+31.8%).\n\nKey Highlights:\n- Peak combined production reached 107.7 MT in FY 2023-24.\n- Lowest production was recorded during FY 2020-21 (Gevra: 49.0 MT, Kusmunda: 33.8 MT) due to extraordinary monsoon pit inundation.',
      timestamp: '2024-08-10T14:22:10Z',
      user: 'Dr. Rajeshwar Sharma',
      responseTimeMs: 820,
      confidence: 0.984,
      evidenceCount: 4,
      dataStatus: 'VERIFIED',
      chartData: {
        type: 'line',
        title: 'Production Trend: Gevra vs Kusmunda (MT)',
        xAxisKey: 'year',
        data: [
          { year: '2018-19', Gevra: 45.2, Kusmunda: 36.8 },
          { year: '2019-20', Gevra: 45.0, Kusmunda: 35.1 },
          { year: '2020-21', Gevra: 49.0, Kusmunda: 33.8 },
          { year: '2021-22', Gevra: 52.5, Kusmunda: 38.0 },
          { year: '2022-23', Gevra: 56.4, Kusmunda: 43.2 },
          { year: '2023-24', Gevra: 59.2, Kusmunda: 48.5 }
        ]
      },
      keyStats: [
        { label: 'Gevra 5-Yr Growth', value: '+31.0%', delta: '+14.0 MT' },
        { label: 'Kusmunda 5-Yr Growth', value: '+31.8%', delta: '+11.7 MT' },
        { label: 'Combined FY24 Output', value: '107.7 MT', delta: 'Highest in Asia' }
      ],
      suggestedFollowUps: [
        'What were the stripping ratios for Gevra and Kusmunda in FY24?',
        'Show parliamentary questions regarding Kusmunda mine safety',
        'Generate an executive briefing report for Korba Coalfield'
      ],
      evidence: [
        {
          id: 'ev-1',
          documentId: 'doc-01',
          documentName: 'CIL_Annual_Report_Accounts_FY2023_24.pdf',
          documentType: 'Annual Report',
          subsidiary: 'CIL',
          mine: 'Gevra OCP',
          page: 94,
          section: 'Subsidiary Production Annexure - SECL',
          rawText: 'Gevra Open Cast Project achieved an all-time record output of 59.20 Million Tonnes in FY 2023-24 against target of 58.00 MT.',
          confidence: 0.99,
          validationStatus: 'VERIFIED'
        },
        {
          id: 'ev-2',
          documentId: 'doc-03',
          documentName: 'SECL_Operational_Review_FY2022_23.pdf',
          documentType: 'Annual Report',
          subsidiary: 'SECL',
          mine: 'Kusmunda OCP',
          page: 63,
          section: 'Korba Area Mine Performance',
          rawText: 'Kusmunda Opencast Project achieved total dispatchable coal production of 43.20 MT during FY 2022-23.',
          confidence: 0.98,
          validationStatus: 'VERIFIED'
        },
        {
          id: 'ev-3',
          documentId: 'doc-04',
          documentName: 'Form_IV_Monthly_Coal_Return_Gevra_March_2024.xlsx',
          documentType: 'Form IV Production Return',
          subsidiary: 'SECL',
          mine: 'Gevra OCP',
          page: 2,
          section: 'Annual Summary Reconciliation',
          rawText: 'Total annual statutory production certified at 59,214,000 Tonnes.',
          confidence: 0.99,
          validationStatus: 'VERIFIED'
        }
      ]
    },
    {
      id: 'aiq-2',
      query: 'Which years were below production targets for Coal India overall?',
      answer: 'Analysis of 10 years of statutory Coal India production records (FY 2015-16 through FY 2024-25) indicates that 6 out of 10 financial years fell below official annual production targets.\n\nSummary of Under-Target Fiscal Years:\n- FY 2015-16: Target 550.0 MT | Actual 538.8 MT (-2.0%)\n- FY 2016-17: Target 598.6 MT | Actual 554.1 MT (-7.4%)\n- FY 2017-18: Target 600.0 MT | Actual 567.4 MT (-5.4%)\n- FY 2019-20: Target 660.0 MT | Actual 602.1 MT (-8.8%)\n- FY 2020-21: Target 653.0 MT | Actual 596.2 MT (-8.7%)\n- FY 2021-22: Target 670.0 MT | Actual 622.6 MT (-7.1%)\n\nNotably, Coal India surpassed targets in FY 2022-23 (703.2 MT vs 700.0 MT target) and achieved 99.2% of target in FY 2023-24 (773.6 MT vs 780.0 MT).',
      timestamp: '2024-08-11T09:15:30Z',
      user: 'Sunil K. Verma',
      responseTimeMs: 640,
      confidence: 0.992,
      evidenceCount: 6,
      dataStatus: 'VERIFIED',
      chartData: {
        type: 'bar',
        title: 'CIL Target vs Actual Production (MT)',
        xAxisKey: 'year',
        data: [
          { year: 'FY16', Target: 550.0, Actual: 538.8 },
          { year: 'FY17', Target: 598.6, Actual: 554.1 },
          { year: 'FY18', Target: 600.0, Actual: 567.4 },
          { year: 'FY19', Target: 610.0, Actual: 606.9 },
          { year: 'FY20', Target: 660.0, Actual: 602.1 },
          { year: 'FY21', Target: 653.0, Actual: 596.2 },
          { year: 'FY22', Target: 670.0, Actual: 622.6 },
          { year: 'FY23', Target: 700.0, Actual: 703.2 },
          { year: 'FY24', Target: 780.0, Actual: 773.6 },
          { year: 'FY25', Target: 838.0, Actual: 825.4 }
        ]
      },
      keyStats: [
        { label: 'Target Deficit Years', value: '6 of 10', delta: 'Highest deficit in FY20 (-8.8%)' },
        { label: 'Target Surplus Year', value: 'FY 2022-23', delta: '+3.2 MT over target' },
        { label: '10-Yr Volume Growth', value: '+53.2%', delta: '538.8 MT -> 825.4 MT' }
      ],
      suggestedFollowUps: [
        'What were the primary factors cited for FY20 and FY21 target shortfalls?',
        'Compare subsidiary performance in FY 2023-24',
        'Export this variance analysis to PDF report'
      ],
      evidence: [
        {
          id: 'ev-4',
          documentId: 'doc-01',
          documentName: 'CIL_Annual_Report_Accounts_FY2023_24.pdf',
          documentType: 'Annual Report',
          subsidiary: 'CIL',
          page: 12,
          section: '10-Year Operational & Financial Highlights',
          rawText: 'Table 1.2: Annual Production against MoU target from 2014-15 to 2023-24 audited numbers.',
          confidence: 0.99,
          validationStatus: 'VERIFIED'
        }
      ]
    }
  ];

  public reports: ReportItem[] = [
    {
      id: 'rep-01',
      title: 'Parliamentary Review: 10-Year Production & Safety Trajectory of CIL Subsidiaries',
      type: 'Parliamentary Response',
      referenceNumber: 'CMPDI/PARL/2024/REV-08',
      status: 'APPROVED',
      createdAt: '2024-07-28T10:00:00Z',
      generatedBy: 'Dr. Rajeshwar Sharma',
      approvedBy: 'Sunil K. Verma',
      approvedAt: '2024-07-29T16:30:00Z',
      subsidiary: 'Coal India Ltd (CIL)',
      timePeriod: 'FY 2014-15 to FY 2023-24',
      evidenceCoverage: 98.4,
      verifiedRecordsPercentage: 97.6,
      sourcesCount: 14,
      comments: [
        {
          id: 'c-1',
          user: 'Sunil K. Verma',
          role: 'OFFICER',
          text: 'Verified with Coal Controller statutory reconciliation for FY24. Approved for onward transmission to Ministry of Coal.',
          timestamp: '2024-07-29T16:30:00Z'
        }
      ],
      sections: [
        {
          id: 's-1',
          title: 'Executive Summary',
          content: 'This official report consolidates statutory production, overburden removal, stripping ratio, and safety audit performance across all seven producing subsidiaries of Coal India Limited over the decade ending FY 2023-24. Domestic coal output advanced from 538.8 MT in FY16 to 773.6 MT in FY24, representing an aggregate expansion of 43.6%.',
          sourcesUsed: ['doc-01', 'doc-07', 'doc-15']
        },
        {
          id: 's-2',
          title: '1. Production Performance & Target vs Actual Variance',
          content: 'During FY 2023-24, Coal India recorded 773.6 MT production against an MoU target of 780.0 MT (99.2% achievement). Mahanadi Coalfields Limited (MCL) emerged as the single largest contributing subsidiary with 206.1 MT (surpassing its 204.0 MT target), followed by South Eastern Coalfields Limited (SECL) with 187.0 MT and Northern Coalfields Limited (NCL) with 141.5 MT.',
          sourcesUsed: ['doc-01', 'doc-03', 'doc-05']
        },
        {
          id: 's-3',
          title: '2. Overburden Removal & Stripping Ratio Dynamics',
          content: 'Total overburden removal (OBR) achieved a historic milestone of 1,965.2 Million Cubic Metres in FY24, enabling significant pit exposure for subsequent fiscal production. NCL maintained an average composite stripping ratio of 2.55 M.Cu.M/Tonne, reflecting deep-bench dragline operations.',
          sourcesUsed: ['doc-01', 'doc-14']
        },
        {
          id: 's-4',
          title: '3. Data Lineage & Quality Notes',
          content: 'All numerical facts cited herein have been verified against statutory Annual Accounts tabled before Parliament and Form IV returns submitted to Coal Controller Organisation. Overall evidence coverage score is 98.4%.',
          sourcesUsed: ['doc-01', 'doc-04']
        }
      ]
    },
    {
      id: 'rep-02',
      title: 'Geological & Mining Performance Appraisal: Korba Coalfield Megaprojects',
      type: 'Mining Performance Report',
      referenceNumber: 'CMPDI/TECH/2024/KORBA-03',
      status: 'UNDER_REVIEW',
      createdAt: '2024-08-05T14:20:00Z',
      generatedBy: 'Pooja Bannerjee',
      subsidiary: 'SECL',
      mine: 'Gevra OCP',
      timePeriod: 'FY 2021-22 to FY 2023-24',
      evidenceCoverage: 96.2,
      verifiedRecordsPercentage: 95.8,
      sourcesCount: 8,
      comments: [
        {
          id: 'c-2',
          user: 'Pooja Bannerjee',
          role: 'ANALYST',
          text: 'Submitted draft incorporating CMPDI RI-V borehole evaluations and DPR for Gevra 70 MTY expansion.',
          timestamp: '2024-08-05T14:20:00Z'
        },
        {
          id: 'c-3',
          user: 'Dr. Rajeshwar Sharma',
          role: 'SUPER_ADMIN',
          text: 'Please reconcile section 2 stripping ratio with latest surveyor triangulation before final sign-off.',
          timestamp: '2024-08-06T10:15:00Z'
        }
      ],
      sections: [
        {
          id: 's-5',
          title: 'Executive Summary',
          content: 'Comprehensive performance review of Gevra, Kusmunda, and Dipka opencast projects in Korba Coalfield, which collectively account for over 75% of SECL total production and nearly 20% of national coal supply.',
          sourcesUsed: ['doc-02', 'doc-03', 'doc-04']
        },
        {
          id: 's-6',
          title: '1. Seam Characteristics and Reserves',
          content: 'The Upper Kusmunda and Lower Kusmunda seams constitute the primary productive horizons, with cumulative seam thickness exceeding 45 metres. In-situ geological reserves within the 70 MTY expansion boundary stand at 950 MT.',
          sourcesUsed: ['doc-02', 'doc-19']
        }
      ]
    },
    {
      id: 'rep-03',
      title: 'Parliamentary Query Response: Coking Coal Import Substitution & Washery Capacity',
      type: 'Parliamentary Response',
      referenceNumber: 'MOC/PQ/2024/DY-9411',
      status: 'DRAFT',
      createdAt: '2024-08-12T11:00:00Z',
      generatedBy: 'Sunil K. Verma',
      subsidiary: 'BCCL',
      timePeriod: 'FY 2022-23 to FY 2024-25',
      evidenceCoverage: 94.0,
      verifiedRecordsPercentage: 93.5,
      sourcesCount: 5,
      comments: [],
      sections: [
        {
          id: 's-7',
          title: 'Draft Ministerial Briefing',
          content: 'Draft briefing on BCCL washed coking coal supply to steel plants, detailing modernization of Madhuban and Patherdih coal washeries to reduce metallurgical coal import dependence.',
          sourcesUsed: ['doc-12', 'doc-09']
        }
      ]
    }
  ];

  public topics: TopicItem[] = [
    {
      id: 'top-1',
      name: 'Production & Dispatch',
      frequency: 2450,
      percentage: 31,
      category: 'Operations',
      evolution: [
        { period: '2010-2015', intensity: 75 },
        { period: '2016-2020', intensity: 88 },
        { period: '2021-2026', intensity: 96 }
      ],
      relatedTerms: ['Raw Coal', 'Dispatch', 'MoU Target', 'Railway Rakes', 'Rapid Loading System', 'Pithead Stock']
    },
    {
      id: 'top-2',
      name: 'Mechanization & Heavy Equipment',
      frequency: 1890,
      percentage: 24,
      category: 'Operations',
      evolution: [
        { period: '2010-2015', intensity: 60 },
        { period: '2016-2020', intensity: 82 },
        { period: '2021-2026', intensity: 92 }
      ],
      relatedTerms: ['Surface Miner', 'Walking Dragline', 'Rope Shovel 42 cum', 'Dumper 240T', 'Continuous Miner', 'In-pit Crushing']
    },
    {
      id: 'top-3',
      name: 'Mine Safety & Strata Control',
      frequency: 1280,
      percentage: 16,
      category: 'Safety',
      evolution: [
        { period: '2010-2015', intensity: 70 },
        { period: '2016-2020', intensity: 80 },
        { period: '2021-2026', intensity: 90 }
      ],
      relatedTerms: ['DGMS', 'Fatality Rate', 'Slope Stability Radar', 'Gas Drainage', 'Inundation Prevention', 'Safety Audit']
    },
    {
      id: 'top-4',
      name: 'Geological Exploration & Boreholes',
      frequency: 960,
      percentage: 12,
      category: 'Geology',
      evolution: [
        { period: '2010-2015', intensity: 85 },
        { period: '2016-2020', intensity: 70 },
        { period: '2021-2026', intensity: 65 }
      ],
      relatedTerms: ['CMPDI', 'Borehole Log', 'Seam Thickness', 'Proved Reserves', 'Proximate Analysis', 'Gross Calorific Value']
    },
    {
      id: 'top-5',
      name: 'Environmental Clearance & Reclamation',
      frequency: 640,
      percentage: 8,
      category: 'Environment',
      evolution: [
        { period: '2010-2015', intensity: 40 },
        { period: '2016-2020', intensity: 65 },
        { period: '2021-2026', intensity: 95 }
      ],
      relatedTerms: ['MoEFCC', 'Bio-Reclamation', 'Air Quality PM10', 'Effluent Treatment', 'Overburden Dump Plantation', 'Fly Ash Backfilling']
    },
    {
      id: 'top-6',
      name: 'Automation & AI Digitalization',
      frequency: 410,
      percentage: 5,
      category: 'Technology',
      evolution: [
        { period: '2010-2015', intensity: 10 },
        { period: '2016-2020', intensity: 35 },
        { period: '2021-2026', intensity: 88 }
      ],
      relatedTerms: ['Fleet Management System', 'OITDS', 'Drone Survey', 'Telemetry', 'Predictive Maintenance', 'IoT Weighbridge']
    },
    {
      id: 'top-7',
      name: 'Coking Coal & Beneficiation',
      frequency: 320,
      percentage: 4,
      category: 'Operations',
      evolution: [
        { period: '2010-2015', intensity: 45 },
        { period: '2016-2020', intensity: 50 },
        { period: '2021-2026', intensity: 75 }
      ],
      relatedTerms: ['Washery Yield', 'Heavy Media Cyclone', 'Clean Coal', 'Steel Plant Blend', 'Import Substitution']
    }
  ];

  public auditLogs: AuditLogItem[] = [
    {
      id: 'aud-001',
      timestamp: '2024-08-12T15:40:12Z',
      user: 'Dr. Rajeshwar Sharma',
      role: 'SUPER_ADMIN',
      action: 'RESOLVE_DATA_CONFLICT',
      targetEntity: 'Validation Issue #val-103 (Jayant Proven Reserves)',
      documentName: 'NCL_Singrauli_Geological_Exploration_CMPDI_2022.pdf',
      previousValue: 'Conflicting (345 MT vs 320 MT)',
      newValue: '345.0 MT (CMPDI In-Situ Proven)',
      rationale: 'Accepted CMPDI 32-borehole geological study as primary authoritative source over extractable estimates.',
      ipAddress: '10.24.120.4',
      sessionToken: 'sess_99a8bc43'
    },
    {
      id: 'aud-002',
      timestamp: '2024-07-29T16:30:00Z',
      user: 'Sunil K. Verma',
      role: 'OFFICER',
      action: 'APPROVE_REPORT',
      targetEntity: 'Report #rep-01 (Parliamentary Review CIL Production)',
      documentName: 'CMPDI/PARL/2024/REV-08',
      previousValue: 'Status: UNDER_REVIEW',
      newValue: 'Status: APPROVED',
      rationale: 'All cited metrics verified against Coal Controller statutory Form IV reconciliations.',
      ipAddress: '10.24.120.18',
      sessionToken: 'sess_11b2fc89'
    },
    {
      id: 'aud-003',
      timestamp: '2024-07-28T10:00:00Z',
      user: 'Dr. Rajeshwar Sharma',
      role: 'SUPER_ADMIN',
      action: 'GENERATE_REPORT',
      targetEntity: 'Report #rep-01',
      documentName: 'CMPDI/PARL/2024/REV-08',
      previousValue: 'None',
      newValue: 'Report Draft Synthesized',
      rationale: 'Generated 10-year production trajectory report via Automated Report Builder wizard.',
      ipAddress: '10.24.120.4',
      sessionToken: 'sess_99a8bc43'
    },
    {
      id: 'aud-004',
      timestamp: '2024-07-20T16:00:00Z',
      user: 'Sunil K. Verma',
      role: 'OFFICER',
      action: 'DOCUMENT_INGESTION_COMPLETED',
      targetEntity: 'Document #doc-05',
      documentName: 'MCL_Production_Performance_FY2023_24.pdf',
      previousValue: 'Status: OCR_PROCESSING',
      newValue: 'Status: INDEXED (810 Entities Extracted)',
      rationale: 'Pipeline completed 7-stage OCR and tabular parsing without fatal anomalies.',
      ipAddress: '10.24.120.18',
      sessionToken: 'sess_11b2fc89'
    },
    {
      id: 'aud-005',
      timestamp: '2024-07-15T10:30:00Z',
      user: 'Dr. Rajeshwar Sharma',
      role: 'SUPER_ADMIN',
      action: 'DOCUMENT_UPLOAD',
      targetEntity: 'Document #doc-01',
      documentName: 'CIL_Annual_Report_Accounts_FY2023_24.pdf',
      previousValue: 'None',
      newValue: 'Uploaded (384 pages, 18.4 MB)',
      rationale: 'Ingested statutory annual accounts into knowledge index.',
      ipAddress: '10.24.120.4',
      sessionToken: 'sess_99a8bc43'
    }
  ];

  public notifications: NotificationItem[] = [
    {
      id: 'notif-1',
      title: 'Data Conflict Requires Review',
      message: '0.40 MT production discrepancy detected in Kusmunda OCP FY2022-23 between SECL Review and Form IV.',
      type: 'WARNING',
      timestamp: '10 minutes ago',
      read: false,
      link: '/validation'
    },
    {
      id: 'notif-2',
      title: 'Report Approval Required',
      message: 'Report CMPDI/TECH/2024/KORBA-03 (Korba Megaprojects) awaits Officer review.',
      type: 'INFO',
      timestamp: '1 hour ago',
      read: false,
      link: '/reports/rep-02'
    },
    {
      id: 'notif-3',
      title: 'Document Ingestion Complete',
      message: 'CIL_Annual_Report_Accounts_FY2023_24.pdf successfully indexed with 1,420 entities.',
      type: 'SUCCESS',
      timestamp: '3 hours ago',
      read: true,
      link: '/documents/doc-01'
    },
    {
      id: 'notif-4',
      title: 'Unusual Production Shortfall Detected',
      message: 'Anomaly detected: Kusmunda FY21 shortfall (-24.8% below target) due to documented monsoon pit inundation.',
      type: 'WARNING',
      timestamp: 'Yesterday',
      read: true,
      link: '/analytics'
    }
  ];

  // Helper to add audit log
  public addAuditLog(entry: Omit<AuditLogItem, 'id' | 'timestamp' | 'ipAddress' | 'sessionToken'>) {
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1 (Local Session)',
      sessionToken: 'sess_active_portal',
      ...entry
    };
    this.auditLogs.unshift(newLog);
    return newLog;
  }
}

export const db = new InMemoryStore();
