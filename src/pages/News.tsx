import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock, User, Search, RefreshCw, AlertCircle, ArrowUpRight } from 'lucide-react';
import { fetchKenLiveNews, NewsArticle } from '../lib/wordpress';
import { SITE_CONFIG } from '../config/site';

export const News: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadNews = (categorySlug?: string) => {
    setLoading(true);
    fetchKenLiveNews(categorySlug).then((res) => {
      setArticles(res.articles);
      setIsFallback(res.isFallback);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadNews(selectedCategory);
  }, [selectedCategory]);

  const categories = [
    { slug: 'all', label: 'All News / Habari Zote' },
    { slug: 'politics', label: 'Politics / Siasa' },
    { slug: 'business', label: 'Business / Biashara' },
    { slug: 'health', label: 'Health / Afya' },
    { slug: 'sports', label: 'Sports / Michezo' },
    { slug: 'generalnews', label: 'General / Kitaifa' },
  ];

  const filteredArticles = articles.filter(a => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q);
  });

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C30D12] text-white text-[11px] font-heading font-extrabold uppercase tracking-wider">
                HABARI ZA KENLIVE
              </span>
              <span className="text-xs font-mono text-gray-400">
                kenlive.co.ke
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-gray-950 leading-tight">
              KenLive News Desk
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 light:text-gray-600 mt-1 max-w-2xl">
              Curated reporting direct from Kenya's leading investigative and county correspondents. Every article links directly to the full story on <strong>kenlive.co.ke</strong>.
            </p>
          </div>

          <a
            href={SITE_CONFIG.network.newsWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C30D12] hover:bg-[#A0090E] text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#C30D12]/20 transition-all w-fit"
          >
            <span>Visit kenlive.co.ke</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setSelectedCategory(c.slug)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider transition-all ${
                  selectedCategory === c.slug
                    ? 'bg-[#C30D12] text-white shadow-lg shadow-[#C30D12]/20'
                    : 'bg-[#14141A] dark:bg-[#14141A] light:bg-white text-gray-300 dark:text-gray-300 light:text-gray-700 hover:bg-[#1E1E28] border border-[#242430] dark:border-[#242430] light:border-gray-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news stories..."
              className="w-full bg-[#14141A] dark:bg-[#14141A] light:bg-white text-white dark:text-white light:text-gray-900 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[#242430] dark:border-[#242430] light:border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C30D12]"
            />
          </div>
        </div>

        {/* Fallback notification if live WP API endpoint is unavailable */}
        {isFallback && !loading && (
          <div className="p-3.5 mb-6 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Showing verified KenLive news archive while live feed updates. Click any article to read on kenlive.co.ke.</span>
            </div>
            <button
              onClick={() => loadNews(selectedCategory)}
              className="flex items-center gap-1 font-semibold text-white underline hover:no-underline ml-2"
            >
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>
        )}

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="rounded-2xl overflow-hidden bg-[#14141A] border border-[#242430] animate-pulse p-4 space-y-3"
              >
                <div className="aspect-video bg-gray-800 rounded-xl" />
                <div className="h-4 bg-gray-800 rounded w-1/3" />
                <div className="h-5 bg-gray-800 rounded w-5/6" />
                <div className="h-4 bg-gray-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <a
                key={art.id}
                href={art.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl overflow-hidden bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200 hover:border-[#C30D12]/60 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-black/60">
                    <img
                      src={art.featuredImageUrl}
                      alt={art.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-heading font-extrabold uppercase tracking-wider bg-[#C30D12] text-white shadow-md">
                        {art.categoryName}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 light:text-gray-500 mb-2">
                      <Clock className="w-3 h-3 text-[#C30D12]" />
                      <span>{art.timeAgo}</span>
                      <span>•</span>
                      <span className="truncate">{art.authorName}</span>
                    </div>

                    <h3 className="font-heading font-extrabold text-lg uppercase tracking-tight text-white dark:text-white light:text-gray-900 group-hover:text-[#C30D12] transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs text-gray-300 dark:text-gray-300 light:text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3.5 border-t border-[#20202B] dark:border-[#20202B] light:border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-400 light:text-gray-600 group-hover:text-[#C30D12] transition-colors bg-[#121216] dark:bg-[#121216] light:bg-gray-50">
                  <span>Read Full Story on kenlive.co.ke</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#14141A] rounded-2xl border border-[#242430]">
            <p className="text-gray-400 text-sm">No articles match your search query.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-3 px-4 py-2 rounded-xl bg-white/10 text-xs font-bold uppercase text-white hover:bg-white/20"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default News;

