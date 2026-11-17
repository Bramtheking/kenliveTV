/**
 * KenLive TV - WordPress REST API News Integration
 * ==================================================
 * Fetches curated news from https://kenlive.co.ke/wp-json/wp/v2/posts?_embed
 * Filters strictly for categories: business, health, politics, generalnews, sports.
 * Rejects casino/spam posts and requires a featured image and genuine news headline.
 */

export interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  url: string;
  featuredImageUrl: string;
  categoryName: string;
  publishedAt: string;
  timeAgo: string;
  authorName: string;
}

const ALLOWED_CATEGORY_SLUGS = ['business', 'health', 'politics', 'generalnews', 'sports'];

// High-grade fallback articles reflecting current Kenyan affairs if API is unreachable or CORS blocked
export const FALLBACK_ARTICLES: NewsArticle[] = [
  {
    id: 101,
    title: "Treasury Unveils Sh4.1 Trillion 2026/27 Budget Focus on County Roads & Affordable Healthcare",
    excerpt: "Cabinet Secretary highlights tax relief measures for local manufacturers and increased equitable share transfers to all 47 counties.",
    url: "https://kenlive.co.ke",
    featuredImageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80",
    categoryName: "Politics",
    publishedAt: "2026-11-17T09:30:00Z",
    timeAgo: "2 hours ago",
    authorName: "KenLive Politics Desk",
  },
  {
    id: 102,
    title: "Central Bank of Kenya Holds Benchmark Rate at 12.75% as Inflation Stabilises",
    excerpt: "Monetary Policy Committee notes stable shilling against the US dollar and robust tea and coffee export receipts.",
    url: "https://kenlive.co.ke",
    featuredImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    categoryName: "Business",
    publishedAt: "2026-11-17T08:15:00Z",
    timeAgo: "3 hours ago",
    authorName: "Brenda Kilonzo",
  },
  {
    id: 103,
    title: "Ministry of Health Dispatches Mobile Medical Clinics to Arid and Semi-Arid Counties",
    excerpt: "New universal health outreach targets maternal care and childhood immunization in Turkana, Marsabit, and Wajir.",
    url: "https://kenlive.co.ke",
    featuredImageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    categoryName: "Health",
    publishedAt: "2026-11-17T07:00:00Z",
    timeAgo: "4 hours ago",
    authorName: "KenLive Health Desk",
  },
  {
    id: 104,
    title: "Harambee Stars Squad Named for Critical AFCON Qualifier Clash in Nairobi",
    excerpt: "Head coach calls up in-form Europe-based professionals alongside standout FKF Premier League talents for home fixture.",
    url: "https://kenlive.co.ke",
    featuredImageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
    categoryName: "Sports",
    publishedAt: "2026-11-17T06:10:00Z",
    timeAgo: "5 hours ago",
    authorName: "Dennis Mwangi",
  },
  {
    id: 105,
    title: "Nairobi Expressway Expansion: Construction of Western Bypass Link Kicks Off",
    excerpt: "KenHA confirms new ramps designed to alleviate morning bottleneck traffic between Westlands, Kangemi, and Uthiru.",
    url: "https://kenlive.co.ke",
    featuredImageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80",
    categoryName: "General News",
    publishedAt: "2026-11-16T18:00:00Z",
    timeAgo: "Yesterday",
    authorName: "Anita Wambui",
  },
  {
    id: 106,
    title: "Kenya Tea Development Agency Announces Record Second Payment Bonus for Smallholders",
    excerpt: "Small-scale tea farmers across Central and Rift Valley celebrate increased payout following favourable global auction demand.",
    url: "https://kenlive.co.ke",
    featuredImageUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80",
    categoryName: "Business",
    publishedAt: "2026-11-16T14:30:00Z",
    timeAgo: "Yesterday",
    authorName: "KenLive Business Desk",
  }
];

function decodeHtml(html: string): string {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function calculateTimeAgo(dateString: string): string {
  try {
    const past = new Date(dateString).getTime();
    const now = Date.now();
    const diffSec = Math.floor((now - past) / 1000);

    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 172800) return "Yesterday";
    return `${Math.floor(diffSec / 86400)}d ago`;
  } catch {
    return "Recent";
  }
}

