import React, { useState } from 'react';
import { Flame, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TickerItem {
  id: string;
  title: string;
  category: string;
  url?: string;
}

const DEFAULT_HEADLINES: TickerItem[] = [
  { id: "1", category: "POLITICS", title: "National Assembly convenes special sitting on county revenue allocation formula" },
  { id: "2", category: "ECONOMY", title: "Central Bank of Kenya reports increased diaspora remittances crossing $450M mark" },
  { id: "3", category: "LIVE NOW", title: "KenLive TV live special broadcast: In-depth analysis on Kenya's economic revival plan" },
  { id: "4", category: "SPORTS", title: "Harambee Stars begin intensive residential training in Nairobi ahead of continental qualifiers" },
  { id: "5", category: "COUNTIES", title: "Mombasa and Kisumu launch integrated green transport pilot projects" },
  { id: "6", category: "AGRICULTURE", title: "Tea & Coffee smallholders receive bonus payment confirmation across Mt. Kenya region" },
];

export const BreakingTicker: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div 
      className="w-full bg-[#C30D12] text-white flex items-center overflow-hidden h-10 sm:h-11 shadow-inner relative z-20 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      role="region"
      aria-label="Breaking News Ticker"
    >
      {/* Static Badge Label */}
      <div className="shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-1 h-full bg-[#9A0A0E] text-white font-heading font-extrabold text-xs sm:text-sm uppercase tracking-wider z-10 shadow-[4px_0_12px_rgba(0,0,0,0.3)]">
        <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
        <span className="whitespace-nowrap">HABARI MOTO</span>
        <span className="hidden sm:inline font-normal opacity-80 text-xs">/ BREAKING</span>
      </div>

      {/* Ticker marquee container */}
      <div className="relative overflow-hidden w-full flex items-center h-full">
        <div 
          className="flex whitespace-nowrap items-center gap-8 pl-4"
          style={{
            animation: 'ticker 40s linear infinite',
            animationPlayState: isPaused ? 'paused' : 'running',
            width: 'max-content',
          }}
        >
          {/* Double list to create seamless infinite loop */}
          {[...DEFAULT_HEADLINES, ...DEFAULT_HEADLINES].map((item, idx) => (
            <Link
              key={`${item.id}-${idx}`}
              to="/news"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium hover:underline text-white/95 hover:text-white transition-opacity"
            >
              <span className="px-1.5 py-0.5 rounded bg-black/25 text-[10px] font-bold uppercase tracking-wider text-amber-200">
                {item.category}
              </span>
              <span>{item.title}</span>
              <span className="opacity-40 ml-3">•</span>
            </Link>
          ))}
        </div>
      </div>

      {/* "All News" Quick Link at end on desktop */}
      <div className="hidden md:flex shrink-0 items-center h-full px-3 bg-[#9A0A0E] hover:bg-[#80070A] transition-colors z-10">
        <Link to="/news" className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 text-white hover:text-amber-200">
          Habari Zote <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default BreakingTicker;

