import React, { useState, useRef } from 'react';
import { Radio, Play, Pause, Volume2, VolumeX, ExternalLink } from 'lucide-react';
import { STREAM_CONFIG } from '../config/stream';
import { SITE_CONFIG } from '../config/site';

export const RadioStrip: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => {
        console.warn("Audio playback error:", err);
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="my-8 sm:my-12">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0B5CAB]/90 via-[#0B2545] to-[#121218] border border-[#0B5CAB]/40 shadow-2xl p-5 sm:p-7 text-white">
        {/* Subtle decorative background wave */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Radio className="w-64 h-64 text-blue-300" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left: Radio Station branding & info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-lg">
              <Radio className="w-7 h-7 text-blue-300 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-heading font-extrabold uppercase tracking-wider bg-blue-500 text-white shadow-sm">
                  LIVE AUDIO BROADCAST
                </span>
                <span className="text-xs text-blue-200">
                  radio.kenlive.co.ke
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl uppercase tracking-tight text-white leading-tight">
                Listen Live on KenLive Radio
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/80 font-sans">
                Sauti Safi, Muziki Bora, na Habari Papo Hapo Moja kwa Moja
              </p>
            </div>
          </div>

          {/* Center: Equalizer wave bars (animated when playing) */}
          <div className="flex items-center gap-1.5 h-8 px-4 py-1 rounded-xl bg-black/30 backdrop-blur-sm self-start md:self-center">
            {[60, 100, 40, 80, 50, 90, 70, 30].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-[#1677D2] rounded-full transition-all duration-300"
                style={{
                  height: isPlaying ? `${Math.max(20, Math.round(h * 0.8))}%` : '20%',
                  animation: isPlaying ? `pulse 0.8s ease-in-out infinite alternate ${i * 0.1}s` : 'none',
                }}
              />
            ))}
            <span className="text-[11px] font-mono text-blue-200 ml-2 font-bold">
              {isPlaying ? 'ON AIR' : 'PAUSED'}
            </span>
          </div>

          {/* Right: Audio Play Controls & Link */}
          <div className="flex items-center gap-3">
            {/* Hidden HTML5 Audio Element */}
            <audio
              ref={audioRef}
              src={STREAM_CONFIG.RADIO_STREAM_URL}
              preload="none"
              onEnded={() => setIsPlaying(false)}
            />

            {/* Play / Pause Toggle Button */}
            <button
              onClick={togglePlay}
              className="px-5 py-3 rounded-xl bg-white hover:bg-gray-100 active:scale-95 text-[#0B2545] font-heading font-bold text-sm uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-black/30 transition-all min-h-[44px]"
              aria-label={isPlaying ? 'Pause radio' : 'Play radio'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Radio</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Tazama Live Redio</span>
                </>
              )}
            </button>

            {/* Mute button */}
            <button
              onClick={toggleMute}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isMuted ? 'Unmute radio' : 'Mute radio'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-300" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* External Radio Portal Link */}
            <a
              href={SITE_CONFIG.network.radio}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Open full KenLive Radio portal"
              aria-label="Open radio site"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RadioStrip;
