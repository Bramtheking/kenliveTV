import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  Settings, Wifi, Tv, Clock, Check,
} from "lucide-react";
import { STREAM_CONFIG } from "@/config/stream";

interface TVPlayerProps {
  onRegisterIntersection?: (el: HTMLElement | null) => void;
}

const SCHEDULE_PLACEHOLDER = { current: "KenLive TV Live", next: "Live Broadcast" };

const TVPlayer = ({ onRegisterIntersection }: TVPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [qualityLevels, setQualityLevels] = useState<{ id: number; name: string }[]>([]);
  const [currentQuality, setCurrentQuality] = useState(-1);
  const [isDataSaver, setIsDataSaver] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showYouTubeFallback, setShowYouTubeFallback] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const controlsTimerRef = useRef<any>(null);

  const hasStream = Boolean(STREAM_CONFIG.STREAM_URL?.trim());

  useEffect(() => {
    if (onRegisterIntersection && containerRef.current) {
      onRegisterIntersection(containerRef.current);
    }
  }, [onRegisterIntersection]);

  useEffect(() => {
    if (!hasStream || showYouTubeFallback) return;
    const video = videoRef.current;
    if (!video) return;
    setStreamError(false);

    if (Hls.isSupported()) {
      const hls = new Hls({ capLevelToPlayerSize: true, startLevel: isDataSaver ? 0 : -1 });
      hlsRef.current = hls;
      hls.loadSource(STREAM_CONFIG.STREAM_URL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setQualityLevels(data.levels.map((lvl, i) => ({
          id: i,
          name: `${lvl.height}p (${Math.round(lvl.bitrate / 1000)}k)`,
        })));
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });
      hls.on(Hls.Events.ERROR, (_, data) => { if (data.fatal) setStreamError(true); });
      return () => { hls.destroy(); hlsRef.current = null; };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = STREAM_CONFIG.STREAM_URL;
      video.addEventListener("loadedmetadata", () => {
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });
      video.addEventListener("error", () => setStreamError(true));
    } else {
      setStreamError(true);
    }
  }, [hasStream, showYouTubeFallback, isDataSaver]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => { if (isPlaying) setShowControls(false); }, 3500);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) { v.pause(); setIsPlaying(false); }
    else { v.play().then(() => setIsPlaying(true)).catch(console.error); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isMuted) { v.muted = false; v.volume = volume || 0.8; setIsMuted(false); }
    else { v.muted = true; setIsMuted(true); }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    const v = videoRef.current;
    if (v) {
      v.volume = val;
      if (val === 0) { v.muted = true; setIsMuted(true); }
      else if (isMuted) { v.muted = false; setIsMuted(false); }
    }
  };

  const toggleFullscreen = () => {
    const c = containerRef.current;
    if (!c) return;
    if (!document.fullscreenElement) c.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    else document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
  };

  const toggleDataSaver = () => {
    const next = !isDataSaver;
    setIsDataSaver(next);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = next ? 0 : -1;
      setCurrentQuality(next ? 0 : -1);
    }
  };

  const selectQuality = (id: number) => {
    if (hlsRef.current) { hlsRef.current.currentLevel = id; setCurrentQuality(id); if (id !== 0) setIsDataSaver(false); }
    setShowQualityMenu(false);
  };

  const isSlate = !hasStream || streamError;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl group select-none"
      aria-label="KenLive TV Broadcast Player"
    >
      {/* ── STANDBY SLATE ── */}
      {isSlate && !showYouTubeFallback && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-between p-4 sm:p-8 bg-gradient-to-b from-[#141418] via-[#0E0E12] to-[#08080A] text-white">
          {/* Top bar */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="px-2.5 py-1 rounded-md bg-primary text-[11px] font-extrabold tracking-widest uppercase flex items-center gap-1.5 shadow-md">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              TRANSMITTER STANDBY
            </span>
            <span className="text-xs font-mono text-gray-400 hidden sm:block">CH-01 NAIROBI</span>
          </div>

          {/* Centre */}
          <div className="flex flex-col items-center text-center my-auto z-10 max-w-md px-2">
            <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-2xl border-2 border-white/20 mb-4">
              <img src="/kenlive-logo.jpg" alt="KenLive TV" className="h-14 sm:h-20 w-auto object-contain" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight mb-2">
              WE'RE BACK <span className="text-primary">SOON</span>
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm max-w-sm mb-5">
              Matangazo ya moja kwa moja ya <strong className="text-white">KenLive TV</strong> yanarejea hivi punde.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setShowYouTubeFallback(true)}
                className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Tv className="w-4 h-4" /> Watch on YouTube
              </button>
            </div>
          </div>

          {/* Bottom */}
          <div className="w-full flex items-center justify-between text-[11px] text-gray-400 border-t border-white/10 pt-3 z-10">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              tv.kenlive.co.ke
            </span>
            <span className="hidden sm:inline font-mono">KenLive Media Group © 2026</span>
          </div>
        </div>
      )}

      {/* ── YOUTUBE FALLBACK ── */}
      {showYouTubeFallback && (
        <div className="relative w-full h-full bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${STREAM_CONFIG.YOUTUBE_FALLBACK_ID}?autoplay=1&mute=0&rel=0&modestbranding=1`}
            title="KenLive TV"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <button
            onClick={() => setShowYouTubeFallback(false)}
            className="absolute top-3 right-3 z-30 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-all flex items-center gap-1"
          >
            ← Back to Slate
          </button>
        </div>
      )}

      {/* ── LIVE VIDEO ── */}
      {hasStream && !showYouTubeFallback && (
        <>
          <video
            ref={videoRef}
            playsInline
            muted={isMuted}
            className="w-full h-full object-contain bg-black cursor-pointer"
            onClick={togglePlay}
          />

          {/* Top overlay */}
          <div className={`absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="flex items-center gap-2">
              <div className="bg-white/95 px-2 py-1 rounded-md shadow flex items-center gap-1.5">
                <img src="/kenlive-logo.jpg" alt="KenLive TV" className="h-5 w-auto object-contain" />
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary text-white font-extrabold text-xs tracking-wider uppercase shadow-md">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" /> LIVE
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-xs text-white">
              <span className="text-gray-400">NOW:</span>
              <span className="font-bold">{SCHEDULE_PLACEHOLDER.current}</span>
            </div>
          </div>

          {/* Bottom controls */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4 z-10 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-black transition-all focus:outline-none" aria-label={isPlaying ? "Pause" : "Play"}>
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
                <div className="flex items-center gap-1.5">
                  <button onClick={toggleMute} className="p-1.5 text-gray-200 hover:text-white" aria-label="Toggle mute">
                    {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume}
                    onChange={handleVolume}
                    className="w-16 sm:w-24 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 relative">
                <button
                  onClick={toggleDataSaver}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${isDataSaver ? "bg-emerald-600 text-white" : "bg-white/10 hover:bg-white/20 text-gray-300"}`}
                  title="Data Saver"
                >
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Data Saver</span>
                  {isDataSaver && <Check className="w-3 h-3" />}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white transition-all flex items-center gap-1 text-xs font-mono"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">{currentQuality === -1 ? "AUTO" : qualityLevels.find(q => q.id === currentQuality)?.name || "HD"}</span>
                  </button>
                  {showQualityMenu && (
                    <div className="absolute bottom-full right-0 mb-2 w-36 bg-[#16161D] border border-[#2B2B38] rounded-xl shadow-2xl py-1 z-30">
                      <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase border-b border-[#2B2B38]">Quality</div>
                      <button onClick={() => selectQuality(-1)} className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-white/10 ${currentQuality === -1 ? "text-primary font-bold" : "text-gray-300"}`}>
                        <span>Auto (Adaptive)</span>
                        {currentQuality === -1 && <Check className="w-3 h-3" />}
                      </button>
                      {qualityLevels.map(lvl => (
                        <button key={lvl.id} onClick={() => selectQuality(lvl.id)} className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-white/10 ${currentQuality === lvl.id ? "text-primary font-bold" : "text-gray-300"}`}>
                          <span>{lvl.name}</span>
                          {currentQuality === lvl.id && <Check className="w-3 h-3" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={toggleFullscreen} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white transition-all">
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TVPlayer;
