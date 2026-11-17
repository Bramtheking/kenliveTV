import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, 
  User, 
  Calendar, 
  Tv, 
  Share2, 
  ChevronLeft, 
  ArrowRight, 
  Play, 
  Radio, 
  Check 
} from 'lucide-react';
import { SHOWS } from '../config/shows';
import { REPLAYS_DATA } from '../config/replays';

export const ShowDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const show = SHOWS.find(s => s.slug === slug);

  if (!show) {
    return (
      <main className="min-h-screen py-20 flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-heading text-4xl font-extrabold text-white mb-2">Show Not Found</h1>
        <p className="text-gray-400 text-sm mb-6">Samahani, hatukupata kipindi ulichotafuta.</p>
        <Link 
          to="/shows" 
          className="px-6 py-2.5 rounded-xl bg-[#C30D12] text-white font-heading font-bold uppercase"
        >
          Back to Shows Directory
        </Link>
      </main>
    );
  }

  // Related replays for this show or category
  const relatedClips = REPLAYS_DATA.filter(
    r => r.showTitle.toLowerCase().includes(show.title.toLowerCase()) || r.category === show.category
  );

  return (
    <main className="min-h-screen pb-16">
      {/* Hero Banner */}
      <div className="relative h-72 sm:h-96 w-full bg-black overflow-hidden">
        <img
          src={show.thumbnail}
          alt={show.title}
          className="w-full h-full object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/70 to-transparent" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8">
          <Link
            to="/shows"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-4 w-fit transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Shows (Vipindi)</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            {show.badge && (
              <span className="px-2.5 py-0.5 rounded-md bg-[#C30D12] text-white text-[11px] font-heading font-extrabold uppercase tracking-wider">
                {show.badge}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-md bg-[#0B5CAB]/30 border border-[#0B5CAB]/40 text-[#0B5CAB] text-[11px] font-heading font-extrabold uppercase tracking-wider">
              {show.category}
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-6xl font-extrabold uppercase tracking-tight text-white leading-tight">
            {show.title}
          </h1>

          {show.swahiliTitle && (
            <p className="text-sm sm:text-base text-gray-300 italic font-sans mt-1">
              {show.swahiliTitle}
            </p>
          )}
        </div>
      </div>

      {/* Main Content Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Details (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Air Times & Live Watch CTA */}
            <div className="p-5 rounded-2xl bg-[#14141A] border border-[#242430] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#C30D12]/20 text-[#C30D12]">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] font-heading font-extrabold uppercase text-gray-400 tracking-wider">
                    BROADCAST TIME (EAT)
                  </div>
                  <div className="font-mono text-base font-bold text-white">
                    {show.airTimes}
                  </div>
                </div>
              </div>

              <Link
                to="/watch"
                className="px-6 py-3 rounded-xl bg-[#C30D12] hover:bg-[#A0090E] active:scale-95 text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C30D12]/30 transition-all w-fit"
              >
                <Tv className="w-4 h-4" />
                <span>Watch KenLive TV Live</span>
              </Link>
            </div>

            {/* Synopsis */}
            <div>
              <h2 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-white mb-3">
                About the Show
              </h2>
              <div className="prose prose-invert max-w-none text-sm sm:text-base text-gray-300 leading-relaxed space-y-4">
                <p>{show.fullDescription}</p>
                <p>{show.shortDescription}</p>
              </div>
            </div>

            {/* Related Video Clips */}
            {relatedClips.length > 0 && (
              <div className="pt-6 border-t border-[#242430]">
                <h3 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-white mb-4">
                  Recent Clips & Segments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedClips.map((clip) => (
                    <Link
                      key={clip.id}
                      to="/replays"
                      className="group rounded-xl overflow-hidden bg-[#14141A] border border-[#242430] hover:border-[#C30D12] transition-colors"
                    >
                      <div className="relative aspect-video">
                        <img src={clip.thumbnail} alt={clip.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white fill-current opacity-80 group-hover:opacity-100" />
                        </div>
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                          {clip.duration}
                        </span>
                      </div>
                      <div className="p-3">
                        <h4 className="font-heading font-bold text-sm text-white group-hover:text-[#C30D12] line-clamp-2">
                          {clip.title}
                        </h4>
                        <span className="text-[11px] text-gray-400 mt-1 block">
                          {clip.views} views • {clip.publishedAt}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Presenter Bio Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl bg-[#14141A] border border-[#242430] p-6 shadow-xl text-center">
              <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-[#C30D12] mb-4 shadow-xl">
                <img
                  src={show.presenter.avatar}
                  alt={show.presenter.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-[11px] font-heading font-extrabold uppercase tracking-widest text-[#C30D12] mb-1">
                HOST / ANCHOR
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-white uppercase tracking-tight">
                {show.presenter.name}
              </h3>
              <p className="text-xs font-semibold text-gray-400 mb-3">
                {show.presenter.role}
              </p>

              <p className="text-xs text-gray-300 leading-relaxed border-t border-[#242430] pt-4 text-left">
                {show.presenter.bio}
              </p>
            </div>

            {/* Quick Broadcast Notice */}
            <div className="rounded-2xl bg-[#14141A] border border-[#242430] p-5">
              <div className="text-xs font-heading font-extrabold uppercase text-gray-400 mb-2">
                Have a tip or question for this show?
              </div>
              <p className="text-xs text-gray-300 mb-3">
                Reach the production team directly via WhatsApp or studio email during live broadcast hours.
              </p>
              <Link
                to="/contact"
                className="text-xs font-heading font-bold uppercase text-[#C30D12] hover:underline flex items-center gap-1"
              >
                <span>Contact Studio Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ShowDetail;

