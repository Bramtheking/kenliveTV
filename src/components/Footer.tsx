import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Radio, 
  Newspaper, 
  MessageCircle,
} from 'lucide-react';
import { FacebookIcon, TwitterIcon, YouTubeIcon } from './Icons';
import { SITE_CONFIG } from '../config/site';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#09090C] dark:bg-[#09090C] light:bg-gray-100 text-gray-300 dark:text-gray-300 light:text-gray-700 border-t border-[#1F1F2A] dark:border-[#1F1F2A] light:border-gray-200 mt-16 pb-20 md:pb-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <div className="bg-white rounded-xl p-1.5 shadow-md border border-gray-200 group-hover:scale-105 transition-transform">
                <img 
                  src="/kenlive-logo.jpg" 
                  alt="KenLive TV Logo" 
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-extrabold tracking-tight italic text-white dark:text-white light:text-gray-900 leading-none">
                  KENLIVE <span className="text-[#C30D12]">TV</span>
                </span>
                <span className="text-[11px] font-semibold text-gray-400 light:text-gray-500 uppercase tracking-wider">
                  Tazama Live • tv.kenlive.co.ke
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-gray-400 light:text-gray-600 leading-relaxed max-w-sm">
              KenLive TV is Kenya's independent 24/7 digital broadcast channel, bringing you live breaking news, courageous investigative reporting, parliamentary debates, and vibrant East African entertainment. Sauti ya Wananchi na Habari za Kweli.
            </p>

            {/* Social Icons Row */}
            <div className="pt-2">
              <div className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-gray-400 mb-2">
                Follow Us / Mitandao Yetu:
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={SITE_CONFIG.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#191922] light:bg-white text-gray-300 light:text-gray-800 hover:text-white hover:bg-[#C30D12] transition-colors"
                  title="KenLive on YouTube"
                  aria-label="YouTube"
                >
                  <YouTubeIcon className="w-4 h-4" />
                </a>

                <a
                  href={SITE_CONFIG.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#191922] light:bg-white text-gray-300 light:text-gray-800 hover:text-white hover:bg-[#0B5CAB] transition-colors"
                  title="KenLive on Facebook"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>

                <a
                  href={SITE_CONFIG.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#191922] light:bg-white text-gray-300 light:text-gray-800 hover:text-white hover:bg-black transition-colors"
                  title="KenLive on X"
                  aria-label="Twitter X"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>

                <a
                  href={SITE_CONFIG.socials.whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#191922] light:bg-white text-gray-300 light:text-gray-800 hover:text-white hover:bg-emerald-600 transition-colors"
                  title="WhatsApp Channel"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                <a
                  href={SITE_CONFIG.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#191922] light:bg-white text-gray-300 light:text-gray-800 hover:text-white hover:bg-pink-600 transition-colors text-xs font-bold font-mono"
                  title="TikTok"
                  aria-label="TikTok"
                >
                  TT
                </a>

                <a
                  href={SITE_CONFIG.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#191922] light:bg-white text-gray-300 light:text-gray-800 hover:text-white hover:bg-rose-600 transition-colors text-xs font-bold font-mono"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  IG
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-white dark:text-white light:text-gray-900 mb-3 border-l-2 border-[#C30D12] pl-2">
              TV Station
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/watch" className="hover:text-[#C30D12] flex items-center gap-1.5 transition-colors font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C30D12]" />
                  Watch Live (Tazama)
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-white transition-colors">
                  Weekly Schedule (Ratiba)
                </Link>
              </li>
              <li>
                <Link to="/shows" className="hover:text-white transition-colors">
                  Our Shows (Vipindi)
                </Link>
              </li>
              <li>
                <Link to="/replays" className="hover:text-white transition-colors">
                  Replays & Highlights
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-white transition-colors">
                  KenLive News Hub
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="hover:text-white transition-colors">
                  Commercial Advertising
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About KenLive Media
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: KenLive Network Ecosystem */}
          <div>
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-white dark:text-white light:text-gray-900 mb-3 border-l-2 border-[#0B5CAB] pl-2">
              Media Network
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={SITE_CONFIG.network.newsWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C30D12] flex items-center justify-between transition-colors"
                >
                  <span>kenlive.co.ke News</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.network.radio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0B5CAB] flex items-center justify-between transition-colors text-blue-400 font-semibold"
                >
                  <span className="flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5" />
                    radio.kenlive.co.ke
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.network.newspaper}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C30D12] flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-1">
                    <Newspaper className="w-3.5 h-3.5" />
                    KenLive Newspaper
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 flex items-center justify-between transition-colors"
                >
                  <span>Ken Wakuraya Official</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact & Inquiries */}
          <div>
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-white dark:text-white light:text-gray-900 mb-3 border-l-2 border-[#C30D12] pl-2">
              Studio & Contact
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C30D12] shrink-0 mt-0.5" />
                <span className="text-gray-400 light:text-gray-600">
                  {SITE_CONFIG.contact.studioAddress}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C30D12] shrink-0" />
                <a href={`tel:${SITE_CONFIG.contact.phone}`} className="font-mono text-gray-300 light:text-gray-800 hover:text-white">
                  {SITE_CONFIG.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C30D12] shrink-0" />
                <a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-gray-300 light:text-gray-800 hover:text-white truncate">
                  {SITE_CONFIG.contact.email}
                </a>
              </div>
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-block text-xs font-heading font-bold uppercase tracking-wider text-[#C30D12] hover:underline"
                >
                  Send Feedback / Message Studio →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="border-t border-[#1F1F2A] dark:border-[#1F1F2A] light:border-gray-200 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} <strong className="text-gray-400 light:text-gray-700">KenLive Media Group</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-gray-300">About</Link>
            <span>•</span>
            <Link to="/advertise" className="hover:text-gray-300">Advertise</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-gray-300">Contact</Link>
            <span>•</span>
            <span className="text-gray-400">Nairobi, Kenya</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
