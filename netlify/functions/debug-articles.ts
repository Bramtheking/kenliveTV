export const handler = async () => {
  try {
    const admin = require('firebase-admin');
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.GOOGLE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
          clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
          privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }

    const db = admin.firestore();
    
    // Get ALL articles without filtering
    const allArticles = await db.collection('articles').limit(5).get();
    
    const articlesData = allArticles.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        status: data.status || 'NO STATUS FIELD',
        hasStatus: 'status' in data,
        hasCreatedAt: 'createdAt' in data,
        allFields: Object.keys(data),
      };
    });
    
    const totalCount = await db.collection('articles').count().get();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        totalArticles: totalCount.data().count,
        sampleArticles: articlesData,
      }, null, 2),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
      }, null, 2),
    };
  }
};
