import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Tv, 
  Calendar, 
  Video, 
  Newspaper, 
  Radio, 
  Megaphone, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ExternalLink,
  Phone,
  Mail,
  Share2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SITE_CONFIG } from '../config/site';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Watch Live', swahili: 'Tazama Live', path: '/watch', icon: Tv, highlight: true },
    { label: 'Schedule', swahili: 'Ratiba', path: '/schedule', icon: Calendar },
    { label: 'Shows', swahili: 'Vipindi', path: '/shows', icon: Video },
    { label: 'News', swahili: 'Habari', path: '/news', icon: Newspaper },
    { label: 'Replays', swahili: 'Marudio', path: '/replays', icon: Video },
    { label: 'Radio', swahili: 'Redio', path: SITE_CONFIG.network.radio, isExternal: true, icon: Radio },
    { label: 'Advertise', swahili: 'Tangaza Nasi', path: '/advertise', icon: Megaphone },
  ];

  const isActive = (path: string) => {
    if (path === '/watch' && location.pathname === '/watch') return true;
    if (path === '/shows' && location.pathname.startsWith('/shows')) return true;
    return location.pathname === path;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-200 border-[#242430] bg-[#0B0B0C]/90 dark:border-[#242430] dark:bg-[#0B0B0C]/90 light:border-gray-200 light:bg-white/95">
        {/* Top Mini Bar for Sister Network */}
        <div className="hidden lg:flex items-center justify-between px-4 sm:px-6 lg:px-8 py-1.5 text-xs border-b border-[#1c1c24] dark:border-[#1c1c24] light:border-gray-100 text-gray-400 light:text-gray-600">
          <div className="flex items-center space-x-6">
            <span className="font-semibold text-gray-300 light:text-gray-700 tracking-wide uppercase">KenLive Media Network:</span>
            <a 
              href={SITE_CONFIG.network.newsWebsite} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#C30D12] flex items-center gap-1 transition-colors"
            >
              News (kenlive.co.ke) <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <a 
              href={SITE_CONFIG.network.radio} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#0B5CAB] flex items-center gap-1 transition-colors text-blue-400 light:text-blue-600 font-medium"
            >
              <Radio className="w-3 h-3" /> KenLive Radio
            </a>
            <a 
              href={SITE_CONFIG.network.newspaper} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#C30D12] flex items-center gap-1 transition-colors"
            >
              Newspaper (E-Paper) <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <a href={`tel:${SITE_CONFIG.contact.phone}`} className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone className="w-3 h-3 text-[#C30D12]" /> {SITE_CONFIG.contact.phone}
            </a>
            <span className="text-gray-600">|</span>
            <a href={`mailto:${SITE_CONFIG.contact.email}`} className="flex items-center gap-1 hover:text-white transition-colors">
              <Mail className="w-3 h-3 text-[#C30D12]" /> {SITE_CONFIG.contact.email}
            </a>
            <span className="text-gray-600">|</span>
            <span className="text-[#C30D12] font-semibold tracking-wider">NAIROBI, KENYA (EAT UTC+3)</span>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo Badge */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group focus:outline-none">
            {/* Logo on a clean badge so the black 'K' and 'EN' pop on dark backgrounds */}
            <div className="bg-white rounded-xl p-1.5 sm:p-2 shadow-md border border-gray-200/80 group-hover:scale-105 transition-transform duration-200">
              <img 
                src="/kenlive-logo.jpg" 
                alt="KenLive TV Logo" 
                className="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => {
                  // Fallback text if image missing
                  const target = e.target as HTMLElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight italic text-white dark:text-white light:text-gray-900 leading-none">
                  KENLIVE <span className="text-[#C30D12]">TV</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#0B5CAB]/20 text-[#0B5CAB] border border-[#0B5CAB]/30 uppercase tracking-widest">
                  HD 24/7
                </span>
              </div>
              <span className="text-[11px] font-medium text-gray-400 light:text-gray-500 uppercase tracking-wider">
                Tazama Live • Kenya
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => {
              if (item.isExternal) {
                return (
                  <a
                    key={item.label}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-300 dark:text-gray-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-[#C30D12] hover:bg-[#1A1A22] light:hover:bg-gray-100 transition-all flex items-center gap-1.5"
                  >
                    <item.icon className="w-4 h-4 text-[#0B5CAB]" />
                    <span>{item.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                );
              }

              const active = isActive(item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    active 
                      ? 'bg-[#C30D12] text-white shadow-lg shadow-[#C30D12]/20 font-bold' 
                      : 'text-gray-300 dark:text-gray-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-[#1A1A22] light:hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items: Pulsing Live Pill, Search, Theme Toggle, Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Pulsing LIVE Pill linking to /watch */}
            <Link
              to="/watch"
              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-heading text-sm sm:text-base font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#C30D12] to-[#E01C22] shadow-lg shadow-[#C30D12]/30 hover:shadow-xl hover:shadow-[#C30D12]/50 hover:scale-105 active:scale-95 transition-all"
              aria-label="Tazama Live"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <span>LIVE</span>
              <span className="hidden md:inline text-xs font-normal opacity-90 lowercase font-sans">
                (tazama)
              </span>
            </Link>

            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 sm:p-2.5 rounded-lg text-gray-400 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-[#1A1A22] light:hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C30D12]"
              aria-label="Search shows and news"
              title="Search (Tafuta)"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-lg text-gray-400 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-[#1A1A22] light:hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C30D12]"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-600" />
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 sm:p-2.5 rounded-lg text-gray-300 dark:text-gray-300 light:text-gray-800 hover:bg-[#1A1A22] light:hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C30D12]"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-[#242430] bg-[#0E0E12] dark:bg-[#0E0E12] light:bg-white px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {navLinks.map((item) => {
                const active = !item.isExternal && isActive(item.path);
                if (item.isExternal) {
                  return (
                    <a
                      key={item.label}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 p-3 rounded-xl bg-[#17171F] light:bg-gray-100 text-gray-200 light:text-gray-800 font-semibold text-sm"
                    >
                      <item.icon className="w-4 h-4 text-[#0B5CAB]" />
                      <span>{item.label}</span>
                      <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-3 rounded-xl font-semibold text-sm transition-all ${
                      active
                        ? 'bg-[#C30D12] text-white shadow-md'
                        : 'bg-[#17171F] light:bg-gray-100 text-gray-200 light:text-gray-800 hover:bg-[#20202C]'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <div>
                      <div>{item.label}</div>
                      <div className="text-[10px] font-normal opacity-70">{item.swahili}</div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Sister Links in Mobile Drawer */}
            <div className="border-t border-[#20202B] pt-4 mt-2 space-y-2">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                KenLive Network & Contact
              </div>
              <div className="flex flex-col gap-2 text-xs text-gray-300 light:text-gray-600">
                <a 
                  href={SITE_CONFIG.network.newsWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-[#14141A] light:bg-gray-50"
                >
                  <span>KenLive News Portal (kenlive.co.ke)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </a>
                <a 
                  href={SITE_CONFIG.network.radio} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-[#14141A] light:bg-gray-50 text-[#0B5CAB] font-semibold"
                >
                  <span>KenLive Radio Live Stream</span>
                  <Radio className="w-3.5 h-3.5 text-[#0B5CAB]" />
                </a>
                <div className="flex items-center justify-between p-2 text-gray-400 text-xs">
                  <span>WhatsApp / Studio:</span>
                  <span className="font-mono text-[#C30D12] font-bold">{SITE_CONFIG.contact.phone}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;

