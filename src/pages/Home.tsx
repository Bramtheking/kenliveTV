import React, { useState, useEffect, useRef } from 'react';
import Player from '../components/Player';
import LiveChat from '../components/LiveChat';
import NowNextCard from '../components/NowNextCard';
import BreakingTicker from '../components/BreakingTicker';
import ScheduleStrip from '../components/ScheduleStrip';
import NewsSection from '../components/NewsSection';
import ShowsGrid from '../components/ShowsGrid';
import ReplaysSection from '../components/ReplaysSection';
import RadioStrip from '../components/RadioStrip';
import WatchAnywhere from '../components/WatchAnywhere';
import SponsorsRow from '../components/SponsorsRow';
import MiniPlayer from '../components/MiniPlayer';

export const Home: React.FC = () => {
  const [playerElement, setPlayerElement] = useState<HTMLElement | null>(null);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [isChatPopout, setIsChatPopout] = useState(false);

  // Monitor scrolling past the main player to activate the floating mini-player
  useEffect(() => {
    if (!playerElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When main player is not intersecting, show mini player
        setShowMiniPlayer(!entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(playerElement);
    return () => observer.disconnect();
  }, [playerElement]);

  const handleScrollToPlayer = () => {
    if (playerElement) {
      playerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen">
      {/* 1. HERO SECTION: 16:9 Live Player (Left) + Live Chat (Right) on Desktop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Hero Player Column (8 cols desktop) */}
          <div className="lg:col-span-8 flex flex-col">
            <Player onRegisterIntersection={setPlayerElement} />
            <NowNextCard />
          </div>

          {/* Live Chat Column (4 cols desktop, stacked/collapsible mobile) */}
          <div className="lg:col-span-4 mt-2 lg:mt-0">
            <LiveChat 
              isPopout={isChatPopout} 
              onTogglePopout={() => setIsChatPopout(!isChatPopout)} 
            />
          </div>
        </div>
      </section>

      {/* 2. BREAKING NEWS TICKER */}
      <BreakingTicker />

      {/* Container for the remaining homepage content sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3. TODAY'S SCHEDULE STRIP */}
        <ScheduleStrip />

        {/* 4. LATEST FROM KENLIVE NEWS */}
        <NewsSection />

        {/* 5. OUR SHOWS GRID */}
        <ShowsGrid />

        {/* 6. REPLAYS AND CLIPS */}
        <ReplaysSection />

        {/* 7. KENLIVE RADIO STRIP */}
        <RadioStrip />

        {/* 8. WATCH ANYWHERE */}
        <WatchAnywhere />

        {/* 9. SPONSORS & ADVERTISE CTA */}
        <SponsorsRow />
      </div>

      {/* Floating Mini-Player for mobile/desktop when scrolled past main hero */}
      <MiniPlayer 
        isVisible={showMiniPlayer} 
        onScrollToMainPlayer={handleScrollToPlayer} 
      />
    </main>
  );
};

export default Home;

