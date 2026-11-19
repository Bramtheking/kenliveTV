import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import TVPlayer from "@/components/TVPlayer";
import LiveChat from "@/components/LiveChat";
import NewsSection from "@/components/NewsSection";
import ScheduleDisplay from "@/components/ScheduleDisplay";
import SubscribeForm from "@/components/SubscribeForm";
import Footer from "@/components/Footer";
import { Tv, ChevronDown } from "lucide-react";

const Index = () => {
  const [playerEl, setPlayerEl] = useState<HTMLElement | null>(null);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [isChatPopout, setIsChatPopout] = useState(false);

  // Mini-player: show when hero is scrolled past
  useEffect(() => {
    if (!playerEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowMiniPlayer(!entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(playerEl);
    return () => observer.disconnect();
  }, [playerEl]);

  const scrollToPlayer = () => playerEl?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>KenLive TV – Kenya's Premier Digital News & Entertainment Channel</title>
        <meta
          name="description"
          content="Watch KenLive TV live – Kenya's premier 24/7 digital TV channel for breaking news, politics, sports and entertainment. Tazama Live."
        />
        <link rel="canonical" href="https://tv.kenlive.co.ke/" />
      </Helmet>

      <Navbar />

      {/* ══ HERO: Player + Live Chat ══ */}
      <section className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6">
        {/* TV Channel header strip */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-extrabold uppercase tracking-wider shadow-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            LIVE NOW
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
            <Tv className="w-4 h-4" />
            KenLive TV • HD 24/7
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Player column */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <TVPlayer onRegisterIntersection={setPlayerEl} />

            {/* Brief description */}
            <div className="text-xs text-muted-foreground px-1">
              Kenya's independent digital TV — breaking news, investigative reporting, parliamentary debates & entertainment. 
              <span className="font-semibold text-foreground"> Sauti ya Wananchi na Habari za Kweli.</span>
            </div>
          </div>

          {/* Live Chat column */}
          <div className="lg:col-span-4 mt-2 lg:mt-0">
            <LiveChat
              isPopout={isChatPopout}
              onTogglePopout={() => setIsChatPopout(!isChatPopout)}
            />
          </div>
        </div>
      </section>

      {/* ══ SUBSCRIBE FORM ══ */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <SubscribeForm />
      </div>

      {/* ══ SCHEDULE + NEWS ══ */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* News section — takes 8 cols */}
          <div className="lg:col-span-8">
            <NewsSection />
          </div>

          {/* Schedule sidebar — takes 4 cols */}
          <div className="lg:col-span-4">
            <ScheduleDisplay />
          </div>
        </div>
      </div>

      <Footer />

      {/* ══ FLOATING MINI-PLAYER (when scrolled past hero) ══ */}
      {showMiniPlayer && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-secondary border border-border rounded-2xl shadow-2xl overflow-hidden w-72">
            <div className="bg-primary px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                <span className="font-bold text-primary-foreground text-sm">KenLive TV Live</span>
              </div>
              <button
                onClick={scrollToPlayer}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors p-1"
                title="Scroll to player"
              >
                <ChevronDown className="w-4 h-4 rotate-180" />
              </button>
            </div>
            <button
              onClick={scrollToPlayer}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors text-sm text-foreground font-medium"
            >
              <div className="bg-muted rounded-lg p-2">
                <Tv className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div>Return to Player</div>
                <div className="text-xs text-muted-foreground">Watch live stream</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
