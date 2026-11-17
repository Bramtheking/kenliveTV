/**
 * KenLive TV - Site & Brand Configuration
 * ========================================
 * Edit all public contact info, social media links, and sister platform links here.
 */

export interface SiteConfig {
  name: string;
  tagline: string;
  taglineSwahili: string;
  domain: string;
  liveUrl: string;
  
  // Contact details
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    studioAddress: string;
    postalAddress: string;
  };

  // Sister KenLive media network brands
  network: {
    newsWebsite: string;
    radio: string;
    newspaper: string;
  };

  // Social media accounts
  socials: {
    facebook: string;
    twitter: string; // X
    youtube: string;
    tiktok: string;
    instagram: string;
    whatsappChannel: string;
  };

  // Brand colors (from logo)
  colors: {
    red: string;
    redDark: string;
    blue: string;
    black: string;
  };
}

export const SITE_CONFIG: SiteConfig = {
  name: "KenLive TV",
  tagline: "Kenya's Premier Digital News & Entertainment Channel",
  taglineSwahili: "Tazama Live - Sauti ya Wananchi na Habari za Kweli",
  domain: "tv.kenlive.co.ke",
  liveUrl: "https://tv.kenlive.co.ke",

  contact: {
    email: "info@kenlive.co.ke",
    phone: "+254 7XX XXX XXX", // Replace with your official phone number
    whatsapp: "+254 7XX XXX XXX", // Replace with your official WhatsApp number
    studioAddress: "KenLive Media Studios, Nairobi, Kenya",
    postalAddress: "P.O. Box 45000-00100, Nairobi, Kenya",
  },

  network: {
    newsWebsite: "https://kenlive.co.ke",
    radio: "https://radio.kenlive.co.ke",
    newspaper: "http://newspaper.kenlive.co.ke",
  },

  socials: {
    facebook: "https://www.facebook.com/people/Ken-livecoke/61551896525342/",
    twitter: "https://twitter.com/kenlive254",
    youtube: "https://www.youtube.com/@KENWAKURAYA",
    tiktok: "https://www.tiktok.com/@kenlive254", // Placeholder
    instagram: "https://www.instagram.com/kenlivetv", // Placeholder
    whatsappChannel: "https://whatsapp.com/channel/0029VaKenLivePlaceholder", // Placeholder
  },

  colors: {
    red: "#C30D12",
    redDark: "#9A0A0E",
    blue: "#0B5CAB",
    black: "#000000",
  },
};

export default SITE_CONFIG;

