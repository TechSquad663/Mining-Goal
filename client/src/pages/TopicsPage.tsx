import React, { useState, useEffect } from 'react';
import { CloudRain, TrendingUp, Calendar, Layers, Tag, ArrowRight } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { api } from '../services/api';
import { TopicItem } from '../types';

export const TopicsPage: React.FC = () => {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);

  useEffect(() => {
    api.getTopics().then(data => {
      setTopics(data.topics || []);
      setTimeline(data.evolutionTimeline || []);
      if (data.topics && data.topics.length > 0) {
        setSelectedTopic(data.topics[0]);
      }
    }).catch(console.error);
  }, []);

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#6366f1', '#eab308'];

  // Word Cloud Keywords with varied weights & sizes
  const cloudKeywords = [
    { text: 'Coal Production', weight: 48, cat: 'Operations' },
    { text: 'Surface Miner', weight: 36, cat: 'Operations' },
    { text: 'Walking Dragline', weight: 32, cat: 'Operations' },
    { text: 'Mine Safety Audit', weight: 38, cat: 'Safety' },
    { text: 'DGMS Standards', weight: 30, cat: 'Safety' },
    { text: 'CMPDI Boreholes', weight: 34, cat: 'Geology' },
    { text: 'Seam Thickness', weight: 28, cat: 'Geology' },
    { text: 'Gevra OCP Expansion', weight: 42, cat: 'Operations' },
    { text: 'Korba Coalfield', weight: 35, cat: 'Geology' },
    { text: 'Overburden Stripping', weight: 40, cat: 'Operations' },
    { text: 'Form IV Return', weight: 36, cat: 'Operations' },
    { text: 'Bio-Reclamation', weight: 26, cat: 'Environment' },
    { text: 'MoEFCC Clearance', weight: 29, cat: 'Environment' },
    { text: 'Slope Stability Radar', weight: 27, cat: 'Safety' },
    { text: 'Methane Drainage', weight: 24, cat: 'Safety' },
    { text: 'Rapid Loading Silo', weight: 25, cat: 'Operations' },
    { text: 'Fleet Management OITDS', weight: 31, cat: 'Technology' },
    { text: 'Coking Coal Washery', weight: 26, cat: 'Operations' },
    { text: 'First Mile Connectivity', weight: 33, cat: 'Technology' },
    { text: 'Tori-Shivpur Rail Link', weight: 27, cat: 'Operations' },
    { text: 'Fly Ash Backfilling', weight: 22, cat: 'Environment' },
    { text: 'Digital Twin AI', weight: 29, cat: 'Technology' }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="border-b border-coal-800 pb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-widest">
            Semantic Topic Intelligence
          </span>
          <span className="text-coal-400">•</span>
          <span className="text-xs text-coal-400 font-mono">128,452 Documents Mapped</span>
        </div>
        <h1 className="text-2xl font-extrabold text-coal-50 mt-1">
          Automated Word Cloud & Topic Evolution
        </h1>
        <p className="text-xs text-coal-400 mt-1">
          Discover macro operational themes, technological shifts, and topic distribution across decades of mining reports.
        </p>
      </div>

      {/* WORD CLOUD & INTERACTIVE EXPLORER (Section 23) */}
      <div className="bg-coal-900 border border-coal-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-coal-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-coal-100 uppercase tracking-wider flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-gold-400" />
              Interactive Mining & Geological Word Cloud
            </h3>
            <p className="text-xs text-coal-400">
              Extracted from high-frequency entities and multi-decade statutory filings
            </p>
          </div>
          <span className="text-xs font-mono text-gold-400 font-bold">Weighted TF-IDF</span>
        </div>

        {/* Dynamic Word Cloud Container */}
        <div className="p-6 rounded-xl bg-coal-950 border border-coal-800/80 flex flex-wrap items-center justify-center gap-3 py-10 min-h-[220px]">
          {cloudKeywords.map((word, i) => {
            const sizeStyle = word.weight >= 40 
              ? 'text-xl sm:text-2xl font-black text-gold-400' 
              : word.weight >= 32 
              ? 'text-base sm:text-lg font-bold text-coal-100' 
              : word.weight >= 26 
              ? 'text-xs sm:text-sm font-semibold text-coal-300' 
              : 'text-[11px] font-normal text-coal-400';

            return (
              <span
                key={i}
                onClick={() => {
                  const match = topics.find(t => t.name.toLowerCase().includes(word.text.toLowerCase()));
                  if (match) setSelectedTopic(match);
                }}
                className={`cursor-pointer transition-all duration-200 hover:scale-110 hover:text-gold-300 px-2 py-1 rounded hover:bg-coal-900 select-none ${sizeStyle}`}
                title={`Topic Weight: ${word.weight} • Domain: ${word.cat}`}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      </div>

      {/* TOPIC DISTRIBUTION & BREAKDOWN (Section 24) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie & Distribution List */}
        <div className="bg-coal-900 border border-coal-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-coal-800 pb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold text-coal-100 uppercase tracking-wider">
              Topic Distribution Across Corpus
            </h3>
            <span className="text-xs font-mono text-coal-400">Section 24 Standard</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topics}
                    dataKey="percentage"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {topics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0d1117', borderColor: '#232d3e', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {topics.map((t, idx) => (
                <div 
                  key={t.id}
                  onClick={() => setSelectedTopic(t)}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    selectedTopic?.id === t.id ? 'bg-coal-800 border border-coal-700' : 'hover:bg-coal-850'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="font-semibold text-coal-200">{t.name}</span>
                  </div>
                  <span className="font-mono font-bold text-gold-400">{t.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Topic Inspector */}
        <div className="bg-coal-900 border border-coal-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          {selectedTopic ? (
            <div className="space-y-4">
              <div className="border-b border-coal-800 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gold-400 font-mono">
                    {selectedTopic.category} Domain
                  </span>
                  <h3 className="text-base font-bold text-coal-100 mt-0.5">
                    {selectedTopic.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {selectedTopic.frequency} Citations
                  </span>
                  <span className="text-[10px] text-coal-400 block">{selectedTopic.percentage}% of Repository</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-coal-400 block mb-2">
                  Correlated Technical Terms:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTopic.relatedTerms.map((term, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-coal-950 border border-coal-800 text-coal-300 text-xs font-mono">
                      {term}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-coal-400 block mb-2">
                  Multi-Decade Temporal Intensity:
                </span>
                <div className="space-y-2">
                  {selectedTopic.evolution.map((ev, i) => (
                    <div key={i} className="text-xs space-y-0.5">
                      <div className="flex justify-between font-mono text-[11px] text-coal-400">
                        <span>{ev.period}</span>
                        <span className="text-gold-400">{ev.intensity}% Intensity</span>
                      </div>
                      <div className="h-1.5 w-full bg-coal-950 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gold-500 rounded-full"
                          style={{ width: `${ev.intensity}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-coal-400 text-xs">
              Select a topic to view its detailed frequency and related taxonomy terms.
            </div>
          )}
        </div>
      </div>

      {/* TOPIC EVOLUTION TIMELINE (Section 25) */}
      <div className="bg-coal-900 border border-coal-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="border-b border-coal-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-coal-100 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-400" />
              Topic Evolution Across Historical Epochs
            </h3>
            <p className="text-xs text-coal-400">
              How mining priorities transitioned from manual extraction to massive mechanization to AI digitalization
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">2010 to 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {timeline.map((era, i) => (
            <div 
              key={i}
              className="p-5 rounded-xl bg-coal-950 border border-coal-800 relative space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-coal-900 border border-coal-750 text-gold-400 font-mono text-xs font-bold">
                  {era.era}
                </div>
                <h4 className="text-xs font-bold text-coal-100">{era.theme}</h4>
                <p className="text-xs text-coal-400 leading-relaxed font-sans">
                  {era.highlights}
                </p>
              </div>

              <div className="pt-3 border-t border-coal-850">
                <span className="text-[10px] uppercase font-bold text-coal-500 block mb-1">
                  Dominant Keyword Clusters:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {era.focusTopics.map((term: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-coal-900 border border-coal-800 text-[10px] text-coal-300 font-mono">
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
