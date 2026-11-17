import React, { useState } from 'react';
import { 
  Megaphone, 
  Tv, 
  Video, 
  Globe, 
  Send, 
  Check, 
  TrendingUp, 
  Users, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight,
  Mail,
  Phone
} from 'lucide-react';
import { SITE_CONFIG } from '../config/site';
import { AD_PACKAGES } from '../config/sponsors';

export const Advertise: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    format: 'Sponsored Show Segment',
    budget: 'Under KES 250,000',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare mailto payload
    const subject = encodeURIComponent(`KenLive TV Advertising Inquiry - ${formData.company || formData.name}`);
    const body = encodeURIComponent(
      `KenLive Commercial Desk Inquiry:\n\n` +
      `Full Name: ${formData.name}\n` +
      `Company / Brand: ${formData.company}\n` +
      `Phone: ${formData.phone}\n` +
      `Email: ${formData.email}\n` +
      `Selected Format: ${formData.format}\n` +
      `Estimated Budget: ${formData.budget}\n\n` +
      `Campaign Brief & Details:\n${formData.message}\n\n` +
      `Sent via tv.kenlive.co.ke/advertise`
    );

    // Open prefilled email client
    window.location.href = `mailto:${SITE_CONFIG.contact.email}?subject=${subject}&body=${body}`;

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 8000);
  };

  return (
    <main className="min-h-screen py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pitch Hero */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C30D12]/20 border border-[#C30D12]/40 text-[#C30D12] text-xs font-heading font-extrabold uppercase tracking-widest mb-3">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Commercial Partnerships & Media Kit</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-gray-950 leading-tight">
            Amplify Your Brand to Millions Across <span className="text-[#C30D12]">Kenya & the Diaspora</span>
          </h1>

          <p className="text-xs sm:text-base text-gray-300 dark:text-gray-300 light:text-gray-600 mt-3 leading-relaxed">
            KenLive TV offers unmatched digital engagement. We connect your products and services with high-intent decision makers, business owners, and vibrant Kenyan households via live streaming, mobile broadcast, and television syndication.
          </p>
        </div>

        {/* Audience Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          <div className="p-5 rounded-2xl bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200 text-center shadow-lg">
            <div className="text-[#C30D12] font-mono text-2xl sm:text-3xl font-extrabold mb-1">
              1.8M+
            </div>
            <div className="font-heading text-xs sm:text-sm font-bold uppercase text-white dark:text-white light:text-gray-900">
              Monthly Video Reach
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Across TV, mobile & web</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200 text-center shadow-lg">
            <div className="text-emerald-500 font-mono text-2xl sm:text-3xl font-extrabold mb-1">
              72%
            </div>
            <div className="font-heading text-xs sm:text-sm font-bold uppercase text-white dark:text-white light:text-gray-900">
              Mobile Viewers
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Stream on smartphones</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200 text-center shadow-lg">
            <div className="text-[#0B5CAB] font-mono text-2xl sm:text-3xl font-extrabold mb-1">
              47 Counties
            </div>
            <div className="font-heading text-xs sm:text-sm font-bold uppercase text-white dark:text-white light:text-gray-900">
              National Footprint
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Devolution-wide presence</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200 text-center shadow-lg">
            <div className="text-amber-400 font-mono text-2xl sm:text-3xl font-extrabold mb-1">
              24/7
            </div>
            <div className="font-heading text-xs sm:text-sm font-bold uppercase text-white dark:text-white light:text-gray-900">
              Live Transmission
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Always-on digital stream</p>
          </div>
        </div>

        {/* 4 Commercial Formats Cards */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-gray-900">
              Advertising & Sponsorship Formats
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 light:text-gray-600 mt-1">
              Tailored commercial packages engineered to deliver verifiable return on investment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AD_PACKAGES.map((pkg, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200 hover:border-[#C30D12]/50 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-heading font-extrabold uppercase tracking-wider bg-[#C30D12]/20 text-[#C30D12] border border-[#C30D12]/30">
                      FORMAT 0{idx + 1}
                    </span>
                    <span className="text-xs font-mono font-bold text-gray-400">
                      {pkg.reach}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-xl uppercase tracking-tight text-white dark:text-white light:text-gray-900 mb-1">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-gray-400 light:text-gray-500 italic mb-2">
                    {pkg.swahili}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-300 light:text-gray-600 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#20202B] dark:border-[#20202B] light:border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span>Placement: <strong>{pkg.slots}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advertising Inquiry Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form pitch & contacts (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl bg-[#14141A] border border-[#242430] p-6 shadow-xl">
              <h3 className="font-heading font-extrabold text-2xl uppercase tracking-tight text-white mb-2">
                Request a Custom Rate Card
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                Tell us about your campaign goals. Our commercial team will prepare a tailored proposal with discounted spot placements, digital banners, and show sponsorship options.
              </p>

              <div className="space-y-3 text-xs text-gray-300">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#C30D12]" />
                  <span>Commercial Desk: <strong>{SITE_CONFIG.contact.email}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C30D12]" />
                  <span>Direct Line / WhatsApp: <strong>{SITE_CONFIG.contact.phone}</strong></span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-[#0B5CAB]/20 to-[#121218] border border-[#0B5CAB]/30 p-5 text-xs text-blue-200">
              <strong className="block font-heading font-bold uppercase text-sm text-white mb-1">
                Ecosystem Bundle Special:
              </strong>
              Combine your KenLive TV campaign with simultaneous placements on <strong>kenlive.co.ke News</strong>, <strong>KenLive Radio</strong>, and the weekly <strong>KenLive E-Newspaper</strong> for maximum brand dominance.
            </div>
          </div>

          {/* Booking Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200 p-6 sm:p-8 shadow-2xl">
              <h3 className="font-heading font-extrabold text-2xl uppercase tracking-tight text-white dark:text-white light:text-gray-900 mb-1">
                Advertising Booking & Inquiry Form
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Submitting this form prepares your formal brief directly to our commercial directors.
              </p>

              {submitted && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Opening your email client to send the campaign inquiry to {SITE_CONFIG.contact.email}. Thank you!</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 dark:text-gray-300 light:text-gray-700 tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Samuel Kamau"
                      className="w-full bg-[#1C1C26] dark:bg-[#1C1C26] light:bg-gray-50 text-white dark:text-white light:text-gray-900 text-xs px-3.5 py-2.5 rounded-xl border border-[#2E2E3E] dark:border-[#2E2E3E] light:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C30D12] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 dark:text-gray-300 light:text-gray-700 tracking-wider mb-1">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="e.g. Safaricom, Britam, SME"
                      className="w-full bg-[#1C1C26] dark:bg-[#1C1C26] light:bg-gray-50 text-white dark:text-white light:text-gray-900 text-xs px-3.5 py-2.5 rounded-xl border border-[#2E2E3E] dark:border-[#2E2E3E] light:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C30D12] min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 dark:text-gray-300 light:text-gray-700 tracking-wider mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+254 703 103677"
                      className="w-full bg-[#1C1C26] dark:bg-[#1C1C26] light:bg-gray-50 text-white dark:text-white light:text-gray-900 text-xs px-3.5 py-2.5 rounded-xl border border-[#2E2E3E] dark:border-[#2E2E3E] light:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C30D12] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 dark:text-gray-300 light:text-gray-700 tracking-wider mb-1">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="marketing@company.co.ke"
                      className="w-full bg-[#1C1C26] dark:bg-[#1C1C26] light:bg-gray-50 text-white dark:text-white light:text-gray-900 text-xs px-3.5 py-2.5 rounded-xl border border-[#2E2E3E] dark:border-[#2E2E3E] light:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C30D12] min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 dark:text-gray-300 light:text-gray-700 tracking-wider mb-1">
                      Preferred Format
                    </label>
                    <select
                      name="format"
                      value={formData.format}
                      onChange={handleChange}
                      className="w-full bg-[#1C1C26] dark:bg-[#1C1C26] light:bg-gray-50 text-white dark:text-white light:text-gray-900 text-xs px-3 py-2.5 rounded-xl border border-[#2E2E3E] dark:border-[#2E2E3E] light:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C30D12] min-h-[44px]"
                    >
                      <option>Sponsored Show Segment</option>
                      <option>Lower Thirds & Squeeze-Back</option>
                      <option>Studio Interview Feature</option>
                      <option>Digital Web & Pre-Roll Video</option>
                      <option>Outside Broadcast (OB) Live Coverage</option>
                      <option>Multi-Platform Network Bundle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 dark:text-gray-300 light:text-gray-700 tracking-wider mb-1">
                      Target Budget Range
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full bg-[#1C1C26] dark:bg-[#1C1C26] light:bg-gray-50 text-white dark:text-white light:text-gray-900 text-xs px-3 py-2.5 rounded-xl border border-[#2E2E3E] dark:border-[#2E2E3E] light:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C30D12] min-h-[44px]"
                    >
                      <option>Under KES 250,000</option>
                      <option>KES 250,000 - KES 750,000</option>
                      <option>KES 750,000 - KES 2,000,000</option>
                      <option>KES 2,000,000+ (Annual Corporate Sponsor)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 dark:text-gray-300 light:text-gray-700 tracking-wider mb-1">
                    Campaign Objectives & Dates *
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Briefly describe your product launch, desired show placement, target demographic, and preferred campaign duration..."
                    className="w-full bg-[#1C1C26] dark:bg-[#1C1C26] light:bg-gray-50 text-white dark:text-white light:text-gray-900 text-xs px-3.5 py-2.5 rounded-xl border border-[#2E2E3E] dark:border-[#2E2E3E] light:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C30D12]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C30D12] to-[#E01C22] hover:from-[#A0090E] hover:to-[#C30D12] active:scale-95 text-white font-heading font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#C30D12]/30 transition-all min-h-[48px]"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Campaign Brief to info@kenlive.co.ke</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Advertise;

