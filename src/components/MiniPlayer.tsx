import React, { useState } from 'react';
import { X, Maximize2, Tv, Volume2 } from 'lucide-react';
import { getCurrentAndNextShow } from '../lib/time';

interface MiniPlayerProps {
  isVisible: boolean;
  onScrollToMainPlayer: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ isVisible, onScrollToMainPlayer }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const { currentShow } = getCurrentAndNextShow();

  if (!isVisible || isDismissed) return null;

  return (
    <div 
      className="fixed bottom-16 sm:bottom-6 right-3 sm:right-6 z-40 w-72 sm:w-80 bg-[#14141A] dark:bg-[#14141A] light:bg-white border-2 border-[#C30D12] rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
      role="complementary"
      aria-label="Floating Live Mini Player"
    >
      {/* Mini Player Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0B0B0C] border-b border-[#242430]">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C30D12]"></span>
          </span>
          <span className="font-heading font-extrabold text-[11px] text-white tracking-wider uppercase">
            KenLive TV Mini
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onScrollToMainPlayer}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Expand to Full Player"
            aria-label="Expand player"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
            title="Close Mini Player"
            aria-label="Close mini player"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mini Player Body */}
      <div 
        onClick={onScrollToMainPlayer}
        className="cursor-pointer relative aspect-video bg-black flex items-center justify-center group overflow-hidden"
      >
        <img 
          src="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=600&q=80" 
          alt={currentShow.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-2.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-heading font-extrabold uppercase text-[#C30D12] tracking-wider">
                AIRING NOW
              </div>
              <h4 className="font-heading font-bold text-xs sm:text-sm text-white line-clamp-1">
                {currentShow.title}
              </h4>
            </div>
            <div className="p-1.5 rounded-full bg-[#C30D12] text-white shadow-lg">
              <Tv className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;

