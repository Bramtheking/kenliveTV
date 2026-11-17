import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Tv, 
  Radio, 
  Newspaper, 
  ShieldCheck, 
  Users, 
  Award, 
  Globe, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail,
  ChevronRight
} from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

export const About: React.FC = () => {
  return (
    <main className="min-h-screen py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Hero */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C30D12]/20 border border-[#C30D12]/40 text-[#C30D12] text-xs font-heading font-extrabold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kuhusu KenLive TV</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-gray-950 leading-tight">
            Kenya's Boldest Independent <span className="text-[#C30D12]">Digital Broadcaster</span>
          </h1>

          <p className="text-xs sm:text-base text-gray-300 dark:text-gray-300 light:text-gray-600 mt-4 leading-relaxed">
            KenLive TV is the flagship live television channel of KenLive Media, founded on the principle that every Kenyan citizen deserves impartial, uncompromised, and courageous news coverage. We blend broadcast-grade video journalism with internet speed, mobile accessibility, and deep cultural authenticity.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#C30D12]/20 text-[#C30D12] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-xl uppercase tracking-tight text-white dark:text-white light:text-gray-900 mb-2">
              Sauti ya Wananchi
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-300 light:text-gray-600 leading-relaxed">
              We hold power accountable. From county assembly halls to state departments, our investigative reporters ask the tough questions ordinary Kenyans need answered.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#0B5CAB]/20 text-[#0B5CAB] flex items-center justify-center mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-xl uppercase tracking-tight text-white dark:text-white light:text-gray-900 mb-2">
              All 47 Counties
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-300 light:text-gray-600 leading-relaxed">
              Kenya doesn't end in Nairobi. KenLive TV deploys correspondents across the Coast, Rift Valley, Western, Nyanza, Central, and Northern Kenya to tell grassroots stories.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-xl uppercase tracking-tight text-white dark:text-white light:text-gray-900 mb-2">
              Cultural Pride & Burudani
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-300 light:text-gray-600 leading-relaxed">
              We celebrate the richness of East Africa's heritage. Our weekend musical extravaganzas, Mugithi sessions, Benga classics, and comedy spotlight local creatives.
            </p>
          </div>
        </div>

        {/* Media Network Ecosystem Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#171722] via-[#121217] to-[#0A0A0E] border border-[#2B2B38] p-6 sm:p-10 mb-16 shadow-2xl">
          <div className="max-w-2xl mb-8">
            <div className="text-[11px] font-heading font-extrabold uppercase text-[#C30D12] tracking-widest mb-1">
              THE COMPLETE NETWORK
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              The KenLive Media Ecosystem
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-2">
              Access trusted news in whichever format suits your day:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <a
              href={SITE_CONFIG.network.newsWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-[#1A1A24] hover:bg-[#222230] border border-[#2B2B3A] transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-lg bg-[#C30D12]/20 text-[#C30D12]">
                  <Globe className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono text-gray-400">kenlive.co.ke</span>
              </div>
              <h4 className="font-heading font-extrabold text-lg uppercase text-white group-hover:text-[#C30D12]">
                KenLive News Web
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                24/7 breaking national news, politics, business analyses, and opinion columns.
              </p>
            </a>

            <a
              href={SITE_CONFIG.network.radio}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-[#1A1A24] hover:bg-[#222230] border border-[#2B2B3A] transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-lg bg-[#0B5CAB]/20 text-[#0B5CAB]">
                  <Radio className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono text-blue-300">radio.kenlive.co.ke</span>
              </div>
              <h4 className="font-heading font-extrabold text-lg uppercase text-white group-hover:text-[#0B5CAB]">
                KenLive Radio Live
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                High-fidelity audio stream featuring energetic presenters and African melodies.
              </p>
            </a>

            <a
              href={SITE_CONFIG.network.newspaper}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-[#1A1A24] hover:bg-[#222230] border border-[#2B2B3A] transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Newspaper className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono text-gray-400">newspaper.kenlive.co.ke</span>
              </div>
              <h4 className="font-heading font-extrabold text-lg uppercase text-white group-hover:text-emerald-400">
                KenLive Newspaper
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Downloadable digital edition and print layout with investigative deep-dives.
              </p>
            </a>
          </div>
        </div>

        {/* Studio & Transmission info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-white mb-3">
              Broadcast Facilities & Technology
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed space-y-3">
              Operating out of state-of-the-art digital studios in Nairobi, KenLive TV employs IP-based broadcast workflows with redundant cloud encoding clusters. This guarantees seamless delivery to low-bandwidth mobile handsets on 3G/4G networks without compromising high-definition fidelity on fiber connections and 4K displays.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#14141A] border border-[#242430] space-y-3 text-xs text-gray-300">
            <div className="flex items-center justify-between py-1 border-b border-[#20202B]">
              <span className="text-gray-400">Transmission Mode:</span>
              <span className="font-mono font-bold text-white">Full HD 1080p / 720p HLS Adaptive</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-[#20202B]">
              <span className="text-gray-400">Master Control Room:</span>
              <span className="font-bold text-white">Nairobi Central Studios</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-[#20202B]">
              <span className="text-gray-400">Timezone:</span>
              <span className="font-mono text-[#C30D12] font-bold">East Africa Time (EAT, UTC+3)</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-400">Language of Broadcast:</span>
              <span className="font-bold text-white">Kiswahili & English (Bilingual)</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;

