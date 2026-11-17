import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Video, Clock, User, ChevronRight, Filter } from 'lucide-react';
import { SHOWS, Show } from '../config/shows';

export const Shows: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All Shows' },
    { key: 'news', label: 'News & Bulletins' },
    { key: 'politics', label: 'Politics & Counties' },
    { key: 'business', label: 'Business & Economy' },
    { key: 'sports', label: 'Sports Desk' },
    { key: 'entertainment', label: 'Entertainment' },
    { key: 'culture', label: 'Culture & Life' },
  ];

  const filteredShows = activeCategory === 'all'
    ? SHOWS
    : SHOWS.filter(s => s.category === activeCategory);

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C30D12] text-white text-[11px] font-heading font-extrabold uppercase tracking-wider">
              VIPINDI VYA KENLIVE
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-gray-950 leading-tight">
            Original Shows & Programming
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 light:text-gray-600 mt-1 max-w-2xl">
            Explore KenLive TV's comprehensive directory of daily morning news reviews, hard-hitting political panels, agribusiness insights, sports commentaries, and weekend cultural shows.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-thin">
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

        {/* Shows Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShows.map((show) => (
            <Link
              key={show.slug}
              to={`/shows/${show.slug}`}
              className="group rounded-2xl overflow-hidden bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200 hover:border-[#C30D12]/60 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-black/60">
                  <img
                    src={show.thumbnail}
                    alt={show.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {show.badge && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-heading font-extrabold uppercase tracking-wider bg-[#C30D12] text-white shadow-md">
                        {show.badge}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-mono">
                      <Clock className="w-3 h-3 text-[#C30D12]" />
                      {show.airTimes}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="font-heading font-extrabold text-xl uppercase tracking-tight text-white dark:text-white light:text-gray-900 group-hover:text-[#C30D12] transition-colors">
                    {show.title}
                  </h3>
                  {show.swahiliTitle && (
                    <p className="text-xs text-gray-400 light:text-gray-500 italic mb-2">
                      {show.swahiliTitle}
                    </p>
                  )}

                  <p className="text-xs text-gray-300 dark:text-gray-300 light:text-gray-600 line-clamp-3 leading-relaxed mt-1">
                    {show.shortDescription}
                  </p>
                </div>
              </div>

              {/* Presenter Footer */}
              <div className="px-5 py-3.5 border-t border-[#20202B] dark:border-[#20202B] light:border-gray-100 flex items-center justify-between bg-[#121216] dark:bg-[#121216] light:bg-gray-50">
                <div className="flex items-center gap-2.5">
                  <img
                    src={show.presenter.avatar}
                    alt={show.presenter.name}
                    className="w-7 h-7 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-200 dark:text-gray-200 light:text-gray-800 block leading-none">
                      {show.presenter.name}
                    </span>
                    <span className="text-[10px] text-gray-400 light:text-gray-500">
                      {show.presenter.role}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#C30D12] group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Shows;

