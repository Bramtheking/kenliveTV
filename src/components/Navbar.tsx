import { Link, useLocation } from "react-router-dom";
import {
  Tv, Calendar, Newspaper, Megaphone, Search,
  Sun, Moon, Menu, X, ExternalLink, Phone, Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import kenLiveLogo from "@/assets/kenlive-logo.jpg";
import SITE_CONFIG from "@/config/site";

interface NavbarProps {
  onOpenSearch?: () => void;
}

const navLinks = [
  { label: "Watch Live", swahili: "Tazama Live", path: "/", icon: Tv, highlight: true },
  { label: "Schedule", swahili: "Ratiba", path: "/#schedule", icon: Calendar, scroll: "schedule" },
  { label: "News", swahili: "Habari", path: "/#news", icon: Newspaper, scroll: "news" },
  { label: "Advertise", swahili: "Tangaza Nasi", path: "/advertise", icon: Megaphone },
];

const Navbar = ({ onOpenSearch }: NavbarProps) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (link: (typeof navLinks)[0]) => {
    setMobileOpen(false);
    if (link.scroll) {
      if (location.pathname === "/") {
        setTimeout(() => scrollToSection(link.scroll!), 50);
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-secondary/95 backdrop-blur-md shadow-lg">
        {/* Top mini-bar (desktop) */}
        <div className="hidden lg:flex items-center justify-between px-4 sm:px-8 py-1.5 text-xs border-b border-border bg-secondary/80 text-muted-foreground">
          <div className="flex items-center space-x-6">
            <span className="font-semibold text-secondary-foreground tracking-wide uppercase">KenLive Media Network:</span>
            <a href={SITE_CONFIG.network.newsWebsite} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1 transition-colors">
              News (kenlive.co.ke) <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <a href={SITE_CONFIG.network.radio} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1 transition-colors">
              KenLive Radio <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <a href={SITE_CONFIG.network.newspaper} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1 transition-colors">
              Newspaper (E-Paper) <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href={`tel:${SITE_CONFIG.contact.phone}`} className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Phone className="w-3 h-3 text-primary" /> {SITE_CONFIG.contact.phone}
            </a>
            <span className="text-border">|</span>
            <a href={`mailto:${SITE_CONFIG.contact.email}`} className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Mail className="w-3 h-3 text-primary" /> {SITE_CONFIG.contact.email}
            </a>
            <span className="text-border">|</span>
            <span className="text-primary font-semibold tracking-wider">NAIROBI, KENYA (EAT UTC+3)</span>
          </div>
        </div>

        {/* Main navbar */}
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group focus:outline-none">
            <div className="bg-white rounded-xl p-1.5 sm:p-2 shadow-md border border-border group-hover:scale-105 transition-transform duration-200">
              <img src={kenLiveLogo} alt="KenLive TV" className="h-10 sm:h-12 w-auto object-contain" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight italic text-secondary-foreground leading-none">
                  KENLIVE <span className="text-primary">TV</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-widest">
                  HD 24/7
                </span>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Tazama Live • Kenya
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map(item => (
              item.scroll ? (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-secondary-foreground hover:text-foreground hover:bg-muted transition-all flex items-center gap-1.5"
                >
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground shadow-lg font-bold"
                      : "text-secondary-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${location.pathname === item.path ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  <span>{item.label}</span>
                </Link>
              )
            ))}
          </nav>

          {/* Right: LIVE pill + search + theme + hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Pulsing LIVE pill */}
            <Link
              to="/"
              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-sm uppercase tracking-wider text-primary-foreground bg-primary shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
              </span>
              <span>LIVE</span>
              <span className="hidden md:inline text-xs font-normal opacity-90 lowercase">(tazama)</span>
            </Link>

            {/* Search */}
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="p-2 sm:p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 sm:p-2.5 rounded-xl border border-border bg-muted hover:bg-card text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary shadow-sm flex items-center justify-center min-w-[40px] min-h-[40px]"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2 sm:p-2.5 rounded-lg text-secondary-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="xl:hidden border-t border-border bg-secondary px-4 pt-3 pb-6 shadow-2xl">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {navLinks.map(item => (
                item.scroll ? (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item)}
                    className="flex items-center gap-2 p-3 rounded-xl bg-muted text-foreground font-semibold text-sm"
                  >
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div>{item.label}</div>
                      <div className="text-[10px] font-normal opacity-70">{item.swahili}</div>
                    </div>
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 p-3 rounded-xl font-semibold text-sm transition-all ${
                      location.pathname === item.path
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted hover:bg-card text-foreground"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <div>
                      <div>{item.label}</div>
                      <div className="text-[10px] font-normal opacity-70">{item.swahili}</div>
                    </div>
                  </Link>
                )
              ))}
            </div>

            <div className="border-t border-border pt-4 mt-2 space-y-2">
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">KenLive Network & Contact</div>
              <div className="flex flex-col gap-2 text-xs text-secondary-foreground">
                <a href={SITE_CONFIG.network.newsWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-lg bg-muted">
                  <span>KenLive News Portal</span><ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </a>
                <a href={SITE_CONFIG.network.radio} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-lg bg-muted text-blue-600 font-semibold">
                  <span>KenLive Radio Stream</span><ExternalLink className="w-3.5 h-3.5" />
                </a>
                <div className="flex items-center justify-between p-2 text-xs text-muted-foreground">
                  <span>Studio:</span><span className="font-mono text-primary font-bold">{SITE_CONFIG.contact.phone}</span>
                </div>
              </div>
            </div>

            {/* Admin link in mobile */}
            <div className="border-t border-border pt-3 mt-3">
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-primary font-semibold text-sm hover:bg-muted rounded-lg transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
