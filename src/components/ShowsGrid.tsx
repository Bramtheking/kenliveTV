import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Clock, ChevronRight } from 'lucide-react';
import { SHOWS } from '../config/shows';

export const ShowsGrid: React.FC = () => {
  return (
    <section className="my-10 sm:my-14">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#C30D12]/15 text-[#C30D12]">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-gray-950 dark:text-white">
                Our Shows
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#C30D12] text-white uppercase">
                VIPINDI VYA KENLIVE
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Flagship News Bulletins, Political Panels & East African Entertainment
            </p>
          </div>
        </div>

        <Link
          to="/shows"
          className="text-xs sm:text-sm font-heading font-bold uppercase tracking-wider text-[#C30D12] hover:text-[#E01C22] flex items-center gap-1 group w-fit"
        >
          <span>View All Shows Directory</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid of Shows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SHOWS.map((show) => (
          <Link
            key={show.slug}
            to={`/shows/${show.slug}`}
            className="group rounded-2xl overflow-hidden bg-white dark:bg-[#14141A] border border-gray-200 dark:border-[#242430] hover:border-[#C30D12]/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between shadow-sm"
          >
            <div>
              {/* Show Thumbnail & Badges */}
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

              {/* Show Details */}
              <div className="p-4">
                <h3 className="font-heading font-extrabold text-lg sm:text-xl uppercase tracking-tight text-gray-900 dark:text-white group-hover:text-[#C30D12] transition-colors leading-tight">
                  {show.title}
                </h3>
                {show.swahiliTitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-0.5 mb-2">
                    {show.swahiliTitle}
                  </p>
                )}

                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                  {show.shortDescription}
                </p>
              </div>
            </div>

            {/* Presenter Footer */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-[#20202B] bg-gray-50/70 dark:bg-transparent flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={show.presenter.avatar}
                  alt={show.presenter.name}
                  className="w-6 h-6 rounded-full object-cover border border-gray-300 dark:border-white/20"
                />
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-300">
                  {show.presenter.name}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-[#C30D12] transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ShowsGrid;
