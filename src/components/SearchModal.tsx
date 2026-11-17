import React, { useState, useEffect } from 'react';
import { Search, X, Tv, Video, Newspaper, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SHOWS } from '../config/shows';
import { REPLAYS_DATA } from '../config/replays';
import { FALLBACK_ARTICLES } from '../lib/wordpress';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredShows = q
    ? SHOWS.filter(s => s.title.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q) || s.presenter.name.toLowerCase().includes(q))
    : SHOWS.slice(0, 3);

  const filteredReplays = q
    ? REPLAYS_DATA.filter(r => r.title.toLowerCase().includes(q) || r.showTitle.toLowerCase().includes(q))
    : REPLAYS_DATA.slice(0, 3);

  const filteredNews = q
    ? FALLBACK_ARTICLES.filter(n => n.title.toLowerCase().includes(q) || n.categoryName.toLowerCase().includes(q))
    : FALLBACK_ARTICLES.slice(0, 3);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#2B2B38] dark:border-[#2B2B38] light:border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-[#191922] dark:bg-[#191922] light:bg-gray-100 border-b border-[#242430] dark:border-[#242430] light:border-gray-200">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tafuta vipindi, habari, au watangazaji (e.g. Ken Wakuraya, Asubuhi, Siasa)..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white dark:text-white light:text-gray-900 placeholder-gray-500 focus:outline-none"
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-mono text-gray-300 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {/* Shows */}
          <div>
            <div className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-[#C30D12]" />
              <span>Broadcast Shows / Vipindi</span>
            </div>
            <div className="space-y-1.5">
              {filteredShows.length > 0 ? (
                filteredShows.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/shows/${s.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={s.thumbnail} alt={s.title} className="w-10 h-7 rounded object-cover" />
                      <div>
                        <h4 className="font-heading font-bold text-sm text-white dark:text-white light:text-gray-900 group-hover:text-[#C30D12]">
                          {s.title}
                        </h4>
                        <p className="text-[11px] text-gray-400">{s.presenter.name} • {s.airTimes}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </Link>
                ))
              ) : (
                <div className="text-xs text-gray-500 p-2">No shows match "{query}"</div>
              )}
            </div>
          </div>

          {/* Replays */}
          <div>
            <div className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-[#0B5CAB]" />
              <span>Video Highlights & Replays</span>
            </div>
            <div className="space-y-1.5">
              {filteredReplays.map((r) => (
                <Link
                  key={r.id}
                  to="/replays"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <img src={r.thumbnail} alt={r.title} className="w-10 h-7 rounded object-cover" />
                    <div className="max-w-md">
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-white dark:text-white light:text-gray-900 group-hover:text-[#0B5CAB] truncate">
                        {r.title}
                      </h4>
                      <p className="text-[10px] text-gray-400">{r.showTitle} • {r.views} views</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* News articles */}
          <div>
            <div className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
              <Newspaper className="w-3.5 h-3.5 text-amber-500" />
              <span>KenLive News Feed</span>
            </div>
            <div className="space-y-1.5">
              {filteredNews.map((n) => (
                <a
                  key={n.id}
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-gray-100 transition-colors group"
                >
                  <div className="max-w-md">
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-white dark:text-white light:text-gray-900 group-hover:text-[#C30D12] line-clamp-1">
                      {n.title}
                    </h4>
                    <p className="text-[10px] text-gray-400">{n.categoryName} • {n.timeAgo}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#0E0E12] border-t border-[#242430] text-center text-xs text-gray-400">
          Can't find what you're looking for? Email our newsroom at <span className="text-[#C30D12] font-semibold">info@kenlive.co.ke</span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

