// This script generates a sitemap with all articles from Firebase
// Run it before deploying: node scripts/generate-sitemap.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { writeFileSync } from 'fs';

// Firebase config (same as your app)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function generateSitemap() {
  const timeout = setTimeout(() => {
    console.error('⏱️ Sitemap generation timed out after 10 seconds');
    process.exit(1);
  }, 10000); // 10 second timeout

  try {
    console.log('Fetching articles from Firebase...');
    
    // Fetch all published articles with a timeout
    const articlesRef = collection(db, 'articles');
    const q = query(articlesRef, where('status', '==', 'published'));
    const snapshot = await getDocs(q);
    
    const articles = [];
    snapshot.forEach((doc) => {
      articles.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`Found ${articles.length} articles`);
    
    // Generate sitemap XML
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
  
  <!-- Admin -->
  <url>
    <loc>${baseUrl}/admin</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  
  <!-- Articles -->
`;
    
    // Add each article
    articles.forEach((article) => {
      const articleDate = article.updatedAt 
        ? new Date(article.updatedAt.seconds * 1000).toISOString().split('T')[0]
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
    
    // Write to public folder
    writeFileSync('public/sitemap.xml', sitemap);
    console.log('✅ Sitemap generated successfully at public/sitemap.xml');
    console.log(`📄 Total URLs: ${articles.length + 2}`);
    
    clearTimeout(timeout);
    process.exit(0); // Explicitly exit after success
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    console.error('Falling back to basic sitemap with homepage only');
    
    // Generate a fallback sitemap
    const baseUrl = 'https://radio.kenlive.co.ke';
    const currentDate = new Date().toISOString().split('T')[0];
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    writeFileSync('public/sitemap.xml', fallbackSitemap);
    console.log('✅ Fallback sitemap generated');
    
    clearTimeout(timeout);
    process.exit(0); // Exit successfully even on error (build should continue)
  }
}

generateSitemap();
