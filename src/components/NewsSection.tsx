import React, { useEffect, useState } from 'react';
import { ExternalLink, Newspaper, Clock, ArrowUpRight } from 'lucide-react';
import { fetchKenLiveNews, NewsArticle } from '../lib/wordpress';
import { SITE_CONFIG } from '../config/site';

export const NewsSection: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    fetchKenLiveNews().then((res) => {
      if (mounted) {
        setArticles(res.articles.slice(0, 6));
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="my-10 sm:my-14">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#C30D12]/15 text-[#C30D12]">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-gray-950 dark:text-white">
                Latest From KenLive News
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#0B5CAB]/10 text-[#0B5CAB] border border-[#0B5CAB]/30 uppercase">
                KENLIVE.CO.KE
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Habari za Uhakika kutoka kwa Waandishi Wetu wa Habari
            </p>
          </div>
        </div>

        <a
          href={SITE_CONFIG.network.newsWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-gray-100 hover:bg-[#C30D12] text-gray-800 hover:text-white dark:bg-[#1C1C26] dark:text-gray-200 dark:hover:bg-[#C30D12] dark:hover:text-white transition-all shadow-sm w-fit border border-gray-200 dark:border-transparent"
        >
          <span>Read More on kenlive.co.ke</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      {/* Grid of 6 Articles or Skeleton Loaders */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="rounded-2xl overflow-hidden bg-white dark:bg-[#14141A] border border-gray-200 dark:border-[#242430] animate-pulse p-4 space-y-3"
            >
              <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((art) => (
            <a
              key={art.id}
              href={art.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl overflow-hidden bg-white dark:bg-[#14141A] border border-gray-200 dark:border-[#242430] hover:border-[#C30D12]/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail image with category tag overlay */}
                <div className="relative aspect-video overflow-hidden bg-black/50">
                  <img
                    src={art.featuredImageUrl}
                    alt={art.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=700&q=80";
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-heading font-extrabold uppercase tracking-wider bg-[#C30D12] text-white shadow-md">
                      {art.categoryName}
                    </span>
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 mb-2">
                    <Clock className="w-3 h-3 text-[#C30D12]" />
                    <span>{art.timeAgo}</span>
                    <span>•</span>
                    <span className="truncate">{art.authorName}</span>
                  </div>

                  <h3 className="font-heading font-bold text-base sm:text-lg uppercase tracking-tight text-gray-900 dark:text-white group-hover:text-[#C30D12] transition-colors line-clamp-2 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3 border-t border-gray-100 dark:border-[#20202B] flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 group-hover:text-[#C30D12] transition-colors">
                <span>Read Full Story</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Bottom Hub CTA */}
      <div className="mt-8 text-center">
        <a
          href={SITE_CONFIG.network.newsWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C30D12] to-[#E01C22] text-white font-heading font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-[#C30D12]/30 hover:scale-105 active:scale-95 transition-all"
        >
          <span>Explore All Breaking News on kenlive.co.ke</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};

export default NewsSection;
