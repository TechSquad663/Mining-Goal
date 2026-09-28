import React, { useState } from 'react';
import { Settings, Sliders, Cpu, Shield, Bell, Check, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [aiMode, setAiMode] = useState<'mock' | 'production'>('mock');
  const [llmProvider, setLlmProvider] = useState('Gemini 2.0 Pro (Fine-Tuned Mining Spec)');
  const [temperature, setTemperature] = useState(0.1);
  const [confidenceCutoff, setConfidenceCutoff] = useState(88);
  const [ocrEngine, setOcrEngine] = useState('Tesseract OCR + CMPDI TableVision v2');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="border-b border-coal-800 pb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-widest">
            System Parameters & Configuration
          </span>
          <span className="text-coal-400">•</span>
          <span className="text-xs text-coal-400 font-mono">CMPDI Enterprise Settings</span>
        </div>
        <h1 className="text-2xl font-extrabold text-coal-50 mt-1">
          Platform Settings & AI Configuration
        </h1>
        <p className="text-xs text-coal-400 mt-1">
          Configure pluggable LLM and OCR provider abstractions, inference temperature, and statutory confidence thresholds.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: AI ENGINE CONFIGURATION (Section 48) */}
        <div className="p-6 rounded-xl bg-coal-900 border border-coal-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-coal-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-gold-400" />
              <div>
                <h3 className="text-sm font-bold text-coal-100 uppercase tracking-wider">
                  AI & Inference Engine Configuration
                </h3>
                <p className="text-xs text-coal-400">
                  Control between zero-config Mock AI and Production Enterprise LLM Providers
                </p>
              </div>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-gold-500/20 text-gold-400 border border-gold-500/40 font-bold">
              AI_MODE={aiMode}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-coal-300 block mb-1">
                Execution Mode
              </label>
              <select
                value={aiMode}
                onChange={(e) => setAiMode(e.target.value as any)}
                className="w-full p-2.5 bg-coal-950 border border-coal-800 rounded-lg text-coal-100 font-mono"
              >
                <option value="mock">mock (High-Fidelity Structured Simulation)</option>
                <option value="production">production (Direct LLM / pgvector API)</option>
              </select>
              <span className="text-[10px] text-coal-500 block mt-1">
                Mock mode uses deterministic SQL arithmetic and zero external cloud latency.
              </span>
            </div>

            <div>
              <label className="font-semibold text-coal-300 block mb-1">
                Active LLM Architecture / Provider
              </label>
              <select
                value={llmProvider}
                onChange={(e) => setLlmProvider(e.target.value)}
                className="w-full p-2.5 bg-coal-950 border border-coal-800 rounded-lg text-coal-100"
              >
                <option>Gemini 2.0 Pro (Fine-Tuned Mining Spec)</option>
                <option>Anthropic Claude 3.5 Sonnet</option>
                <option>OpenAI GPT-4o Enterprise</option>
                <option>Local Ollama DeepSeek-R1 (Air-Gapped Sovereign)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-coal-300 mb-1">
                <span>Temperature (Strictness)</span>
                <span className="font-mono text-gold-400">{temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.5"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-gold-500 cursor-pointer"
              />
              <span className="text-[10px] text-coal-500 block">
                Low temperature (0.0-0.2) mandated by Safety Rule 1 to avoid factual hallucinations.
              </span>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-coal-300 mb-1">
                <span>Factual Confidence Cutoff</span>
                <span className="font-mono text-emerald-400">{confidenceCutoff}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="98"
                step="1"
                value={confidenceCutoff}
                onChange={(e) => setConfidenceCutoff(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[10px] text-coal-500 block">
                Answers with evidence below this threshold trigger the "Insufficient Information" warning.
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: OCR & DOCUMENT PROCESSING */}
        <div className="p-6 rounded-xl bg-coal-900 border border-coal-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-coal-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="text-sm font-bold text-coal-100 uppercase tracking-wider">
                  OCR Engine & Table Detection
                </h3>
                <p className="text-xs text-coal-400">
                  Document ingestion, bounding box extraction, and Form IV parser settings
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-coal-300 block mb-1">
                Default OCR Pipeline
              </label>
              <select
                value={ocrEngine}
                onChange={(e) => setOcrEngine(e.target.value)}
                className="w-full p-2.5 bg-coal-950 border border-coal-800 rounded-lg text-coal-100"
              >
                <option>Tesseract OCR + CMPDI TableVision v2</option>
                <option>AWS Textract Tables & Forms</option>
                <option>Google Cloud Vision Document AI</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-coal-950 border border-coal-800">
              <div>
                <p className="font-semibold text-coal-200">Asynchronous Worker Queues</p>
                <p className="text-[10px] text-coal-400 mt-0.5">
                  Process large PDF files in background workers to maintain UI responsiveness.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] font-bold">
                ENABLED
              </span>
            </div>
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
              <Check className="w-4 h-4" />
              Settings Saved and Applied to Engine Configuration
            </span>
          ) : (
            <span className="text-[11px] text-coal-500 font-mono">
              Changes update active session parameters immediately
            </span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gold-600 hover:bg-gold-500 text-coal-950 text-xs font-bold transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