// Casino/gambling/spam keywords check to enforce clean broadcast presentation
const CASINO_KEYWORDS = [
  'casino', 'betting', 'slot', 'slots', 'jackpot', 'roulette', 'poker',
  'free spins', 'bonus deposit', 'gambling', 'pragmatic', 'bet9ja', '1xbet'
];

function isLegitNewsPost(title: string, excerpt: string): boolean {
  const text = (title + " " + excerpt).toLowerCase();
  for (const word of CASINO_KEYWORDS) {
    if (text.includes(word)) return false;
  }
  return true;
}

export async function fetchKenLiveNews(categorySlug?: string): Promise<{
  articles: NewsArticle[];
  isFallback: boolean;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    // 1. Fetch category IDs from WordPress
    const catUrl = `https://kenlive.co.ke/wp-json/wp/v2/categories?per_page=50`;
    const catRes = await fetch(catUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!catRes.ok) throw new Error(`Category fetch failed: ${catRes.status}`);
    const categories: any[] = await catRes.json();

    const allowedCategories = categories.filter((c: any) => 
      ALLOWED_CATEGORY_SLUGS.includes(c.slug.toLowerCase())
    );

    let targetCategoryIds: number[] = [];
    if (categorySlug && categorySlug !== 'all') {
      const match = allowedCategories.find((c: any) => c.slug.toLowerCase() === categorySlug.toLowerCase());
      if (match) targetCategoryIds = [match.id];
    } else {
      targetCategoryIds = allowedCategories.map((c: any) => c.id);
    }

    if (targetCategoryIds.length === 0) {
      return { articles: FALLBACK_ARTICLES, isFallback: true };
    }

    // 2. Fetch posts by category IDs
    const postUrl = `https://kenlive.co.ke/wp-json/wp/v2/posts?categories=${targetCategoryIds.join(',')}&per_page=12&_embed`;
    const postRes = await fetch(postUrl);
    if (!postRes.ok) throw new Error(`Post fetch failed: ${postRes.status}`);

    const posts: any[] = await postRes.json();

    const articles: NewsArticle[] = [];
    for (const post of posts) {
      // Must have featured media
      const media = post._embedded?.['wp:featuredmedia']?.[0];
      const imageUrl = media?.source_url || media?.media_details?.sizes?.large?.source_url || media?.media_details?.sizes?.medium_large?.source_url;

      if (!imageUrl) continue; // skip posts without featured image

      const cleanTitle = decodeHtml(post.title?.rendered || '').trim();
      const rawExcerpt = decodeHtml(post.excerpt?.rendered || '').replace(/<[^>]*>?/gm, '').trim();

      // Filter out spam/casino
      if (!isLegitNewsPost(cleanTitle, rawExcerpt)) continue;

      // Extract category name
      const postTerms = post._embedded?.['wp:term']?.[0] || [];
      const catObj = postTerms.find((t: any) => allowedCategories.some(ac => ac.id === t.id));
      const categoryName = catObj?.name ? decodeHtml(catObj.name) : "KenLive News";

      // Extract author
      const authorObj = post._embedded?.['author']?.[0];
      const authorName = authorObj?.name ? decodeHtml(authorObj.name) : "KenLive Desk";

      articles.push({
        id: post.id,
        title: cleanTitle,
        excerpt: rawExcerpt.slice(0, 160) + (rawExcerpt.length > 160 ? '...' : ''),
        url: post.link || "https://kenlive.co.ke",
        featuredImageUrl: imageUrl,
        categoryName,
        publishedAt: post.date,
        timeAgo: calculateTimeAgo(post.date),
        authorName,
      });

      if (articles.length >= 8) break;
    }

    if (articles.length === 0) {
      return { articles: FALLBACK_ARTICLES, isFallback: true };
    }

    return { articles, isFallback: false };
  } catch (error) {
    console.warn("Using fallback news feed (KenLive WP API unreachable or CORS):", error);
    if (categorySlug && categorySlug !== 'all') {
      const filtered = FALLBACK_ARTICLES.filter(a => a.categoryName.toLowerCase() === categorySlug.toLowerCase());
      return { articles: filtered.length > 0 ? filtered : FALLBACK_ARTICLES, isFallback: true };
    }
    return { articles: FALLBACK_ARTICLES, isFallback: true };
  }
}

