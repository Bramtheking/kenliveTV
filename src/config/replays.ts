/**
 * KenLive TV - Replays & Video Clips Configuration
 * ==================================================
 * Placeholders for recent video clips, highlights, and full show replays.
 * YouTube video IDs can be updated here easily.
 */

export interface ReplayClip {
  id: string;
  youtubeId: string;
  title: string;
  showTitle: string;
  category: 'news' | 'politics' | 'business' | 'sports' | 'entertainment';
  duration: string;
  publishedAt: string;
  thumbnail: string;
  views: string;
  description: string;
}

export const REPLAYS_DATA: ReplayClip[] = [
  {
    id: "clip-1",
    youtubeId: "dQw4w9WgXcQ",
    title: "Ken Wakuraya Interviews Leaders on Nairobi Floods Mitigation & Housing",
    showTitle: "KenLive News Hour",
    category: "news",
    duration: "18:45",
    publishedAt: "2 hours ago",
    thumbnail: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=700&q=80",
    views: "24.5K",
    description: "Full panel breakdown on city infrastructure, county budget allocation, and urgent drainage works in Nairobi estates."
  },
  {
    id: "clip-2",
    youtubeId: "dQw4w9WgXcQ",
    title: "Asubuhi Review: Key Revelations in the 2026 National Budget Estimates",
    showTitle: "Asubuhi na KenLive",
    category: "business",
    duration: "24:10",
    publishedAt: "Yesterday",
    thumbnail: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=700&q=80",
    views: "42.1K",
    description: "Anita Wambui and Sammy Otieno unpack the new taxes, fuel levies, and expected impact on basic food prices."
  },
  {
    id: "clip-3",
    youtubeId: "dQw4w9WgXcQ",
    title: "Senate Grills Governors Over Unspent Health & Road Funds",
    showTitle: "Politics & Counties",
    category: "politics",
    duration: "15:20",
    publishedAt: "2 days ago",
    thumbnail: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=700&q=80",
    views: "18.9K",
    description: "Heated exchanges at the Senate oversight committee as auditors point out delays in dispensary medicine deliveries."
  },
  {
    id: "clip-4",
    youtubeId: "dQw4w9WgXcQ",
    title: "Harambee Stars Tactical Breakdown: Ready for AFCON Qualifiers?",
    showTitle: "Sports Desk",
    category: "sports",
    duration: "12:35",
    publishedAt: "3 days ago",
    thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=700&q=80",
    views: "31.2K",
    description: "Dennis Mwangi and guest coaches analyze team selection, midfield dynamics, and upcoming critical fixtures."
  },
  {
    id: "clip-5",
    youtubeId: "dQw4w9WgXcQ",
    title: "Mugithi Night Live: Ken Wakuraya & Live Band Special Performance",
    showTitle: "Entertainment Live",
    category: "entertainment",
    duration: "45:00",
    publishedAt: "Last weekend",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=80",
    views: "89.4K",
    description: "An unforgettable evening of live traditional guitar rhythms, classic Kenyan melodies, and energetic crowd dancing."
  },
  {
    id: "clip-6",
    youtubeId: "dQw4w9WgXcQ",
    title: "How Kenyan Avocado Exporters Are Conquering Asian Markets",
    showTitle: "Business & Property",
    category: "business",
    duration: "14:15",
    publishedAt: "5 days ago",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80",
    views: "16.7K",
    description: "Field feature with Murang'a and Eldoret smallholder farmers reaping big from cold-chain logistics."
  }
];

export default REPLAYS_DATA;

