import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  Wifi, 
  Radio, 
  ExternalLink,
  Clock,
  Tv,
  Check,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { STREAM_CONFIG } from '../config/stream';
import { getCurrentAndNextShow } from '../lib/time';
import { SITE_CONFIG } from '../config/site';

interface PlayerProps {
  onRegisterIntersection?: (el: HTMLElement | null) => void;
  isTheatreMode?: boolean;
}

export const Player: React.FC<PlayerProps> = ({ onRegisterIntersection, isTheatreMode = false }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true); // Start muted for mobile autoplay
  const [volume, setVolume] = useState<number>(0.8);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [qualityLevels, setQualityLevels] = useState<{ id: number; name: string }[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 = Auto
  const [isDataSaver, setIsDataSaver] = useState<boolean>(false);
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showYouTubeFallback, setShowYouTubeFallback] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<boolean>(false);

  // Time and countdown state
  const [scheduleState, setScheduleState] = useState(getCurrentAndNextShow());
  const [countdownString, setCountdownString] = useState<string>('00:00:00');

  // Timer interval for EAT show state & countdown
  useEffect(() => {
    const updateTime = () => {
      const state = getCurrentAndNextShow();
      setScheduleState(state);

      // Countdown to next show
      const remainingSeconds = state.timeRemainingMinutes * 60;
      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);
      const seconds = remainingSeconds % 60;
      setCountdownString(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Pass container to parent for IntersectionObserver (Mini-player)
  useEffect(() => {
    if (onRegisterIntersection && containerRef.current) {
      onRegisterIntersection(containerRef.current);
    }
  }, [onRegisterIntersection]);

  const hasStreamUrl = Boolean(STREAM_CONFIG.STREAM_URL && STREAM_CONFIG.STREAM_URL.trim().length > 0);

  // Initialize HLS Stream if URL provided
  useEffect(() => {
    if (!hasStreamUrl || showYouTubeFallback) {
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    setStreamError(false);

    if (Hls.isSupported()) {
      const hls = new Hls({
        capLevelToPlayerSize: true,
        startLevel: isDataSaver ? 0 : -1,
      });
      hlsRef.current = hls;

      hls.loadSource(STREAM_CONFIG.STREAM_URL);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const levels = data.levels.map((lvl, index) => ({
          id: index,
          name: `${lvl.height}p (${Math.round(lvl.bitrate / 1000)}k)`,
        }));
        setQualityLevels(levels);
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.warn('HLS fatal error encountered:', data);
          setStreamError(true);
        }
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS for Safari/iOS
      video.src = STREAM_CONFIG.STREAM_URL;
      video.addEventListener('loadedmetadata', () => {
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });
      video.addEventListener('error', () => {
        setStreamError(true);
      });
    } else {
      setStreamError(true);
    }
  }, [hasStreamUrl, showYouTubeFallback, isDataSaver]);

  // Data saver toggle
  const toggleDataSaver = () => {
    const next = !isDataSaver;
    setIsDataSaver(next);
    if (hlsRef.current) {
      if (next) {
        // Pick lowest level
        hlsRef.current.currentLevel = 0;
        setCurrentQuality(0);
      } else {
        // Return to auto
        hlsRef.current.currentLevel = -1;
        setCurrentQuality(-1);
      }
    }
  };

  const handleSelectQuality = (levelId: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelId;
      setCurrentQuality(levelId);
      if (levelId !== 0) {
        setIsDataSaver(false);
      }
    }
    setShowQualityMenu(false);
  };

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      video.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    const video = videoRef.current;
    if (video) {
      video.volume = val;
      if (val === 0) {
        video.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        video.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleToggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Auto-hide controls timeout
  const controlsTimeoutRef = useRef<any>(null);
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  // Render standby slate when no stream URL or stream error
  const isSlateActive = !hasStreamUrl || streamError;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-[#242430] shadow-2xl group select-none ${
        isTheatreMode ? 'max-h-[75vh]' : ''
      }`}
      aria-label="KenLive TV Broadcast Player"
    >
      {/* Broadcast Standby Slate (When STREAM_URL is empty or fails) */}
      {isSlateActive && !showYouTubeFallback ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-between p-4 sm:p-8 bg-gradient-to-b from-[#141418] via-[#0E0E12] to-[#08080A] text-white">
          {/* Background SMPTE Color Bars subtle watermark */}
          <div className="absolute inset-0 test-bars-pattern pointer-events-none" />

          {/* Top Slate Banner */}
          <div className="w-full flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#C30D12] text-[11px] sm:text-xs font-heading font-extrabold tracking-widest uppercase flex items-center gap-1.5 shadow-md">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                TRANSMITTER STANDBY
              </span>
              <span className="hidden sm:inline-block text-xs font-mono text-gray-400">
                CH-01 NAIROBI • {scheduleState.eatTimeString}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Up Next / Inayofuata:
              </span>
              <span className="text-xs sm:text-sm font-heading font-bold text-amber-400">
                {scheduleState.nextShow.title} ({scheduleState.nextShow.startTime} EAT)
              </span>
            </div>
          </div>

          {/* Centerpiece: KenLive Logo Badge & Program Slate */}
          <div className="flex flex-col items-center text-center my-auto z-10 max-w-lg px-2">
            {/* Logo on clean badge */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-2xl border-2 border-white/20 mb-4 transform hover:scale-105 transition-transform duration-300">
              <img 
                src="/kenlive-logo.jpg" 
                alt="KenLive TV" 
                className="h-14 sm:h-20 w-auto object-contain"
              />
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mb-1">
              WE'RE BACK <span className="text-[#C30D12]">SOON</span>
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm max-w-md font-sans mb-4">
              Matangazo ya moja kwa moja ya <strong className="text-white">KenLive TV</strong> yanarejea hivi punde. Karibu uendelee kufuatilia taarifa na burudani.
            </p>

            {/* Countdown Slate to Next Show */}
            <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 mb-5 shadow-lg">
              <Clock className="w-4 h-4 text-[#C30D12] animate-pulse" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Show Starts In:
                </div>
                <div className="font-mono text-base sm:text-lg font-bold text-white tracking-widest">
                  {countdownString}
                </div>
              </div>
            </div>

            {/* Fallback Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full">
              {/* Watch on YouTube button */}
              <button
                onClick={() => setShowYouTubeFallback(true)}
                className="px-4 py-2.5 rounded-xl bg-[#C30D12] hover:bg-[#A0090E] active:scale-95 text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C30D12]/30 transition-all"
              >
                <Tv className="w-4 h-4" />
                <span>Watch on YouTube</span>
              </button>

              {/* Listen to KenLive Radio button */}
              <a
                href={SITE_CONFIG.network.radio}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#0B5CAB] hover:bg-[#094887] active:scale-95 text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#0B5CAB]/30 transition-all"
              >
                <Radio className="w-4 h-4" />
                <span>Listen to KenLive Radio</span>
              </a>
            </div>
          </div>

          {/* Bottom Standby Info */}
          <div className="w-full flex items-center justify-between text-[11px] text-gray-400 border-t border-white/10 pt-3 z-10">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Direct Feed: <code className="text-gray-300 font-mono text-[10px]">tv.kenlive.co.ke/watch</code>
            </span>
            <span className="hidden sm:inline font-mono text-gray-400">
              KenLive Media Group © 2026
            </span>
          </div>
        </div>
      ) : null}

      {/* Embedded YouTube Fallback Mode */}
      {showYouTubeFallback ? (
        <div className="relative w-full h-full bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${STREAM_CONFIG.YOUTUBE_FALLBACK_ID}?autoplay=1&mute=0&rel=0&modestbranding=1`}
            title="KenLive Live Broadcast"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          {/* Back to slate toggle */}
          <button
            onClick={() => setShowYouTubeFallback(false)}
            className="absolute top-3 right-3 z-30 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-all flex items-center gap-1"
          >
            ← Back to Broadcast Slate
          </button>
        </div>
      ) : null}

      {/* Main Video Element (Active when STREAM_URL is provided) */}
      {hasStreamUrl && !showYouTubeFallback && (
        <>
          <video
            ref={videoRef}
            playsInline
            muted={isMuted}
            className="w-full h-full object-contain bg-black cursor-pointer"
            onClick={handleTogglePlay}
          />

          {/* Top Overlay: Station Logo & Live Pill */}
          <div className={`absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="flex items-center gap-2">
              <div className="bg-white/95 px-2 py-1 rounded-md shadow flex items-center gap-1.5">
                <img src="/kenlive-logo.jpg" alt="KenLive TV" className="h-5 w-auto object-contain" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C30D12] text-white font-heading font-extrabold text-xs tracking-wider uppercase shadow-md">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                LIVE
              </div>
            </div>

            {/* Current Show Title Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-xs text-white">
              <span className="text-gray-400">NOW:</span>
              <span className="font-bold font-heading">{scheduleState.currentShow.title}</span>
            </div>
          </div>

          {/* Bottom Controls Bar */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4 z-10 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="flex items-center justify-between gap-3">
              {/* Play / Pause & Volume */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTogglePlay}
                  className="p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-black transition-all focus:outline-none"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                {/* Volume Slider & Mute Toggle */}
                <div className="flex items-center gap-1.5 group/volume">
                  <button
                    onClick={handleToggleMute}
                    className="p-1.5 text-gray-200 hover:text-white transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5 text-red-400" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 sm:w-24 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#C30D12]"
                    aria-label="Volume"
                  />
                </div>
              </div>

              {/* Right Controls: Data Saver, Quality, Fullscreen */}
              <div className="flex items-center gap-2 sm:gap-3 relative">
                {/* Data Saver Mode for Kenyan Mobile Networks */}
                <button
                  onClick={toggleDataSaver}
                  className={`px-2.5 py-1 rounded-lg text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    isDataSaver
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-gray-300'
                  }`}
                  title="Data Saver reduces data consumption on limited bundles"
                >
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Data Saver</span>
                  <span className="sm:hidden">Saver</span>
                  {isDataSaver && <Check className="w-3 h-3 text-white" />}
                </button>

                {/* Quality Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white transition-all flex items-center gap-1 text-xs font-mono"
                    aria-label="Video Quality"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {currentQuality === -1 ? 'AUTO' : qualityLevels.find(q => q.id === currentQuality)?.name || 'HD'}
                    </span>
                  </button>

                  {/* Quality Menu Dropdown */}
                  {showQualityMenu && (
                    <div className="absolute bottom-full right-0 mb-2 w-36 bg-[#16161D] border border-[#2B2B38] rounded-xl shadow-2xl py-1 z-30 animate-in fade-in">
                      <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-[#2B2B38]">
                        Video Quality
                      </div>
                      <button
                        onClick={() => handleSelectQuality(-1)}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-white/10 ${
                          currentQuality === -1 ? 'text-[#C30D12] font-bold' : 'text-gray-300'
                        }`}
                      >
                        <span>Auto (Adaptive)</span>
                        {currentQuality === -1 && <Check className="w-3 h-3" />}
                      </button>
                      {qualityLevels.map((lvl) => (
                        <button
                          key={lvl.id}
                          onClick={() => handleSelectQuality(lvl.id)}
                          className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-white/10 ${
                            currentQuality === lvl.id ? 'text-[#C30D12] font-bold' : 'text-gray-300'
                          }`}
                        >
                          <span>{lvl.name}</span>
                          {currentQuality === lvl.id && <Check className="w-3 h-3" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={handleToggleFullscreen}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white transition-all"
                  aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
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

export default Player;

