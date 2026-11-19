const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = {
    type: process.env.GOOGLE_TYPE,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

exports.handler = async (event, context) => {
  console.log('=== Push Notification Function Called ===');
  console.log('Method:', event.httpMethod);
  
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    console.log('Invalid method:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('Checking environment variables...');
    console.log('GOOGLE_CLIENT_EMAIL:', process.env.GOOGLE_CLIENT_EMAIL ? 'SET' : 'MISSING');
    console.log('GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? 'SET (length: ' + process.env.GOOGLE_PRIVATE_KEY.length + ')' : 'MISSING');
    
    // Check if Firebase Admin is properly initialized
    if (!process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY.includes('YOUR_')) {
      console.error('Firebase Admin SDK not configured - missing credentials');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Firebase Admin SDK not configured. Please add service account credentials to environment variables.',
          details: 'Missing GOOGLE_PRIVATE_KEY or other credentials'
        }),
      };
    }
    
    console.log('Environment variables OK');

    const { tokens, title, message } = JSON.parse(event.body);

    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No FCM tokens provided' }),
      };
    }

    console.log(`Sending notifications to ${tokens.length} devices`);

    // Prepare the message
    const payload = {
      notification: {
        title: title || 'KenLive Radio',
        body: message || 'New update from KenLive Radio',
      },
      webpush: {
        headers: {
          Urgency: 'high',
        },
        notification: {
          icon: '/kenlive-logo.jpg',
          badge: '/kenlive-logo.jpg',
          vibrate: [200, 100, 200],
          tag: 'kenlive-notification',
          requireInteraction: false,
        },
      },
    };

    // Send to all tokens
    const response = await admin.messaging().sendEachForMulticast({
      tokens: tokens,
      ...payload,
    });

    console.log('Successfully sent messages:', response.successCount);
    console.log('Failed messages:', response.failureCount);

    // Collect per-token errors for easier debugging
    const errors = response.responses
      .map((r, idx) =>
        r.success
          ? null
          : {
              index: idx,
              token: tokens[idx],
              code: r.error?.code || r.error?.errorInfo?.code,
              message: r.error?.message || r.error?.errorInfo?.message,
            }
      )
      .filter(Boolean);

    if (errors.length) {
      console.warn('FCM send errors:', JSON.stringify(errors, null, 2));
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: response.failureCount === 0,
        successCount: response.successCount,
        failureCount: response.failureCount,
        errors,
      }),
    };
  } catch (error) {
    console.error('Error sending notifications:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
