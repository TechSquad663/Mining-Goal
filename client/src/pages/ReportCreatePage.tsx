import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  FileSpreadsheet, 
  Layers, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Sliders
} from 'lucide-react';
import { api } from '../services/api';
import { ReportType } from '../types';

export const ReportCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = (location.state as any) || {};

  const [step, setStep] = useState(1);
  const [reportType, setReportType] = useState<ReportType>('Parliamentary Response');
  const [title, setTitle] = useState(
    prefill.prefilledQuery 
      ? `Parliamentary Reply: ${prefill.prefilledQuery}` 
      : 'Comprehensive Performance Review: CIL Operations & Output'
  );
  const [subsidiary, setSubsidiary] = useState('Coal India Ltd (CIL)');
  const [mine, setMine] = useState('');
  const [timePeriod, setTimePeriod] = useState('FY 2023-24');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    'Coal Production (MT)',
    'Overburden Removal (M.Cu.M)',
    'Target vs Actual Achievement'
  ]);
  const [confidenceThreshold, setConfidenceThreshold] = useState(90);
  const [requireAuditedOnly, setRequireAuditedOnly] = useState(true);
  const [generating, setGenerating] = useState(false);

  const reportTypes: { type: ReportType; desc: string }[] = [
    { type: 'Parliamentary Response', desc: 'Ministerial signed reply formatted for Lok Sabha / Rajya Sabha questions' },
    { type: 'Production Report', desc: 'Detailed physical extraction, dispatch, and target achievement reconciliation' },
    { type: 'Mining Performance Report', desc: 'Heavy equipment availability, stripping ratios, and productivity analysis' },
    { type: 'Geological Report', desc: 'Borehole evaluations, seam reserve estimations, and coal grade analyses' },
    { type: 'Annual Report Analysis', desc: 'Corporate high-level statutory synthesis across operational subsidiaries' },
    { type: 'Custom Report', desc: 'Ad-hoc composite brief incorporating user-specified metrics and constraints' }
  ];

  const availableMetrics = [
    'Coal Production (MT)',
    'Overburden Removal (M.Cu.M)',
    'Target vs Actual Achievement',
    'Composite Stripping Ratio',
    'Dispatch & Railway Rake Placement',
    'Fatality & Safety Accident Rate',
    'In-Situ Geological Reserves',
    'Average Seam Thickness',
    'Output Per Manshift (OMS)'
  ];

  const toggleMetric = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.generateReport({
        title,
        type: reportType,
        subsidiary,
        mine: mine || undefined,
        timePeriod,
        metrics: selectedMetrics
      });
      if (res.success && res.report) {
        navigate(`/reports/${res.report.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-coal-800 pb-4">
        <button
          onClick={() => navigate('/reports')}
          className="p-1.5 rounded-lg bg-coal-800 hover:bg-coal-750 text-coal-300 hover:text-coal-100 border border-coal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-coal-50">
            Automated Report Builder
          </h1>
          <p className="text-xs text-coal-400 mt-0.5">
            5-Step Wizard: Synthesize official reports backed by traceable statutory evidence
          </p>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono font-bold">
        {[
          { n: 1, label: 'Report Type' },
          { n: 2, label: 'Scope' },
          { n: 3, label: 'Metrics' },
          { n: 4, label: 'Evidence Rules' },
          { n: 5, label: 'Synthesize' }
        ].map(s => (
          <div
            key={s.n}
            onClick={() => s.n < step && setStep(s.n)}
            className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
              step === s.n
                ? 'bg-gold-500/20 text-gold-400 border-gold-500/50 shadow-sm'
                : step > s.n
                ? 'bg-coal-900 text-emerald-400 border-emerald-900/60'
                : 'bg-coal-950 text-coal-500 border-coal-850 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              {step > s.n ? <Check className="w-3.5 h-3.5" /> : <span>0{s.n}.</span>}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Step Container */}
      <div className="p-6 rounded-xl bg-coal-900 border border-coal-800 space-y-6">
        {/* STEP 1: SELECT REPORT TYPE */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-coal-100 uppercase tracking-wider">
                Step 1: Choose Official Report Template
              </h3>
              <p className="text-xs text-coal-400 mt-1">
                Select the target format compliant with Ministry of Coal and CIL statutory guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {reportTypes.map(t => (
                <div
                  key={t.type}
                  onClick={() => setReportType(t.type)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                    reportType === t.type
                      ? 'bg-gold-500/10 border-gold-500/60 shadow-sm'
                      : 'bg-coal-950 border-coal-800 hover:border-coal-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold ${reportType === t.type ? 'text-gold-400' : 'text-coal-200'}`}>
                      {t.type}
                    </h4>
                    {reportType === t.type && <Check className="w-4 h-4 text-gold-400" />}
                  </div>
                  <p className="text-[11px] text-coal-400 leading-snug">
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-xs font-semibold text-coal-300 block mb-1">
                Working Report Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 bg-coal-950 border border-coal-800 rounded-lg text-xs text-coal-100"
              />
            </div>
          </div>
        )}

        {/* STEP 2: SELECT SCOPE */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-coal-100 uppercase tracking-wider">
                Step 2: Define Geographic & Temporal Scope
              </h3>
              <p className="text-xs text-coal-400 mt-1">
                Filter documents and production metrics for this report.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div>
                <label className="font-semibold text-coal-300 block mb-1">
                  Subsidiary Entity
                </label>
                <select
                  value={subsidiary}
                  onChange={(e) => setSubsidiary(e.target.value)}
                  className="w-full p-2.5 bg-coal-950 border border-coal-800 rounded-lg text-coal-200"
                >
                  <option>Coal India Ltd (CIL)</option>
                  <option>SECL</option>
                  <option>MCL</option>
                  <option>NCL</option>
                  <option>CCL</option>
                  <option>BCCL</option>
                  <option>WCL</option>
                  <option>ECL</option>
                  <option>CMPDI HQ Ranchi</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-coal-300 block mb-1">
                  Specific Mine / Project (Optional)
                </label>
                <input
                  type="text"
                  value={mine}
                  onChange={(e) => setMine(e.target.value)}
                  placeholder="e.g. Gevra OCP, Kusmunda, Jayant (leave blank for all)"
                  className="w-full p-2.5 bg-coal-950 border border-coal-800 rounded-lg text-coal-200"
                />
              </div>

              <div>
                <label className="font-semibold text-coal-300 block mb-1">
                  Time Period / Financial Cycle
                </label>
                <select
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="w-full p-2.5 bg-coal-950 border border-coal-800 rounded-lg text-coal-200 font-mono"
                >
                  <option>FY 2023-24</option>
                  <option>FY 2022-23 to FY 2023-24</option>
                  <option>10-Year Trajectory (FY 2015-16 to FY 2024-25)</option>
                  <option>FY 2024-25 (YTD)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SELECT METRICS */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-coal-100 uppercase tracking-wider">
                Step 3: Select Core Operational & Geological Metrics
              </h3>
              <p className="text-xs text-coal-400 mt-1">
                The report synthesis engine will query structured tables for verified data points.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {availableMetrics.map(metric => (
                <div
                  key={metric}
                  onClick={() => toggleMetric(metric)}
                  className={`p-3 rounded-lg border text-xs font-semibold cursor-pointer transition-colors flex items-center justify-between ${
                    selectedMetrics.includes(metric)
                      ? 'bg-gold-500/10 border-gold-500/50 text-gold-300'
                      : 'bg-coal-950 border-coal-800 text-coal-400 hover:text-coal-200'
                  }`}
                >
                  <span>{metric}</span>
                  {selectedMetrics.includes(metric) && <Check className="w-4 h-4 text-gold-400" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: EVIDENCE REQUIREMENTS */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-coal-100 uppercase tracking-wider">
                Step 4: Evidence Requirements & Reliability Thresholds
              </h3>
              <p className="text-xs text-coal-400 mt-1">
                Strict adherence to the Core Product Principle: Answer + Evidence + Source + Confidence.
              </p>
            </div>

            <div className="space-y-4 p-4 rounded-xl bg-coal-950 border border-coal-800 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-coal-200">
                    Minimum Evidence Confidence Cutoff
                  </span>
                  <span className="font-mono font-bold text-gold-400">{confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="75"
                  max="99"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full accent-gold-500 cursor-pointer"
                />
                <span className="text-[10px] text-coal-400">
                  Extracts with OCR/Model confidence below this cutoff will be excluded or flagged.
                </span>
              </div>

              <div className="pt-2 border-t border-coal-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-coal-200">Require Audited Records Only</p>
                  <p className="text-[10px] text-coal-400 mt-0.5">
                    Exclude unverified draft sheets and restrict to CCO Form IV & Tabled Annual Accounts.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={requireAuditedOnly}
                  onChange={(e) => setRequireAuditedOnly(e.target.checked)}
                  className="w-4 h-4 accent-gold-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: SYNTHESIZE & REVIEW PREVIEW */}
        {step === 5 && (
          <div className="space-y-4 text-center py-4">
            <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-coal-100">
                Ready to Synthesize Official Intelligence Report
              </h3>
              <p className="text-xs text-coal-400 mt-1 max-w-md mx-auto">
                The engine will compile executive summaries, production tables, target variances, and attach traceable page-level citations for every cited figure.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-coal-950 border border-coal-800 text-left text-xs max-w-md mx-auto space-y-2 font-mono">
              <p><span className="text-coal-400">Type:</span> {reportType}</p>
              <p><span className="text-coal-400">Entity:</span> {subsidiary} {mine ? `• ${mine}` : ''}</p>
              <p><span className="text-coal-400">Period:</span> {timePeriod}</p>
              <p><span className="text-coal-400">Metrics:</span> {selectedMetrics.length} selected</p>
              <p><span className="text-coal-400">Est. Evidence Coverage:</span> <span className="text-emerald-400 font-bold">~98.2%</span></p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-coal-950 font-bold text-sm transition-all shadow-md mt-4"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-coal-950 border-t-transparent rounded-full animate-spin" />
                  Synthesizing Report Sections...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Synthesize Report Draft
                </>
              )}
            </button>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-coal-800">
          <button
            disabled={step === 1}
            onClick={() => setStep(s => s - 1)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-coal-800 hover:bg-coal-750 disabled:opacity-30 text-coal-300 text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Step
          </button>

          {step < 5 && (
            <button
              onClick={() => setStep(s => s + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gold-600 hover:bg-gold-500 text-coal-950 text-xs font-bold transition-colors"
            >
              Continue to Step {step + 1}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
