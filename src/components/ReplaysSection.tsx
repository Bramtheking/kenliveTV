import React, { useState } from 'react';
import { Play, Eye, X, Share2, Film, Check } from 'lucide-react';
import { REPLAYS_DATA, ReplayClip } from '../config/replays';

export const ReplaysSection: React.FC = () => {
  const [selectedClip, setSelectedClip] = useState<ReplayClip | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = (clip: ReplayClip) => {
    const url = `https://www.youtube.com/watch?v=${clip.youtubeId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="my-10 sm:my-14">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#C30D12]/15 text-[#C30D12]">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-gray-950 dark:text-white">
                Replays & Viral Clips
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#C30D12] text-white uppercase">
                MARUDIO
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Catch up on highlights, top interviews, and unmissable panel discussions
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Replays */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {REPLAYS_DATA.map((clip) => (
          <div
            key={clip.id}
            onClick={() => setSelectedClip(clip)}
            className="group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-[#14141A] border border-gray-200 dark:border-[#242430] hover:border-[#C30D12]/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between shadow-sm"
          >
            <div>
              {/* Thumbnail with duration badge & hover play icon */}
              <div className="relative aspect-video overflow-hidden bg-black/70">
                <img
                  src={clip.thumbnail}
                  alt={clip.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#C30D12]/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-white text-[11px] font-mono font-bold">
                  {clip.duration}
                </div>

                {/* Category tag */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-heading font-extrabold uppercase tracking-wider text-amber-300">
                  {clip.showTitle}
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="p-4">
                <h3 className="font-heading font-bold text-base sm:text-lg uppercase tracking-tight text-gray-900 dark:text-white group-hover:text-[#C30D12] transition-colors line-clamp-2 leading-snug">
                  {clip.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2.5">
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

      {/* Replay Video Modal Player */}
      {selectedClip && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedClip(null)}
        >
          <div 
            className="w-full max-w-4xl bg-white dark:bg-[#14141A] border border-gray-300 dark:border-[#2B2B38] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-[#1A1A22] border-b border-gray-200 dark:border-[#2B2B38]">
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="px-2 py-0.5 rounded bg-[#C30D12] text-white text-[10px] font-heading font-extrabold uppercase">
                  {selectedClip.showTitle}
                </span>
                <span className="font-heading font-bold text-sm text-gray-900 dark:text-white truncate">
                  {selectedClip.title}
                </span>
              </div>
              <button
                onClick={() => setSelectedClip(null)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Embed */}
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedClip.youtubeId}?autoplay=1&rel=0`}
                title={selectedClip.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer / Description */}
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-heading font-extrabold text-lg text-gray-900 dark:text-white">
                  {selectedClip.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
                  {selectedClip.description}
                </p>
              </div>

              <button
                onClick={() => handleShare(selectedClip)}
                className="shrink-0 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-[#20202B] dark:hover:bg-[#2B2B38] dark:text-white text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 border border-gray-300 dark:border-white/10 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Link Copied!' : 'Share Video'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReplaysSection;
