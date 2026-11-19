import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  try {
    // Import Firebase Admin SDK
    const admin = require('firebase-admin');
    
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      // Use existing GOOGLE_ env vars instead of adding new ones
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.GOOGLE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
          clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
          privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }

    const db = admin.firestore();
    
    // Fetch ALL articles (most don't have status field)
    // Only exclude articles that explicitly have status='draft'
    const articlesSnapshot = await db
      .collection('articles')
      .orderBy('createdAt', 'desc')
      .limit(1000)
      .get();

    const articles: any[] = [];
    articlesSnapshot.forEach((doc: any) => {
      const data = doc.data();
      // Include if: no status field OR status is 'published'
      if (!data.status || data.status === 'published') {
        articles.push({ id: doc.id, ...data });
      }
    });

    const baseUrl = 'https://radio.kenlive.co.ke';
    const currentDate = new Date().toISOString().split('T')[0];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
`;

    // Add articles
    articles.forEach((article) => {
      const articleDate = article.updatedAt 
        ? new Date(article.updatedAt._seconds * 1000).toISOString().split('T')[0]
        : currentDate;
      
      sitemap += `  <url>
    <loc>${baseUrl}/article/${article.id}</loc>
    <lastmod>${articleDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    sitemap += `</urlset>`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
      body: sitemap,
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return fallback sitemap
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://radio.kenlive.co.ke/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
      body: fallbackSitemap,
    };
  }
};
