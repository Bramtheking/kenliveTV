import React, { useState } from 'react';
import { Smartphone, Tv, Check, BellRing, Sparkles, Send } from 'lucide-react';

export const WatchAnywhere: React.FC = () => {
  const [contactInput, setContactInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactInput.trim().length > 3) {
      setSubscribed(true);
      setContactInput('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <section className="my-10 sm:my-16">
      <div className="rounded-3xl bg-gradient-to-br from-[#181822] via-[#121218] to-[#0D0D12] border border-[#2B2B38] p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        {/* Glow accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C30D12]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0B5CAB]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left info & signup */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C30D12]/20 border border-[#C30D12]/40 text-[#C30D12] text-xs font-heading font-extrabold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Platform Broadcasting</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mb-2 leading-tight">
              Watch KenLive TV Anywhere, <span className="text-[#C30D12]">Anytime</span>
            </h2>

            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              Tazama matangazo ya moja kwa moja kwenye simu yako, kompyuta, au Smart TV bila kukatizwa. We are optimizing our stream specifically for low-latency and light data consumption across all 47 counties.
            </p>

            {/* Google Play & Android TV badging */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Google play badge button */}
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black border border-white/20 shadow-lg cursor-pointer hover:border-[#C30D12] transition-colors">
                <div className="text-xl">▶</div>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold text-gray-400 leading-none">
                    COMING SOON ON
                  </div>
                  <div className="font-heading font-extrabold text-sm text-white leading-tight">
                    Google Play
                  </div>
                </div>
              </div>

              {/* Smart TV / Android TV Pill */}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#20202C] border border-white/10 text-gray-200">
                <Tv className="w-4 h-4 text-[#0B5CAB]" />
                <span className="text-xs font-heading font-bold uppercase tracking-wider">
                  Android TV & Apple AirPlay
                </span>
              </div>
            </div>

            {/* App Launch Alerts Sign-up Form */}
            <div className="bg-[#14141A] border border-[#2B2B38] rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <BellRing className="w-4 h-4 text-amber-400" />
                <span className="font-heading font-bold text-sm uppercase text-white tracking-wide">
                  Get Notified When Mobile App Drops
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Enter your WhatsApp number or Email to receive the direct download link and early access features.
              </p>

              {subscribed ? (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Asante! You are on the VIP early access list. We will alert you on launch day.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    required
                    value={contactInput}
                    onChange={(e) => setContactInput(e.target.value)}
                    placeholder="WhatsApp No (+254...) or Email"
                    className="flex-1 bg-[#1C1C26] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#313142] focus:outline-none focus:ring-2 focus:ring-[#C30D12] min-h-[44px]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#C30D12] hover:bg-[#A0090E] active:scale-95 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all min-h-[44px]"
                  >
                    <span>Get Alerts</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right visual devices presentation */}
          <div className="relative flex justify-center items-center">
            {/* TV Frame Representation */}
            <div className="w-full max-w-md bg-[#000000] rounded-2xl p-2 sm:p-3 border-4 border-gray-800 shadow-2xl relative">
              <div className="aspect-video rounded-lg overflow-hidden relative bg-gray-900">
                <img
                  src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=700&q=80"
                  alt="KenLive TV Broadcast"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded shadow">
                  <img src="/kenlive-logo.jpg" alt="Logo" className="h-3.5 w-auto" />
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#C30D12] text-white text-[9px] font-bold">
                  ● LIVE HD
                </div>
              </div>
              {/* Stand */}
              <div className="w-20 h-2 bg-gray-700 mx-auto mt-2 rounded-full" />
            </div>

            {/* Floating Mobile Phone Representation */}
            <div className="hidden sm:block absolute -bottom-6 -right-2 sm:-right-4 w-36 sm:w-44 bg-black rounded-3xl p-1.5 border-2 border-gray-700 shadow-2xl transform rotate-6">
              <div className="aspect-[9/19] rounded-2xl overflow-hidden bg-gray-950 relative">
                <img
                  src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=400&q=80"
                  alt="KenLive Mobile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm p-1.5 rounded-lg text-[9px] text-white">
                  <div className="font-bold text-[#C30D12]">KenLive Mobile</div>
                  <div className="truncate text-gray-300">Data Saver: ON</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WatchAnywhere;

