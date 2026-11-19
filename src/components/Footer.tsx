import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ExternalLink, Youtube, Facebook, Twitter } from "lucide-react";
import SITE_CONFIG from "@/config/site";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border mt-16 pb-6">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <div className="bg-white rounded-xl p-1.5 shadow-md border border-border group-hover:scale-105 transition-transform">
                <img src="/kenlive-logo.jpg" alt="KenLive TV" className="h-10 w-auto object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tight italic text-secondary-foreground leading-none">
                  KENLIVE <span className="text-primary">TV</span>
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  tv.kenlive.co.ke
                </span>
              </div>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              KenLive TV is Kenya's independent 24/7 digital broadcast channel — live breaking news, investigative reporting, parliamentary debates, and East African entertainment. Sauti ya Wananchi na Habari za Kweli.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a href={SITE_CONFIG.socials.youtube} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors" title="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href={SITE_CONFIG.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-blue-600 hover:text-white transition-colors" title="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={SITE_CONFIG.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-black hover:text-white transition-colors" title="X / Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* TV Station links */}
          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-secondary-foreground mb-3 border-l-2 border-primary pl-2">TV Station</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1.5 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Watch Live (Tazama)
                </Link>
              </li>
              <li><a href="/#schedule" className="hover:text-primary transition-colors">Program Schedule (Ratiba)</a></li>
              <li><a href="/#news" className="hover:text-primary transition-colors">KenLive News Hub</a></li>
              <li><Link to="/advertise" className="hover:text-primary transition-colors">Advertise With Us</Link></li>
            </ul>
          </div>

          {/* Media Network */}
          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-secondary-foreground mb-3 border-l-2 border-blue-500 pl-2">Media Network</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href={SITE_CONFIG.network.newsWebsite} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center justify-between transition-colors">
                  <span>kenlive.co.ke News</span> <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href={SITE_CONFIG.network.radio} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center justify-between transition-colors text-blue-500 font-semibold">
                  <span>radio.kenlive.co.ke</span> <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href={SITE_CONFIG.network.newspaper} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center justify-between transition-colors">
                  <span>KenLive Newspaper</span> <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href={SITE_CONFIG.socials.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center justify-between transition-colors">
                  <span>Ken Wakuraya Official</span> <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-secondary-foreground mb-3 border-l-2 border-primary pl-2">Studio & Contact</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{SITE_CONFIG.contact.studioAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href={`tel:${SITE_CONFIG.contact.phone}`} className="font-mono text-muted-foreground hover:text-primary">{SITE_CONFIG.contact.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-muted-foreground hover:text-primary truncate">{SITE_CONFIG.contact.email}</a>
              </div>
              <div className="pt-2">
                <Link to="/admin" className="text-xs font-bold text-primary hover:underline">Admin Panel →</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>© {year} <strong className="text-secondary-foreground">KenLive Media Group</strong>. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link to="/advertise" className="hover:text-foreground">Advertise</Link>
            <span>•</span>
            <span>Nairobi, Kenya</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
