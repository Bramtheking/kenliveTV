/**
 * KenLive TV – Site & Brand Configuration
 * Edit contact info, social links, and network URLs here.
 */

export const SITE_CONFIG = {
  name: "KenLive TV",
  tagline: "Kenya's Premier Digital News & Entertainment Channel",
  domain: "tv.kenlive.co.ke",

  contact: {
    email: "info@kenlive.co.ke",
    phone: "+254 703 103677",
    whatsapp: "+254 703 103677",
    studioAddress: "KenLive Media Studios, Nairobi, Kenya",
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
    tiktok: "https://www.tiktok.com/@kenlive254",
    instagram: "https://www.instagram.com/kenlivetv",
    whatsappChannel: "https://whatsapp.com/channel/0029VaKenLivePlaceholder",
  },
} as const;

export default SITE_CONFIG;
