import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Check, 
  MessageSquare, 
  MessageCircle, 
} from 'lucide-react';
import { FacebookIcon, TwitterIcon, YouTubeIcon, WhatsAppIcon } from '../components/Icons';
import { SITE_CONFIG } from '../config/site';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Newsroom & Editorial Tips',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(`KenLive TV Inquiry [${formData.department}] - ${formData.name}`);
    const body = encodeURIComponent(
      `From: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n` +
      `Department: ${formData.department}\n\n` +
      `Message / Tip:\n${formData.message}\n\n` +
      `Sent via tv.kenlive.co.ke/contact`
    );

    window.location.href = `mailto:${SITE_CONFIG.contact.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 8000);
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent("Jambo KenLive TV! I have an inquiry / news tip from tv.kenlive.co.ke");
    window.open(`https://api.whatsapp.com/send?phone=${SITE_CONFIG.contact.whatsapp.replace(/\D/g, '')}&text=${text}`, '_blank');
  };

  return (
    <main className="min-h-screen py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C30D12]/20 border border-[#C30D12]/40 text-[#C30D12] text-xs font-heading font-extrabold uppercase tracking-widest mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Mawasiliano na Studio</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-gray-950 leading-tight">
            Get in Touch With <span className="text-[#C30D12]">KenLive TV</span>
          </h1>

          <p className="text-xs sm:text-base text-gray-300 dark:text-gray-300 light:text-gray-600 mt-3 leading-relaxed">
            Have a breaking news tip from your county? Want to send feedback to our live presenters, book an interview, or partner with us? Our editorial and production desks are ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info & WhatsApp (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Cards */}
            <div className="rounded-2xl bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200 p-6 shadow-xl space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#C30D12]/20 text-[#C30D12] shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-heading font-extrabold uppercase text-gray-400 tracking-wider">
                    Official Email
                  </div>
                  <a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-sm font-semibold text-white dark:text-white light:text-gray-900 hover:text-[#C30D12] transition-colors">
                    {SITE_CONFIG.contact.email}
                  </a>
                  <p className="text-[11px] text-gray-500 mt-0.5">General inquiries & editorial desk</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-[#20202B] dark:border-[#20202B] light:border-gray-100">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-heading font-extrabold uppercase text-gray-400 tracking-wider">
                    Phone / WhatsApp Studio Hotlines
                  </div>
                  <a href={`tel:${SITE_CONFIG.contact.phone}`} className="font-mono text-sm font-bold text-white dark:text-white light:text-gray-900 hover:text-emerald-400 transition-colors">
                    {SITE_CONFIG.contact.phone}
                  </a>
                  <p className="text-[11px] text-gray-500 mt-0.5">Live on-air calls & WhatsApp tips</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-[#20202B] dark:border-[#20202B] light:border-gray-100">
                <div className="p-2.5 rounded-xl bg-[#0B5CAB]/20 text-[#0B5CAB] shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-heading font-extrabold uppercase text-gray-400 tracking-wider">
                    Studios Location
                  </div>
                  <div className="text-xs sm:text-sm text-gray-200 dark:text-gray-200 light:text-gray-800">
                    {SITE_CONFIG.contact.studioAddress}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{SITE_CONFIG.contact.postalAddress}</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-[#121218] border border-emerald-500/30 shadow-lg">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <MessageCircle className="w-5 h-5" />
                <span className="font-heading font-bold uppercase text-sm">Instant WhatsApp News Desk</span>
              </div>
              <p className="text-xs text-gray-300 mb-3">
                Send recorded voice notes, breaking photos, or whistle-blower documents directly to our 24/7 duty editor on WhatsApp.
              </p>
              <button
                onClick={handleOpenWhatsApp}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Chat on WhatsApp: {SITE_CONFIG.contact.whatsapp}</span>
              </button>
            </div>

            {/* Social Media Links List */}
            <div className="p-5 rounded-2xl bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200">
              <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-white dark:text-white light:text-gray-900 mb-3">
                Official Social Media Channels
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href={SITE_CONFIG.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1C1C26] dark:bg-[#1C1C26] light:bg-gray-100 hover:text-red-400 transition-colors"
                >
                  <YouTubeIcon className="w-4 h-4 text-red-500" />
                  <span>YouTube</span>
                </a>
                <a
                  href={SITE_CONFIG.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1C1C26] dark:bg-[#1C1C26] light:bg-gray-100 hover:text-blue-400 transition-colors"
                >
                  <FacebookIcon className="w-4 h-4 text-blue-500" />
                  <span>Facebook</span>
                </a>
                <a
                  href={SITE_CONFIG.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1C1C26] dark:bg-[#1C1C26] light:bg-gray-100 hover:text-white transition-colors"
                >
                  <TwitterIcon className="w-4 h-4 text-gray-300" />
                  <span>X (Twitter)</span>
                </a>
                <a
                  href={SITE_CONFIG.socials.whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1C1C26] dark:bg-[#1C1C26] light:bg-gray-100 hover:text-emerald-400 transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Ch.</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Message / Feedback Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200 p-6 sm:p-8 shadow-2xl">
              <h3 className="font-heading font-extrabold text-2xl uppercase tracking-tight text-white dark:text-white light:text-gray-900 mb-1">
                Send Us a Message
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Fill in the form below to reach the appropriate KenLive department.
              </p>

              {submitted && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Launching your email client to send your message to {SITE_CONFIG.contact.email}. Asante sana!</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 dark:text-gray-300 light:text-gray-700 tracking-wider mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Gitonga"
                      className="w-full bg-[#1C1C26] dark:bg-[#1C1C26] light:bg-gray-50 text-white dark:text-white light:text-gray-900 text-xs px-3.5 py-2.5 rounded-xl border border-[#2E2E3E] dark:border-[#2E2E3E] light:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C30D12] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 dark:text-gray-300 light:text-gray-700 tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@gmail.com"
                      className="w-full bg-[#1C1C26] dark:bg-[#1C1C26] light:bg-gray-50 text-white dark:text-white light:text-gray-900 text-xs px-3.5 py-2.5 rounded-xl border border-[#2E2E3E] dark:border-[#2E2E3E] light:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C30D12] min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 dark:text-gray-300 light:text-gray-700 tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full bg-[#1C1C26] dark:bg-[#1C1C26] light:bg-gray-50 text-white dark:text-white light:text-gray-900 text-xs px-3.5 py-2.5 rounded-xl border border-[#2E2E3E] dark:border-[#2E2E3E] light:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C30D12] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 dark:text-gray-300 light:text-gray-700 tracking-wider mb-1">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full bg-[#1C1C26] dark:bg-[#1C1C26] light:bg-gray-50 text-white dark:text-white light:text-gray-900 text-xs px-3 py-2.5 rounded-xl border border-[#2E2E3E] dark:border-[#2E2E3E] light:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C30D12] min-h-[44px]"
                    >
                      <option>Newsroom & Editorial Tips</option>
                      <option>Studio Guest / Interview Booking</option>
                      <option>Viewer Feedback on a Show</option>
                      <option>Technical / Stream Support</option>
                      <option>Management & Partnerships</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 dark:text-gray-300 light:text-gray-700 tracking-wider mb-1">
                    Your Message / Story Tip *
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Provide details about your query or news tip. Include county, location, and any relevant background..."
                    className="w-full bg-[#1C1C26] dark:bg-[#1C1C26] light:bg-gray-50 text-white dark:text-white light:text-gray-900 text-xs px-3.5 py-2.5 rounded-xl border border-[#2E2E3E] dark:border-[#2E2E3E] light:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C30D12]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C30D12] to-[#E01C22] hover:from-[#A0090E] hover:to-[#C30D12] active:scale-95 text-white font-heading font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#C30D12]/30 transition-all min-h-[48px]"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to info@kenlive.co.ke</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
