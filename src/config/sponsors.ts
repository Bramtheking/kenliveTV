/**
 * KenLive TV - Sponsors & Commercial Partners
 * ===========================================
 * Placeholder partners and advertising tiers.
 */

export interface Sponsor {
  name: string;
  category: string;
  logoText: string;
  accentColor: string;
}

export const SPONSORS_DATA: Sponsor[] = [
  { name: "Safaricom PLC", category: "Telecom & Data", logoText: "SAFARICOM", accentColor: "#00A551" },
  { name: "Equity Bank", category: "Banking & Financial Services", logoText: "EQUITY", accentColor: "#A62639" },
  { name: "KCB Group", category: "Financial Services", logoText: "KCB BANK", accentColor: "#84BD00" },
  { name: "East African Breweries", category: "Consumer Goods", logoText: "EABL", accentColor: "#D4AF37" },
  { name: "Kenya Airways", category: "Aviation & Travel", logoText: "KENYA AIRWAYS", accentColor: "#C30D12" },
  { name: "Brookside Dairies", category: "Agri-Business", logoText: "BROOKSIDE", accentColor: "#0B5CAB" },
];

export const AD_PACKAGES = [
  {
    title: "Live Squeeze-Back & Lower Thirds",
    swahili: "Matangazo ya Chini ya Runinga",
    description: "Display your 10-second banner during high-traction primetime bulletins without interrupting the live broadcast.",
    reach: "500,000+ Viewers / Day",
    slots: "During KenLive News Hour & Asubuhi",
    icon: "Tv",
  },
  {
    title: "Sponsored Show Segments",
    swahili: "Ufadhili wa Kipindi Maalum",
    description: "Own an entire high-impact segment (e.g. Business News, Sports Desk, Weather, or Agriculture) with presenter voiceovers.",
    reach: "Targeted Niche Demographics",
    slots: "Daily or Weekly Placements",
    icon: "Megaphone",
  },
  {
    title: "Digital Pre-Roll & Web Banners",
    swahili: "Matangazo ya Tovuti na Video ya Kidijitali",
    description: "Deliver clickable video pre-rolls before stream start and high-visibility banners across tv.kenlive.co.ke & app.",
    reach: "1.2M+ Monthly Pageviews",
    slots: "Instant Clickthrough to your website",
    icon: "Globe",
  },
  {
    title: "Outside Broadcast (OB) & Live Coverage",
    swahili: "Upeperushaji wa Moja kwa Moja wa Hafla",
    description: "Professional multi-camera HD broadcast for corporate AGMs, product launches, rallies, gospel crusades, and sports tournaments.",
    reach: "Full Live Stream + Social Syndication",
    slots: "Full-day or Multi-day production crew",
    icon: "Video",
  }
];

