import React, { useState } from 'react';
import { Film, Play, Eye, X, Share2, Check, Clock, Search } from 'lucide-react';
import { REPLAYS_DATA, ReplayClip } from '../config/replays';

export const Replays: React.FC = () => {
  const [selectedClip, setSelectedClip] = useState<ReplayClip | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [query, setQuery] = useState('');

  const handleShare = (clip: ReplayClip) => {
    const url = `https://www.youtube.com/watch?v=${clip.youtubeId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [
    { key: 'all', label: 'All Replays / Marudio Yote' },
    { key: 'news', label: 'News Bulletins' },
    { key: 'politics', label: 'Politics & Parliament' },
    { key: 'business', label: 'Business & Farming' },
    { key: 'sports', label: 'Sports Highlights' },
    { key: 'entertainment', label: 'Entertainment & Music' },
  ];

  const filteredClips = REPLAYS_DATA.filter((c) => {
    const matchesCat = activeCategory === 'all' || c.category === activeCategory;
    const matchesQuery = !query.trim() || c.title.toLowerCase().includes(query.toLowerCase()) || c.showTitle.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C30D12] text-white text-[11px] font-heading font-extrabold uppercase tracking-wider">
              MARUDIO NA VIPANDE VYA VIDEO
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-gray-950 leading-tight">
            Video Replays & Highlights
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 light:text-gray-600 mt-1 max-w-2xl">
            Missed a live broadcast? Catch full bulletin replays, heated parliamentary debates, exclusive interviews, and unforgettable entertainment performances on demand.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider transition-all ${
                  activeCategory === c.key
                    ? 'bg-[#C30D12] text-white shadow-lg shadow-[#C30D12]/20'
                    : 'bg-[#14141A] dark:bg-[#14141A] light:bg-white text-gray-300 dark:text-gray-300 light:text-gray-700 hover:bg-[#1E1E28] border border-[#242430] dark:border-[#242430] light:border-gray-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search replay clips..."
              className="w-full bg-[#14141A] dark:bg-[#14141A] light:bg-white text-white dark:text-white light:text-gray-900 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[#242430] dark:border-[#242430] light:border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C30D12]"
            />
          </div>
        </div>

        {/* Grid of Replays */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClips.map((clip) => (
            <div
              key={clip.id}
              onClick={() => setSelectedClip(clip)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200 hover:border-[#C30D12]/60 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-black/70">
                  <img
                    src={clip.thumbnail}
                    alt={clip.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <div className="w-12 h-12 rounded-full bg-[#C30D12]/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-white text-[11px] font-mono font-bold">
                    {clip.duration}
                  </div>
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-heading font-extrabold uppercase tracking-wider text-amber-300">
                    {clip.showTitle}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-heading font-extrabold text-lg uppercase tracking-tight text-white dark:text-white light:text-gray-900 group-hover:text-[#C30D12] transition-colors line-clamp-2 leading-snug">
                    {clip.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400 light:text-gray-600 mt-2.5">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-[#C30D12]" />
                      {clip.views} views
                    </span>
                    <span>•</span>
                    <span>{clip.publishedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Player */}
        {selectedClip && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
            onClick={() => setSelectedClip(null)}
          >
            <div 
              className="w-full max-w-4xl bg-[#14141A] border border-[#2B2B38] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 bg-[#1A1A22] border-b border-[#2B2B38]">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="px-2 py-0.5 rounded bg-[#C30D12] text-white text-[10px] font-heading font-extrabold uppercase">
                    {selectedClip.showTitle}
                  </span>
                  <span className="font-heading font-bold text-sm text-white truncate">
                    {selectedClip.title}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedClip(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedClip.youtubeId}?autoplay=1&rel=0`}
                  title={selectedClip.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading font-extrabold text-lg text-white">
                    {selectedClip.title}
                  </h4>
                  <p className="text-xs text-gray-300 mt-1 max-w-2xl">
                    {selectedClip.description}
                  </p>
                </div>
                <button
                  onClick={() => handleShare(selectedClip)}
                  className="shrink-0 px-4 py-2 rounded-xl bg-[#20202B] hover:bg-[#2B2B38] text-white text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 border border-white/10 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? 'Link Copied!' : 'Share Video'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Replays;

