/**
 * KenLive TV - Shows Directory Configuration
 * ===========================================
 * Define all broadcast shows, presenters, and synopsis here.
 */

export interface Show {
  slug: string;
  title: string;
  swahiliTitle?: string;
  category: 'news' | 'politics' | 'business' | 'sports' | 'entertainment' | 'culture';
  shortDescription: string;
  fullDescription: string;
  presenter: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  airTimes: string;
  thumbnail: string;
  badge?: string;
  featured?: boolean;
}

export const SHOWS: Show[] = [
  {
    slug: "asubuhi-na-kenlive",
    title: "Asubuhi na KenLive",
    swahiliTitle: "Mapitio ya Magazeti na Habari za Asubuhi",
    category: "news",
    shortDescription: "Kenya's most engaging breakfast show featuring daily newspaper reviews, hot topics, and hard-hitting morning interviews.",
    fullDescription: "Wake up with KenLive every morning as our presenters unpack the day's national headlines, breaking county news, and front-page stories from all national newspapers. Featuring live studio guests, citizen phone-ins, traffic advisories, and weather outlooks across East Africa.",
    presenter: {
      name: "Ken Wakuraya & Anita Wambui",
      role: "Lead Morning Anchors",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      bio: "Veteran broadcast journalists bringing decades of trusted news experience and lively morning conversation."
    },
    airTimes: "Mon - Fri, 06:00 - 09:00 EAT",
    thumbnail: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80",
    badge: "MORNING FLAGSHIP",
    featured: true,
  },
  {
    slug: "kenlive-news-hour",
    title: "KenLive News Hour",
    swahiliTitle: "Habari Kamili na Taarifa ya Kitaifa",
    category: "news",
    shortDescription: "The authoritative primetime news bulletin covering national politics, breaking security updates, and investigative stories.",
    fullDescription: "KenLive News Hour delivers rigorous, independent journalism from every corner of Kenya. Our on-the-ground correspondents in Nairobi, Mombasa, Kisumu, Nakuru, and Eldoret provide live updates on events shaping the republic.",
    presenter: {
      name: "Ken Wakuraya",
      role: "Chief News Anchor",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      bio: "Esteemed broadcaster and media personality dedicated to fearless, people-first reporting."
    },
    airTimes: "Daily, 19:00 - 20:30 EAT & 21:00 - 22:00 EAT",
    thumbnail: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80",
    badge: "PRIMETIME BULLETIN",
    featured: true,
  },
  {
    slug: "politics-and-counties",
    title: "Politics & Counties",
    swahiliTitle: "Siasa za Kaunti na Bunge",
    category: "politics",
    shortDescription: "In-depth political dissection of parliamentary debates, Senate motions, governor accountability, and devolution milestones.",
    fullDescription: "From the floor of Parliament to county assemblies, 'Politics & Counties' holds leaders accountable to the constitution and citizen mandates. Features panel analyses, town halls, and live constituency field reports.",
    presenter: {
      name: "Sammy Otieno",
      role: "Senior Political Editor",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      bio: "Seasoned political analyst dissecting East African geopolitics and constitutional affairs."
    },
    airTimes: "Tue & Thu, 20:30 - 22:00 EAT",
    thumbnail: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80",
    badge: "POLITICS",
    featured: true,
  },
  {
    slug: "business-and-property",
    title: "Business & Property",
    swahiliTitle: "Biashara, Uchumi na Makazi",
    category: "business",
    shortDescription: "Your guide to Nairobi Securities Exchange trends, SACCO insights, SME growth hacks, agriculture trade, and real estate investments.",
    fullDescription: "Navigating Kenya's economic landscape with practical intelligence. We break down inflation data, tax reforms, real estate opportunities, agri-business profits, and currency movements for everyday Kenyans and investors.",
    presenter: {
      name: "Brenda Kilonzo",
      role: "Financial Markets Analyst",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      bio: "Chartered financial markets commentator with a passion for SME empowerment."
    },
    airTimes: "Mon & Wed, 14:00 - 15:30 EAT",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    badge: "BUSINESS",
    featured: true,
  },
  {
    slug: "sports-desk",
    title: "Sports Desk",
    swahiliTitle: "Dawati la Michezo",
    category: "sports",
    shortDescription: "Comprehensive coverage of FKF Premier League, English Premier League thrills, world-class Kenyan marathoners, and rugby sevens.",
    fullDescription: "KenLive Sports Desk puts you trackside and pitch-side. Exclusive interviews with world-record holders, grassroots football developments, Safari Rally highlights, and lively fan banter.",
    presenter: {
      name: "Dennis 'Deo' Mwangi",
      role: "Sports Anchor & Commentator",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
      bio: "Enthusiastic sports storyteller covering Kenyan athletics, local football, and global championships."
    },
    airTimes: "Mon - Fri, 17:30 - 18:30 EAT & Sat 15:00 EAT",
    thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
    badge: "SPORTS",
    featured: true,
  },
  {
    slug: "entertainment-live",
    title: "Entertainment Live",
    swahiliTitle: "Burudani Bila Kikomo",
    category: "entertainment",
    shortDescription: "Celebrating East Africa's vibrant music scene, Gengetone, Mugithi, Afrobeats, comedy, cinema, and celebrity spotlights.",
    fullDescription: "The weekend kicks off here with electrifying DJ sets, acoustic live studio sessions, celebrity red carpet interviews, fashion critiques, and comedy showcases celebrating creative talent across Kenya.",
    presenter: {
      name: "Faith 'Chep' Koech & DJ Sparks",
      role: "Entertainment Hosts",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
      bio: "Pulse-setters in Kenyan urban culture, music curation, and festival entertainment."
    },
    airTimes: "Fri & Sat, 21:00 - 23:30 EAT",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    badge: "WEEKEND VIBES",
    featured: true,
  },
  {
    slug: "usiku-wa-kenlive",
    title: "Usiku wa KenLive",
    swahiliTitle: "Mazungumzo ya Usiku",
    category: "culture",
    shortDescription: "Intimate late-night talk show discussing relationships, mental health, societal dilemmas, and inspirational survivor stories.",
    fullDescription: "Late nights on KenLive TV are for honest, unvarnished conversations. Viewers call in, send WhatsApp voice notes, and share candid perspectives on family, work stress, marriage, and youth empowerment.",
    presenter: {
      name: "Pastor David Ndung'u & Mercy Moraa",
      role: "Life & Culture Hosts",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80",
      bio: "Counselors and empathetic hosts creating a safe space for Kenyan nighttime audiences."
    },
    airTimes: "Daily, 23:00 - 01:00 EAT",
    thumbnail: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
    badge: "LATE NIGHT",
    featured: false,
  }
];

export default SHOWS;

