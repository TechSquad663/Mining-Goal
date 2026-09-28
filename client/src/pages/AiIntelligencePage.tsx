import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  FileText, 
  Copy, 
  Check, 
  Share2, 
  FileSpreadsheet, 
  ExternalLink, 
  ShieldCheck, 
  ShieldAlert, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { api } from '../services/api';
import { AIQueryHistory, EvidenceCitation } from '../types';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { EvidenceModal } from '../components/common/EvidenceModal';

export const AiIntelligencePage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<AIQueryHistory[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceCitation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      api.getAiHistory(),
      api.getAiSuggestions()
    ]).then(([history, suggs]) => {
      setMessages(history);
      setSuggestions(suggs);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || loading) return;

    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.askAi(q);
      if (res.success && res.data) {
        setMessages(prev => [res.data, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateReportFromQuery = (item: AIQueryHistory) => {
    navigate('/reports/create', { state: { prefilledQuery: item.query, prefilledAnswer: item.answer } });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="text-center space-y-2 py-4 border-b border-coal-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>HYBRID QUERY ENGINE (SQL ARITHMETIC + VECTOR SEARCH)</span>
        </div>
        <h1 className="text-3xl font-extrabold text-coal-50 tracking-tight">
          Ask CoalIntelligence
        </h1>
        <p className="text-xs md:text-sm text-coal-400 max-w-xl mx-auto">
          Query across decades of verified geological surveys, statutory Form IV returns, annual accounts, and parliamentary records.
        </p>
      </div>

      {/* Suggested Quick Cards (Section 16) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {suggestions.slice(0, 6).map((sugg, idx) => (
          <div
            key={idx}
            onClick={() => handleSend(sugg.query)}
            className="p-3.5 rounded-xl bg-coal-900 border border-coal-800 hover:border-gold-500/50 hover:bg-coal-850 cursor-pointer transition-all space-y-1 group"
          >
            <span className="text-[10px] uppercase font-bold text-coal-400 tracking-wider font-mono">
              {sugg.category}
            </span>
            <p className="text-xs font-bold text-coal-200 group-hover:text-gold-400 transition-colors">
              "{sugg.query}"
            </p>
            <p className="text-[11px] text-coal-400 line-clamp-1">
              {sugg.description}
            </p>
          </div>
        ))}
      </div>

      {/* Query Input Bar */}
      <div className="sticky top-20 z-30 bg-coal-950/90 backdrop-blur-md pt-2 pb-4">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center bg-coal-900 border-2 border-coal-700 focus-within:border-gold-500 rounded-xl p-2 shadow-2xl transition-all"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask a factual question (e.g., 'Compare production from 2015 to 2025' or 'Which years were below targets?')..."
            className="w-full bg-transparent pl-4 pr-12 py-2 text-sm text-coal-100 placeholder-coal-400 focus:outline-none font-sans"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="px-4 py-2 rounded-lg bg-gold-600 hover:bg-gold-500 disabled:opacity-30 text-coal-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-coal-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Query</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Message Stream */}
      <div className="space-y-6">
        {loading && (
          <div className="p-6 rounded-xl bg-coal-900 border border-coal-800 space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gold-500/20" />
              <div className="space-y-1">
                <div className="h-3 w-40 bg-coal-800 rounded" />
                <div className="h-2 w-24 bg-coal-800 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-coal-800 rounded" />
              <div className="h-4 w-5/6 bg-coal-800 rounded" />
              <div className="h-4 w-1/2 bg-coal-800 rounded" />
            </div>
          </div>
        )}

        {messages.map((item) => (
          <div 
            key={item.id} 
            className="p-6 rounded-xl bg-coal-900 border border-coal-800 shadow-sm space-y-5"
          >
            {/* User Prompt Bar */}
            <div className="flex items-start justify-between gap-3 border-b border-coal-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-coal-800 border border-coal-700 flex items-center justify-center text-xs font-mono text-coal-300">
                  Q
                </div>
                <h3 className="text-sm font-bold text-coal-100">
                  "{item.query}"
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-coal-400">
                  {item.responseTimeMs}ms
                </span>
                <ConfidenceBadge 
                  confidence={item.confidence} 
                  evidenceCount={item.evidenceCount} 
                  dataStatus={item.dataStatus}
                />
              </div>
            </div>

            {/* AI Generated Answer Text */}
            <div className="text-xs md:text-sm text-coal-200 leading-relaxed space-y-2 whitespace-pre-line font-sans">
              {item.answer}
            </div>

            {/* Key Statistics Highlights */}
            {item.keyStats && item.keyStats.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-coal-950 border border-coal-800">
                {item.keyStats.map((st, i) => (
                  <div key={i}>
                    <span className="text-[10px] uppercase font-bold text-coal-400">{st.label}</span>
                    <p className="text-base font-mono font-bold text-gold-400 mt-0.5">{st.value}</p>
                    {st.delta && <span className="text-[11px] text-coal-400">{st.delta}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Inline Chart Visualization (Section 17) */}
            {item.chartData && (
              <div className="border border-coal-800 rounded-xl p-4 bg-coal-950">
                <h4 className="text-xs font-bold text-coal-300 uppercase tracking-wider mb-3">
                  {item.chartData.title}
                </h4>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {item.chartData.type === 'line' ? (
                      <LineChart data={item.chartData.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#232d3e" vertical={false} />
                        <XAxis dataKey={item.chartData.xAxisKey} stroke="#7e8b9f" fontSize={11} />
                        <YAxis stroke="#7e8b9f" fontSize={11} domain={['auto', 'auto']} />
                        <Tooltip contentStyle={{ backgroundColor: '#0d1117', borderColor: '#232d3e', fontSize: '12px' }} />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                        {Object.keys(item.chartData.data[0] || {})
                          .filter(k => k !== item.chartData?.xAxisKey)
                          .map((key, kIdx) => (
                            <Line 
                              key={key} 
                              type="monotone" 
                              dataKey={key} 
                              stroke={kIdx === 0 ? '#f59e0b' : '#10b981'} 
                              strokeWidth={2} 
                              dot={{ r: 3 }}
                            />
                          ))}
                      </LineChart>
                    ) : (
                      <BarChart data={item.chartData.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#232d3e" vertical={false} />
                        <XAxis dataKey={item.chartData.xAxisKey} stroke="#7e8b9f" fontSize={11} />
                        <YAxis stroke="#7e8b9f" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#0d1117', borderColor: '#232d3e', fontSize: '12px' }} />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                        {Object.keys(item.chartData.data[0] || {})
                          .filter(k => k !== item.chartData?.xAxisKey)
                          .map((key, kIdx) => (
                            <Bar 
                              key={key} 
                              dataKey={key} 
                              fill={kIdx === 0 ? '#4a576e' : '#f59e0b'} 
                              radius={[4, 4, 0, 0]} 
                            />
                          ))}
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Traceable Evidence Drawer (Section 17) */}
            {item.evidence && item.evidence.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-coal-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-coal-400 block">
                  Supporting Corroborated Evidence ({item.evidence.length} Sources)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {item.evidence.map((ev) => (
                    <div 
                      key={ev.id}
                      className="p-3 rounded-lg bg-coal-950 border border-coal-800 hover:border-coal-700 transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-coal-200 truncate" title={ev.documentName}>
                          {ev.documentName}
                        </p>
                        <p className="text-[11px] font-mono text-gold-400 mt-0.5">
                          Page {ev.page} • {ev.subsidiary} {ev.mine ? `• ${ev.mine}` : ''}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedEvidence(ev)}
                        className="px-2.5 py-1 rounded bg-coal-800 hover:bg-coal-750 text-gold-400 text-xs font-semibold border border-coal-700 flex-shrink-0 transition-colors"
                      >
                        View Source
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Follow-up Suggestion Chips (Section 44) */}
            {item.suggestedFollowUps && item.suggestedFollowUps.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-coal-400 block mb-1.5">
                  Suggested Follow-up Inquiries:
                </span>
                <div className="flex flex-wrap gap-2">
                  {item.suggestedFollowUps.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip)}
                      className="text-xs px-2.5 py-1 rounded bg-coal-800 hover:bg-coal-750 text-coal-300 hover:text-gold-400 border border-coal-700 transition-colors flex items-center gap-1.5"
                    >
                      <span>• {chip}</span>
                      <ArrowRight className="w-3 h-3 text-coal-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Response Actions (Section 43) */}
            <div className="flex items-center justify-between pt-3 border-t border-coal-800 text-xs">
              <span className="text-[11px] font-mono text-coal-400">
                Audited & Logged • Trace ID: {item.id}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(item.id, item.answer)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-coal-800 hover:bg-coal-750 text-coal-300 text-xs transition-colors"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => handleGenerateReportFromQuery(item)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded bg-gold-600/20 hover:bg-gold-600/30 text-gold-300 font-semibold text-xs border border-gold-500/40 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-gold-400" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Traceable Evidence Modal */}
      <EvidenceModal
        evidence={selectedEvidence}
        isOpen={Boolean(selectedEvidence)}
        onClose={() => setSelectedEvidence(null)}
      />
    </div>
  );
};
