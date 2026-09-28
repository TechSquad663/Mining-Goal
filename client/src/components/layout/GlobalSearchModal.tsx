import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, FileSpreadsheet, MapPin, Cloud, ArrowRight, CornerDownLeft } from 'lucide-react';
import { api } from '../../services/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [counts, setCounts] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setCounts({});
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.search(query.trim());
        setResults(res.results || []);
        setCounts(res.counts || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (link: string) => {
    navigate(link);
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Document': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'Report': return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      case 'Mine / Area': return <MapPin className="w-4 h-4 text-gold-400" />;
      case 'Topic': return <Cloud className="w-4 h-4 text-purple-400" />;
      default: return <FileText className="w-4 h-4 text-coal-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-coal-900 border border-coal-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 bg-coal-850 border-b border-coal-700">
          <Search className="w-5 h-5 text-coal-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents, mines, reports, production metrics, or topics (e.g., Gevra, SECL, Safety)..."
            className="w-full bg-transparent text-coal-100 placeholder-coal-400 text-sm focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-coal-400 hover:text-coal-200 mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-coal-800 text-coal-400 rounded border border-coal-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {loading && (
            <div className="py-8 text-center text-coal-400 text-xs flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
              Scanning knowledge base across 128,452 indexed records...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center text-coal-400 text-xs">
              No matching records found for "{query}". Try searching for <span className="text-gold-400 cursor-pointer" onClick={() => setQuery('Gevra')}>Gevra</span>, <span className="text-gold-400 cursor-pointer" onClick={() => setQuery('SECL')}>SECL</span>, or <span className="text-gold-400 cursor-pointer" onClick={() => setQuery('Annual Report')}>Annual Report</span>.
            </div>
          )}

          {!loading && !query && (
            <div className="p-4 text-xs text-coal-400 space-y-3">
              <p className="font-semibold text-coal-300">Quick Filters & Popular Searches:</p>
              <div className="flex flex-wrap gap-2">
                {['Gevra OCP', 'Kusmunda', 'MCL Production', 'Lok Sabha Questions', 'Stripping Ratio', 'Jayant Dragline'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 rounded bg-coal-800 hover:bg-coal-750 text-coal-300 border border-coal-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && results.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(item.link)}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-coal-800/80 cursor-pointer border border-transparent hover:border-coal-700 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-md bg-coal-800 border border-coal-700">
                  {getIcon(item.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-coal-100 truncate group-hover:text-gold-400 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-coal-800 text-coal-400 border border-coal-700 font-mono">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-coal-400 truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-coal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-mono">Go</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="px-4 py-2 bg-coal-850 border-t border-coal-700 flex items-center justify-between text-[11px] text-coal-400">
            <span>
              Matches: {counts.documents || 0} Docs • {counts.reports || 0} Reports • {counts.mines || 0} Mines • {counts.topics || 0} Topics
            </span>
            <span className="font-mono text-[10px]">Use ↑↓ to navigate, ENTER to open</span>
          </div>
        )}
      </div>
    </div>
  );
};
